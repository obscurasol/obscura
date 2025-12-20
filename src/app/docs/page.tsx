"use client";

import Image from "next/image";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#08080a]/50 backdrop-blur-2xl border-b border-[#1c1c24]/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Image 
                  src="/logo.png" 
                  alt="Obscura" 
                  width={28} 
                  height={28}
                  className="opacity-80"
                />
                <span className="text-lg font-medium text-[#e8e8ed]">Obscura</span>
              </Link>
              <span className="text-[#58586a] mx-2">/</span>
              <span className="text-[#9898a8]">Docs</span>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/games"
                className="text-sm text-[#58586a] hover:text-[#9898a8] transition-colors"
              >
                Games
              </Link>
              <a 
                href="https://x.com/obscura_arc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#58586a] hover:text-[#9898a8] transition-colors"
              >
                Twitter
              </a>
              <Link href="/app" className="btn-secondary text-sm py-3 px-6">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 animate-fade-up">
            <div className="badge mb-6">
              <span className="badge-dot" />
              <span>Documentation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-[#e8e8ed] mb-6 glow-text">
              Obscura Documentation
            </h1>
            <p className="text-lg text-[#9898a8] leading-relaxed">
              Learn how to use Obscura for private, encrypted transfers on Solana.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="glass-card p-6 mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-sm text-[#58586a] uppercase tracking-wider mb-4">Contents</h3>
            <div className="space-y-2">
              {[
                { id: "introduction", title: "I. Introduction" },
                { id: "getting-started", title: "II. Getting Started" },
                { id: "how-it-works", title: "III. How It Works" },
                { id: "making-transfer", title: "IV. Making a Transfer" },
                { id: "shadow-duel", title: "V. Shadow Duel Game" },
                { id: "security", title: "VI. Security" },
                { id: "faq", title: "VII. FAQ" },
              ].map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-[#9898a8] hover:text-[#e8e8ed] transition-colors py-1"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* Introduction */}
            <section id="introduction" className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#16161c] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#58586a]">I</span>
                </div>
                <h2 className="text-2xl font-medium text-[#e8e8ed]">Introduction</h2>
              </div>
              <div className="glass-card p-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#9898a8] leading-relaxed mb-4">
                    Obscura is a privacy-focused transfer protocol built on Solana. It enables users to send tokens with encrypted transaction amounts, ensuring that only the sender and recipient can see the value being transferred.
                  </p>
                  <p className="text-[#9898a8] leading-relaxed mb-4">
                    Unlike traditional blockchain transactions where all details are publicly visible, Obscura leverages Multi-Party Computation (MPC) technology from the Arcium Network to encrypt sensitive transaction data.
                  </p>
                  <h4 className="text-[#e8e8ed] font-medium mt-6 mb-3">Key Features</h4>
                  <ul className="space-y-2 text-[#9898a8]">
                    <li>Encrypted transaction amounts</li>
                    <li>Non-custodial - you control your keys</li>
                    <li>Fast Solana-speed transactions</li>
                    <li>Simple, intuitive interface</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#16161c] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#58586a]">II</span>
                </div>
                <h2 className="text-2xl font-medium text-[#e8e8ed]">Getting Started</h2>
              </div>
              <div className="glass-card p-8">
                <div className="prose prose-invert max-w-none">
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Prerequisites</h4>
                  <ul className="space-y-2 text-[#9898a8] mb-6">
                    <li>A Solana wallet (Phantom, Solflare, or any Solana-compatible wallet)</li>
                    <li>SOL tokens for transaction fees</li>
                    <li>Tokens to transfer (currently on Devnet)</li>
                  </ul>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Step 1: Connect Your Wallet</h4>
                  <p className="text-[#9898a8] leading-relaxed mb-4">
                    Navigate to the Obscura app and click "Select Wallet" in the top right corner. Choose your preferred wallet from the list and approve the connection request.
                  </p>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Step 2: Get Devnet SOL</h4>
                  <p className="text-[#9898a8] leading-relaxed mb-4">
                    Since Obscura is currently running on Solana Devnet, you'll need Devnet SOL. Click "Request Devnet SOL" in the app to receive free test tokens.
                  </p>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Step 3: Make Your First Transfer</h4>
                  <p className="text-[#9898a8] leading-relaxed">
                    Enter a recipient address and the amount you wish to send. Click "Send Privately" to initiate the encrypted transfer.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#16161c] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#58586a]">III</span>
                </div>
                <h2 className="text-2xl font-medium text-[#e8e8ed]">How It Works</h2>
              </div>
              <div className="glass-card p-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#9898a8] leading-relaxed mb-6">
                    Obscura uses the Arcium Network's Multi-Party Computation (MPC) technology to encrypt transaction amounts. We integrate the official <code className="text-[#e8e8ed] bg-[#1c1c24] px-1.5 py-0.5 rounded">@arcium-hq/client</code> SDK for cryptographic operations.
                  </p>

                  <h4 className="text-[#e8e8ed] font-medium mb-4">Arcium SDK Integration</h4>
                  <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24] mb-6">
                    <p className="text-[#9898a8] text-sm leading-relaxed">
                      The Arcium Client SDK provides X25519 key exchange and Rescue cipher for secure encryption. When you make a transfer, your amount is encrypted client-side using a shared secret derived from your keypair and the Arcium MXE public key.
                    </p>
                  </div>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">The Process</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24]">
                      <p className="text-[#58586a] text-xs uppercase tracking-wider mb-2">Step I</p>
                      <p className="text-[#e8e8ed] font-medium mb-1">Key Exchange</p>
                      <p className="text-[#9898a8] text-sm">A session X25519 keypair is generated. The shared secret is computed with the Arcium MXE public key.</p>
                    </div>
                    <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24]">
                      <p className="text-[#58586a] text-xs uppercase tracking-wider mb-2">Step II</p>
                      <p className="text-[#e8e8ed] font-medium mb-1">Amount Encryption</p>
                      <p className="text-[#9898a8] text-sm">Your amount is encrypted using the Rescue cipher with a random 16-byte nonce.</p>
                    </div>
                    <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24]">
                      <p className="text-[#58586a] text-xs uppercase tracking-wider mb-2">Step III</p>
                      <p className="text-[#e8e8ed] font-medium mb-1">Transaction Creation</p>
                      <p className="text-[#9898a8] text-sm">A Solana transaction is created with the encrypted amount data and your public key.</p>
                    </div>
                    <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24]">
                      <p className="text-[#58586a] text-xs uppercase tracking-wider mb-2">Step IV</p>
                      <p className="text-[#e8e8ed] font-medium mb-1">Broadcast & Proof</p>
                      <p className="text-[#9898a8] text-sm">The transaction is sent to Solana. An encryption proof (key, nonce, hash) is displayed for verification.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Making a Transfer */}
            <section id="making-transfer" className="animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#16161c] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#58586a]">IV</span>
                </div>
                <h2 className="text-2xl font-medium text-[#e8e8ed]">Making a Transfer</h2>
              </div>
              <div className="glass-card p-8">
                <div className="prose prose-invert max-w-none">
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Transfer Fields</h4>
                  <ul className="space-y-3 text-[#9898a8] mb-6">
                    <li>
                      <span className="text-[#e8e8ed]">Recipient Address:</span> The Solana wallet address of the person you're sending to.
                    </li>
                    <li>
                      <span className="text-[#e8e8ed]">Amount:</span> The amount of SOL to send. This will be encrypted.
                    </li>
                  </ul>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Using the Address Book</h4>
                  <p className="text-[#9898a8] leading-relaxed mb-4">
                    Save frequently used addresses to your local address book for quick access. Click "Contacts" in the recipient field to select from saved addresses.
                  </p>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Transaction Fees</h4>
                  <p className="text-[#9898a8] leading-relaxed">
                    Standard Solana network fees apply (typically less than 0.001 SOL). There are no additional fees for using Obscura's privacy features.
                  </p>
                </div>
              </div>
            </section>

            {/* Shadow Duel Game */}
            <section id="shadow-duel" className="animate-fade-up" style={{ animationDelay: "0.55s" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#16161c] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#58586a]">V</span>
                </div>
                <h2 className="text-2xl font-medium text-[#e8e8ed]">Shadow Duel Game</h2>
              </div>
              <div className="glass-card p-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#9898a8] leading-relaxed mb-6">
                    Shadow Duel is the first onchain game with truly hidden state, powered by Arcium's encrypted compute. 
                    It's a strategic 3-round allocation game where your choices remain hidden until the dramatic reveal.
                  </p>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Game Overview</h4>
                  <p className="text-[#9898a8] leading-relaxed mb-6">
                    Two players stake SOL and secretly allocate 10 power points across 3 rounds. 
                    Neither player can see the other's allocation. Rounds reveal one-by-one, 
                    and whoever wins 2 out of 3 rounds takes the entire pot.
                  </p>

                  <h4 className="text-[#e8e8ed] font-medium mb-4">How to Play</h4>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24]">
                      <p className="text-[#58586a] text-xs uppercase tracking-wider mb-2">Step I - Create or Join</p>
                      <p className="text-[#9898a8] text-sm">Create a new duel by setting your stake amount, or join an existing game from the lobby. Your opponent must match your stake.</p>
                    </div>
                    <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24]">
                      <p className="text-[#58586a] text-xs uppercase tracking-wider mb-2">Step II - Allocate Power</p>
                      <p className="text-[#9898a8] text-sm">Distribute exactly 10 power points across Round I, II, and III. Your allocation is encrypted and hidden from your opponent. Strategy matters - do you go aggressive early or save for later rounds?</p>
                    </div>
                    <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24]">
                      <p className="text-[#58586a] text-xs uppercase tracking-wider mb-2">Step III - The Reveal</p>
                      <p className="text-[#9898a8] text-sm">Once both players lock in their allocations, rounds reveal one at a time. Higher power wins each round. Best of 3 takes the pot.</p>
                    </div>
                  </div>

                  <h4 className="text-[#e8e8ed] font-medium mb-4">Example Game</h4>
                  <div className="p-4 bg-[#0c0c10] rounded-xl border border-[#1c1c24] font-mono text-sm mb-6">
                    <p className="text-[#58586a] mb-2">Your allocation:     [7] [2] [1] = 10</p>
                    <p className="text-[#58586a] mb-4">Opponent allocation: [3] [3] [4] = 10</p>
                    <p className="text-[#9898a8]">Round I:   7 vs 3  = You win</p>
                    <p className="text-[#9898a8]">Round II:  2 vs 3  = They win</p>
                    <p className="text-[#9898a8]">Round III: 1 vs 4  = They win</p>
                    <p className="text-[#e8e8ed] mt-2">Result: Opponent wins 2-1</p>
                  </div>

                  <h4 className="text-[#e8e8ed] font-medium mb-4">Strategy Tips</h4>
                  <ul className="space-y-2 text-[#9898a8]">
                    <li><span className="text-[#e8e8ed]">Aggressive:</span> Go heavy on Round I (e.g., 6-2-2) to take an early lead</li>
                    <li><span className="text-[#e8e8ed]">Balanced:</span> Spread evenly (3-3-4) to stay competitive in all rounds</li>
                    <li><span className="text-[#e8e8ed]">Sandbagging:</span> Sacrifice Round I (1-4-5) to dominate later rounds</li>
                    <li><span className="text-[#e8e8ed]">Mind Games:</span> Your opponent can't see your allocation - use this to your advantage</li>
                  </ul>

                  <h4 className="text-[#e8e8ed] font-medium mt-6 mb-4">Why Hidden State Matters</h4>
                  <p className="text-[#9898a8] leading-relaxed">
                    On traditional blockchains, all game state is public - opponents could see your moves before acting. 
                    Shadow Duel uses Arcium's encrypted compute to keep allocations truly hidden until reveal time. 
                    This enables real strategic gameplay that was previously impossible onchain.
                  </p>
                </div>
              </div>
            </section>

            {/* Security */}
            <section id="security" className="animate-fade-up" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#16161c] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#58586a]">VI</span>
                </div>
                <h2 className="text-2xl font-medium text-[#e8e8ed]">Security</h2>
              </div>
              <div className="glass-card p-8">
                <div className="prose prose-invert max-w-none">
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Non-Custodial</h4>
                  <p className="text-[#9898a8] leading-relaxed mb-6">
                    Obscura never has access to your private keys or funds. All transactions are signed locally in your wallet before being broadcast.
                  </p>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Encryption Technology</h4>
                  <p className="text-[#9898a8] leading-relaxed mb-6">
                    We use Multi-Party Computation (MPC) from the Arcium Network, which allows computations on encrypted data without ever revealing the underlying values.
                  </p>
                  
                  <h4 className="text-[#e8e8ed] font-medium mb-4">Local Storage</h4>
                  <p className="text-[#9898a8] leading-relaxed">
                    Your address book and transaction history are stored locally in your browser. We do not collect or store any personal data on our servers.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="animate-fade-up" style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#16161c] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#58586a]">VII</span>
                </div>
                <h2 className="text-2xl font-medium text-[#e8e8ed]">FAQ</h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: "Is Obscura available on mainnet?",
                    a: "Currently, Obscura is running on Solana Devnet. We're working with Arcium to bring full MPC-encrypted transfers to mainnet soon."
                  },
                  {
                    q: "What wallets are supported?",
                    a: "Any Solana-compatible wallet works with Obscura, including Phantom, Solflare, Backpack, and others."
                  },
                  {
                    q: "Are there any fees?",
                    a: "Only standard Solana network fees apply. There are no additional fees for Obscura's privacy features."
                  },
                  {
                    q: "Can I send any SPL token?",
                    a: "Currently, only SOL transfers are supported. SPL token support is coming in a future update."
                  },
                  {
                    q: "How do I get Devnet SOL?",
                    a: "Connect your wallet to the app and click 'Request Devnet SOL' to receive free test tokens."
                  },
                  {
                    q: "How does Shadow Duel work?",
                    a: "Shadow Duel is a 3-round strategic game. Both players secretly allocate 10 power points across 3 rounds. Allocations are encrypted until reveal. Winner of 2 out of 3 rounds takes the pot."
                  },
                  {
                    q: "Is Shadow Duel fair?",
                    a: "Yes. Arcium's MPC ensures neither player can see the other's allocation until both have committed. The reveal happens on-chain with cryptographic guarantees."
                  },
                ].map((faq, i) => (
                  <div key={i} className="glass-card p-6">
                    <h4 className="text-[#e8e8ed] font-medium mb-2">{faq.q}</h4>
                    <p className="text-[#9898a8] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center animate-fade-up" style={{ animationDelay: "0.8s" }}>
            <p className="text-[#58586a] mb-6">Ready to try it out?</p>
            <Link href="/app" className="btn-primary">
              Launch App
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-[#1c1c24]/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Obscura" 
              width={24} 
              height={24}
              className="opacity-70"
            />
            <span className="text-[#9898a8]">Obscura</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-[#58586a]">
            <Link href="/" className="hover:text-[#9898a8] transition-colors">Home</Link>
            <Link href="/games" className="hover:text-[#9898a8] transition-colors">Games</Link>
            <a href="https://x.com/obscura_arc" target="_blank" rel="noopener noreferrer" className="hover:text-[#9898a8] transition-colors">
              Twitter
            </a>
            <a href="https://arcium.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#9898a8] transition-colors">
              Arcium
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


