use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

use anchor_spl::token::{self, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_swap {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        init_price: u64
    ) -> Result<()> {
        if ctx.accounts.pool_state.is_initialized {
            return Err(SwapError::PoolInitialized.into());
        }

        let (authority, bump) = Pubkey::find_program_address(
            &[&ctx.accounts.pool_state.to_account_info().key.to_bytes()],
            ctx.program_id,
        );

        if ctx.accounts.mint_reserve_account.owner != authority {
            return Err(SwapError::InvalidOwner.into());
        }

        if ctx.accounts.mint_reserve_account.delegate.is_some() {
            return Err(SwapError::InvalidDelegate.into());
        }

        if ctx.accounts.mint_reserve_account.close_authority.is_some() {
            return Err(SwapError::InvalidCloseAuthority.into());
        }

        if init_price == 0 {
            return Err(SwapError::InvalidPrice.into());
        }

        if ctx.accounts.token_program.to_account_info().key() != token::ID {
            return Err(SwapError::InvalidTokenProgram.into());
        }

        if ctx.accounts.system_program.to_account_info().key() != system_program::ID {
            return Err(SwapError::InvalidSystemProgram.into());
        }

        let pool_state = &mut ctx.accounts.pool_state;


        pool_state.is_initialized = true;
        pool_state.price = init_price;
        pool_state.bump = bump;

        pool_state.mint_token = ctx.accounts.mint_reserve_account.mint;
        pool_state.mint_reserve_account = ctx.accounts.mint_reserve_account.to_account_info().key();

        pool_state.sol_reserve_account = ctx.accounts.sol_reserve_account.key();

        pool_state.token_program_id = ctx.accounts.token_program.key();
        pool_state.system_program_id = ctx.accounts.system_program.key();

        Ok(())
    }
}

#[account]
pub struct PoolState {
    pub is_initialized: bool,
    pub mint_token: Pubkey,
    pub mint_reserve_account: Pubkey,
    pub sol_reserve_account: Pubkey,
    pub bump: u8,
    pub price: u64,
    
    pub token_program_id: Pubkey,
    pub system_program_id: Pubkey,

}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(signer, zero)]
    pub pool_state: Box<Account<'info, PoolState>>,

    /// CHECK: doc comment explaining why no checks through types are necessary.
    #[account(mut)]
    pub sol_reserve_account: AccountInfo<'info>,


    /// CHECK: doc comment explaining why no checks through types are necessary.
    #[account(mut)]
    pub mint_reserve_account: Account<'info, TokenAccount>, 

    /// CHECK: doc comment explaining why no checks through types are necessary.
    pub token_program: AccountInfo<'info>,

    /// CHECK: doc comment explaining why no checks through types are necessary.
    pub system_program: AccountInfo<'info>
}

pub fn create_pda(
    program_id: &Pubkey,
    key_info: &Pubkey,
    bump_seed: u8,
) -> Result<Pubkey> {
    Pubkey::create_program_address(&[&key_info.to_bytes()[..32], &[bump_seed]], program_id)
        .or(Err(SwapError::CreatePDAFailed.into()))
}

#[error_code]
pub enum SwapError {
    #[msg("Pool account is initialized")]
    PoolInitialized,

    #[msg("Invalid owner account")]
    InvalidOwner,

    #[msg("Invalid delegate")]
    InvalidDelegate,

    #[msg("Invalid close authority")]
    InvalidCloseAuthority,

    #[msg("Invalid Price")]
    InvalidPrice,

    #[msg("Invalid token program account")]
    InvalidTokenProgram,

    #[msg("Invalid system program account")]
    InvalidSystemProgram,

    #[msg("Create PDA failed")]
    CreatePDAFailed,

    #[msg("Invalid swap authority")]
    InvalidSwapAuthority,

    #[msg("Invalid input account")]
    InvalidInputAccount,
}