import { Chakra_Petch, League_Gothic } from "next/font/google";

// Display: League Gothic is the closest free match to the reference's condensed display face.
export const display = League_Gothic({ subsets: ["latin"], variable: "--font-ev-display", display: "swap" });
export const body = Chakra_Petch({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-ev-body", display: "swap" });
