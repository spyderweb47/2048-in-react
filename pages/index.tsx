// pages/index.tsx
import Head from "next/head";
import Image from "next/image";
import Board from "@/components/board";
import Score from "@/components/score";
import Navbar from "@/components/Navbar"; // Import the Navbar component
import styles from "@/styles/index.module.css";
import AuthLayer from "@/components/AuthLayer";
import React from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

// Setup queryClient and projectId
const queryClient = new QueryClient();
const projectId = 'YOUR_PROJECT_ID_HERE';

// Set up chains and metadata
const metadata = {
  name: '2048-dqn',
  description: '2048 Game',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, arbitrum] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
});

export default function Home() {
  return (
    <div className={styles.twenty48}>
      <Head>
        <title>Play 2048</title>
        <meta
          name="description"
          content="Fully-functional 2048 game built in NextJS and TypeScript. Including animations."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon16.png" />
      </Head>
      
      <Navbar /> {/* Full-width Navbar */}

      <header>
        <h1>2048</h1>
        <Score />
      </header>
      <main>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <AuthLayer>
              <Board username={""} wallet={""} />
            </AuthLayer>
          </QueryClientProvider>
        </WagmiProvider>
      </main>
      <footer>
        <div className={styles.socials}>
          <a
            href="https://github.com/spyderweb47"
            target="_blank"
            rel="noopener"
          >
            <Image
              src="social-github.svg"
              alt="2048-in-react on GitHub"
              width={32}
              height={32}
            />
          </a>
          <a href="https://twitter.com/dqnorg" target="_blank" rel="noopener">
            <Image
              src="social-twitter.svg"
              alt="DQN on Twitter"
              width={32}
              height={32}
            />
          </a>
        </div>
        <div>Made with ❤️ by 0000</div>
      </footer>
    </div>
  );
}
