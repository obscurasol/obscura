"use client";

import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";

export const Header: FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/70 backdrop-blur-2xl border-b border-[#1a1a25]/50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="Obscura" 
                width={32} 
                height={32}
                className="opacity-90"
              />
              <span className="text-xl font-medium tracking-tight text-[#e8e8ed]">
                Obscura
              </span>
            </Link>
            
            {connected && (
              <div className="badge ml-4">
                <span className="badge-dot" />
                <span>Devnet</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {connected && publicKey && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0a0a0f]/50 border border-[#1a1a25]">
                <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
                <span className="text-sm text-[#9898a8] font-mono">
                  {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                </span>
              </div>
            )}
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </header>
  );
};
