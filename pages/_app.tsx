import type { AppProps } from "next/app";
import GameProvider from "@/context/game-context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GameProvider>
      <w3m-button />
      <Component {...pageProps} />

    </GameProvider>
  );
}


