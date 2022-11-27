import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenSwap } from "../target/types/token_swap";

import { Connection, clusterApiUrl, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";


describe("token-swap", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TokenSwap as Program<TokenSwap>;

  const connection = new Connection(clusterApiUrl("testnet"), "confirmed");

  // Setup accounts
  // EpekTU4448UcLjo7rCcxPzL8okLnegSfHe3UZaPNqEu2
  const payer = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([73, 63, 147, 172, 117, 42, 221, 203, 56, 91, 240, 207, 151, 110, 216, 123, 183, 47, 238, 237, 126, 223, 228, 24, 68, 72, 179, 112, 40, 109, 177, 104, 205, 92, 233, 73, 141, 252, 35, 103, 100, 181, 165, 186, 229, 124, 181, 200, 133, 170, 100, 240, 209, 165, 197, 122, 62, 53, 131, 202, 53, 214, 13, 109])
  );

  // BN7T42mAa6VQdcff8ghpecGvRQndxSWpepi7iamFRWXu
  const solReserveAccount = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([200, 68, 121, 178, 95, 29, 207, 227, 65, 82, 106, 97, 27, 15, 56, 164, 65, 3, 124, 66, 14, 136, 213, 166, 123, 108, 228, 42, 166, 10, 67, 151, 153, 253, 91, 189, 147, 10, 236, 41, 151, 2, 90, 223, 234, 141, 208, 128, 194, 93, 32, 61, 0, 6, 174, 198, 12, 211, 175, 159, 220, 131, 230, 244])
  );

  // 8Msqf82MKfNcpKo71zHMSMPwVV1EQHD6tJVB71ogrSj8
  const userTest = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([58, 75, 42, 242, 62, 53, 223, 190, 189, 180, 160, 236, 30, 11, 79, 200, 225, 208, 14, 143, 112, 177, 196, 234, 185, 123, 44, 124, 18, 146, 68, 70, 109, 90, 232, 141, 212, 6, 43, 48, 5, 44, 203, 100, 51, 112, 193, 92, 206, 190, 97, 125, 167, 18, 34, 102, 37, 93, 205, 242, 249, 105, 0, 231])
  );

  const DEFAULT_TOKEN_DECIMALS = 9;
  const DEFAULT_POOL_MOVE_SUPPLY = 1_000_000;

  const INIT_PRICE = 10;

  let poolStateAccount: Keypair;
  let swapAuthority: PublicKey;
  let bump: number;
  let moveToken: Token;
  let poolMoveAccount: PublicKey;
  let userMoveATA: PublicKey;

  it("Test initialize pool!", async () => {
    poolStateAccount = new Keypair();
    console.log(`Pool state pubkey = ${poolStateAccount.publicKey.toBase58()}`);
    [swapAuthority, bump] = await PublicKey.findProgramAddress(
      [poolStateAccount.publicKey.toBuffer()],
      program.programId
    );

    moveToken = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      DEFAULT_TOKEN_DECIMALS,
      TOKEN_PROGRAM_ID,
    );
    console.log(`MOVE token pubkey = ${moveToken.publicKey.toBase58()}`);

    poolMoveAccount = await moveToken.createAccount(swapAuthority);
    console.log(`Pool MOVE account = ${poolMoveAccount.toBase58()}`);

    await moveToken.mintTo(
      poolMoveAccount,
      payer,
      [],
      DEFAULT_POOL_MOVE_SUPPLY * (10 ** DEFAULT_TOKEN_DECIMALS),
    );
    console.log("Minted 1_000_000 token MOVE in pool");

    const initPrice = new anchor.BN(INIT_PRICE);

    const initPoolTx = await program.methods
      .initializePool(initPrice)
      .accounts({
        poolState: poolStateAccount.publicKey,
        solReserveAccount: solReserveAccount.publicKey,
        mintReserveAccount: poolMoveAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([poolStateAccount])
      .preInstructions([await program.account.poolState.createInstruction(poolStateAccount)])
      .rpc();

    console.log(`Init pool txhash = ${initPoolTx}`);
  });

  it("Test swap SOL to MOVE", async () => {
    let userMoveATAInfo = await moveToken.getOrCreateAssociatedAccountInfo(userTest.publicKey);
    userMoveATA = userMoveATAInfo.address;
    console.log(`User MOVE ATA = ${userMoveATA.toBase58()}`)
    const inputAmount = new anchor.BN(1e8); // 0.1 SOL
    let tx = await program.methods
      .swap(inputAmount)
      .accounts({
        poolState: poolStateAccount.publicKey,
        swapAuthority: swapAuthority,
        userAuthority: userTest.publicKey,
        swapSolAccount: solReserveAccount.publicKey,
        swapMintAccount: poolMoveAccount,
        userMintAta: userMoveATA,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([userTest])
      .rpc();
    console.log(`Swap txhash = ${tx}`);
  })
});
