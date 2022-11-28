import { PublicKey } from "@solana/web3.js";

require("dotenv").config();

// Token Mints
export const INPUT_MINT = "SOL";
export const OUTPUT_MINT = "MOVE";
export const MOVE_TOKEN = new PublicKey("ACTbGdXy513VaG3hiPw73raswaaRfxvS4KGGj7ZxG75");

// Program constants
export const SWAP_PROGRAM_ID = new PublicKey("2uwqgDaHuyyUx36e9LSaxRQStDfeMH1SrLQGo3xLSBWV");
export const POOL_STATE_ACCOUNT = new PublicKey("91FSSJxyAjJQ2WiPvh6hyhLBpKFDA7nUjiB3qDLBZWSc");


