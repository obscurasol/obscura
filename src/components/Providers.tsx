"use client";

import { FC, ReactNode, useMemo, useCallback } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletError } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  // Devnet endpoint for Arcium C-SPL testing
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
    []
  );

  // Let the wallet adapter auto-detect installed wallets
  // Empty array = auto-detect all standard wallets
  const wallets = useMemo(() => [], []);

  // Error handler
  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

