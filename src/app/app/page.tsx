"use client";

import { Header } from "@/components/Header";
import { SendForm } from "@/components/SendForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { AddressBook } from "@/components/AddressBook";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function AppPage() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen relative z-10">
      <Header />

      <main className="pt-32 pb-32 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Not Connected State */}
          {!connected && (
            <div className="max-w-lg mx-auto text-center py-20 animate-fade-up">
              <div className="glass-card p-12">
                <div className="w-16 h-16 rounded-2xl bg-[#151520] flex items-center justify-center mx-auto mb-8">
                  <span className="text-2xl font-medium text-[#58586a]">I</span>
                </div>
                
                <h2 className="text-2xl font-medium text-[#e8e8ed] mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-[#58586a] mb-8 leading-relaxed">
                  Connect a Solana wallet to start making private transfers. 
                  Your transaction amounts will be encrypted.
                </p>

                <div className="flex justify-center mb-8">
                  <div className="badge">
                    <span className="badge-dot" />
                    <span>Solana Devnet</span>
                  </div>
                </div>

                <p className="text-xs text-[#58586a]">
                  Supports Phantom, Solflare, and other Solana wallets
                </p>
              </div>

              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-[#58586a] hover:text-[#9898a8] mt-8 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          )}

          {/* Connected State */}
          {connected && (
            <div className="animate-fade-up">
              <div className="mb-8">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-sm text-[#58586a] hover:text-[#9898a8] transition-colors"
                >
                  Back to Home
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <SendForm />
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <TransactionHistory />
                  <AddressBook />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-5 px-8 bg-[#050508]/70 backdrop-blur-2xl border-t border-[#1a1a25]/50 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#58586a]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span>Solana Devnet</span>
          </div>
          <span className="text-[#9898a8]">Obscura</span>
        </div>
      </footer>
    </div>
  );
}
