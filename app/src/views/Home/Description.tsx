import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react';

const Description = () => {
    const { publicKey } = useWallet();

    return (
        <div className="w-full text-center pt-2">
            <div className="hero">
                <div className="text-center hero-content">
                    <div>
                        <h1 className="mb-5 text-5xl font-bold">
                            SOLANA SWAP
                        </h1>

                        <div className="max-w-md">
                            <p className="mb-5">Program only support on Testnet</p>
                            {publicKey
                                ? (
                                    <>Your address: {publicKey.toBase58()}</>
                                )
                                : (
                                    <div>
                                        <p>Wallet not connected</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description
