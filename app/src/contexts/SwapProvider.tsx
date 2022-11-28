import React, { useContext, useState } from "react";
import { Connection } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import {IDL, TokenSwap} from "../idl/token_swap";
import { SWAP_PROGRAM_ID } from "../constants";


export type SwapContext = {
    inputAmount: number;
    setInputAmount: (amount: number) => void;
};
const _SwapContext = React.createContext<null | SwapContext>(null);

export function SwapContextProvider(props: any) {
    const [inputAmount, _setInputAmount] = useState(props.inputAmount ?? 0);

    const setInputAmount = (amount: number) => {
        _setInputAmount(amount);
    };

    return (
        <_SwapContext.Provider
            value={{
                inputAmount,
                setInputAmount,
            }}
        >
            {props.children}
        </_SwapContext.Provider>
    );
}

export function useSwapContext(): SwapContext {
    const ctx = useContext(_SwapContext);
    if (ctx === null) {
        throw new Error("Context not available");
    }
    return ctx;
}

export default function useSwapProgram(conn: Connection): Program<TokenSwap> {
    const provider = new AnchorProvider(
        conn,
        {} as any,
        AnchorProvider.defaultOptions()
    );
    const program = new Program<TokenSwap>(
        IDL,
        SWAP_PROGRAM_ID.toBase58(),
        provider
    );
    return program;
}