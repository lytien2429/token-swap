import React, { FunctionComponent } from "react";
import { PublicKey, Connection, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { INPUT_MINT, MOVE_TOKEN, OUTPUT_MINT, POOL_STATE_ACCOUNT } from "../../constants";
import useSwapProgram, { useSwapContext } from "../../contexts/SwapProvider";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from "@project-serum/anchor";
import { notify } from "../../utils/notifications"

interface ISwapFormProps { }

const SwapForm: FunctionComponent<ISwapFormProps> = (props) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const swapProgram = useSwapProgram(connection);
  const { inputAmount, setInputAmount } = useSwapContext();


  const swapNowFn = async () => {
    console.log("Swap...");
    if (!publicKey) {
      console.log("err", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }
    console.log(`connection = ${connection.rpcEndpoint}`);
    try {
      const [swapAuthority, _] = await PublicKey.findProgramAddress(
        [POOL_STATE_ACCOUNT.toBuffer()],
        swapProgram.programId
      );
      const poolSate = await swapProgram.account.poolState.fetch(POOL_STATE_ACCOUNT);
      const [userMoveAta, createUserMoveAtaTx] = await getOrCreateATAInstruction(MOVE_TOKEN, publicKey, connection);
      const preInstructions: Array<TransactionInstruction> = [];
      createUserMoveAtaTx && preInstructions.push(createUserMoveAtaTx);
      let lamports = inputAmount * 1e9;
      let amountBN = new anchor.BN(lamports);

      let tx = await swapProgram.methods
        .swap(amountBN)
        .accounts({
          poolState: POOL_STATE_ACCOUNT,
          swapAuthority: swapAuthority,
          userAuthority: publicKey,
          swapSolAccount: poolSate.solReserveAccount,
          swapMintAccount: poolSate.mintReserveAccount,
          userMintAta: userMoveAta,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .preInstructions(preInstructions)
        .transaction();
      let txHash = await sendTransaction(tx, connection);
      console.log(`txHashSwap: ${txHash}`);
      notify({
        type: "success",
        message: "Swap successful!",
        txid: txHash,
      });

    } catch (error: any) {
      console.log('error', `${error?.message}`);
      notify({ type: 'error', message: `Error!`, description: error?.message });
    }

  }

  return (
    <div className="max-w-full md:max-w-lg">
      <div className="mb-2">
        <label htmlFor="inputMint" className="block text-sm font-medium">
          Input token
        </label>
        <select
          id="inputMint"
          name="inputMint"
          className="mt-1 bg-neutral block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option key={INPUT_MINT} value={INPUT_MINT}>
            SOL
          </option>
        </select>
      </div>

      <div className="mb-2">
        <label htmlFor="outputMint" className="block text-sm font-medium">
          Output token
        </label>
        <select
          id="outputMint"
          name="outputMint"
          className="mt-1 bg-neutral block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option key={OUTPUT_MINT} value={OUTPUT_MINT}>
            MOVE
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Input Amount (SOL)
        </label>
        <div className="mt-1">
          <input
            name="amount"
            id="amount"
            className="shadow-sm bg-neutral p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={inputAmount}
            type="number"
            onInput={(e: any) => {
              let value = parseFloat(e.target.value);
              setInputAmount(value);
              console.log(`input amount = ${value}`);
            }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="outputMint" className="block text-sm mt-2">
          Output Amount: {Number.isNaN(inputAmount)?"":10 * inputAmount + " MOVE"}
        </label>
        <label htmlFor="outputMint" className="block text-sm">
          Price: 1 SOL = 10 MOVE
        </label>
      </div>

      <div className="flex justify-center mt-2">
        <button
          type="button"
          disabled={Number.isNaN(inputAmount) || inputAmount <= 0}
          onClick={swapNowFn}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          SWAP NOW
        </button>
      </div>
    </div>
  );
};

export const getOrCreateATAInstruction = async (
  tokenMint: PublicKey,
  owner: PublicKey,
  connection: Connection,
): Promise<[PublicKey, TransactionInstruction?]> => {
  let toAccount;
  try {
    toAccount = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenMint, owner);
    const account = await connection.getAccountInfo(toAccount);
    if (!account) {
      const ix = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenMint,
        toAccount,
        owner,
        owner,
      );
      return [toAccount, ix];
    }
    return [toAccount, undefined];
  } catch (e) {
    /* handle error */
    console.error('Error::getOrCreateATAInstruction', e);
    throw e;
  }
};

export default SwapForm;
