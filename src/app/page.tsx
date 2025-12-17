"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/50 backdrop-blur-2xl border-b border-[#1a1a25]/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Obscura" 
                width={28} 
                height={28}
                className="opacity-80"
              />
              <span className="text-lg font-medium text-[#e8e8ed]">Obscura</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#58586a] hover:text-[#9898a8] transition-colors">Features</a>
              <Link href="/games" className="text-sm text-[#58586a] hover:text-[#9898a8] transition-colors">Games</Link>
              <a href="#technology" className="text-sm text-[#58586a] hover:text-[#9898a8] transition-colors">Technology</a>
              <Link href="/docs" className="text-sm text-[#58586a] hover:text-[#9898a8] transition-colors">Docs</Link>
            </div>

            <Link href="/app" className="btn-secondary text-sm py-3 px-6">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Large centered logo */}
          <div className="flex justify-center mb-16 opacity-0 animate-fade-up">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-[#3a3a50]/20 rounded-full scale-150" />
              <Image 
                src="/logo.png" 
                alt="Obscura" 
                width={180} 
                height={180}
                className="relative opacity-90"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-10 opacity-0 animate-fade-up delay-100">
            <div className="badge">
              <span className="badge-dot" />
              <span>Powered by Arcium Network</span>
            </div>
          </div>
          
          {/* Main headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-medium text-[#e8e8ed] mb-8 leading-[1.05] tracking-tight opacity-0 animate-fade-up delay-200 glow-text">
            Send Crypto
            <br />
            <span className="gradient-text">Privately</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#9898a8] max-w-2xl mx-auto mt-8 leading-relaxed opacity-0 animate-fade-up delay-300">
            The first encrypted transfer protocol on Solana. 
            Your transaction amounts stay hidden from the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 opacity-0 animate-fade-up delay-400">
            <Link href="/app" className="btn-primary text-base py-4 px-10">
              Launch App
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base py-4 px-10">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-24 opacity-0 animate-fade-up delay-500">
            {[
              { value: "100%", label: "Encrypted" },
              { value: "<1s", label: "Finality" },
              { value: "MPC", label: "Technology" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-medium text-[#e8e8ed] mb-2">{stat.value}</p>
                <p className="text-sm text-[#58586a]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 border-t border-[#1a1a25]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm text-[#58586a] uppercase tracking-wider mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-medium text-[#e8e8ed] glow-text">
              Privacy by Default
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                numeral: "I",
                title: "Encrypted Amounts",
                desc: "Transaction values are encrypted using multi-party computation. Only sender and recipient can decrypt."
              },
              {
                numeral: "II",
                title: "No Trusted Setup",
                desc: "Built on Arcium's MPC network with no single point of failure. Truly decentralized encryption."
              },
              {
                numeral: "III",
                title: "Solana Speed",
                desc: "Sub-second transaction finality with negligible fees. Privacy doesn't have to be slow."
              },
              {
                numeral: "IV",
                title: "Non-Custodial",
                desc: "Your keys, your crypto. We never have access to your funds or private keys."
              },
              {
                numeral: "V",
                title: "Address Book",
                desc: "Save frequent recipients for quick transfers. Your contacts are stored locally."
              },
              {
                numeral: "VI",
                title: "Transaction History",
                desc: "Track all your private transfers with encrypted local storage."
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card p-8 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#151520] flex items-center justify-center mb-6 group-hover:bg-[#1a1a25] transition-colors">
                  <span className="text-lg font-medium text-[#58586a] group-hover:text-[#9898a8] transition-colors">
                    {feature.numeral}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-[#e8e8ed] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#58586a] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-32 px-8 border-t border-[#1a1a25]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm text-[#58586a] uppercase tracking-wider mb-4">Encrypted Games</p>
              <h2 className="text-4xl md:text-5xl font-medium text-[#e8e8ed] mb-8 glow-text">
                Shadow Duel
              </h2>
              <p className="text-lg text-[#9898a8] leading-relaxed mb-8">
                The first onchain game with truly hidden state. Allocate power across three rounds, 
                outsmart your opponent, winner takes the pot. All powered by Arcium's encrypted compute.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { numeral: "I", text: "Hidden allocation - opponent can't see your strategy" },
                  { numeral: "II", text: "Dramatic round-by-round reveal" },
                  { numeral: "III", text: "Stake SOL and compete for the pot" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#151520] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-[#58586a]">{item.numeral}</span>
                    </div>
                    <span className="text-[#9898a8]">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/games" className="btn-primary text-base py-4 px-10">
                Play Now
              </Link>
            </div>
            <div className="relative">
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <p className="text-xs text-[#58586a] uppercase tracking-wider mb-2">Shadow Duel</p>
                  <p className="text-2xl font-medium text-[#e8e8ed]">0.1 SOL Pot</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {['I', 'II', 'III'].map((numeral, i) => (
                    <div key={i} className="p-4 bg-[#0a0a0f] rounded-xl border border-[#1a1a25] text-center">
                      <p className="text-xs text-[#58586a] mb-2">ROUND {numeral}</p>
                      <p className="text-3xl font-medium text-[#3a3a50]">?</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-[#58586a] mb-4">
                  <span>Your allocation</span>
                  <span>10 power points</span>
                </div>
                <div className="h-2 bg-[#151520] rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-[#3a3a50] via-[#4a4a60] to-[#3a3a50] rounded-full animate-pulse" />
                </div>
                <p className="text-xs text-[#58586a] text-center mt-4">Encrypted until reveal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-8 border-t border-[#1a1a25]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm text-[#58586a] uppercase tracking-wider mb-4">How it Works</p>
            <h2 className="text-4xl md:text-5xl font-medium text-[#e8e8ed] glow-text">
              Three Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                numeral: "I",
                title: "Connect Wallet",
                desc: "Link your Solana wallet (Phantom, Solflare, etc.) to get started."
              },
              {
                numeral: "II",
                title: "Enter Details",
                desc: "Specify the recipient address and the amount you want to send."
              },
              {
                numeral: "III",
                title: "Send Privately",
                desc: "Confirm the transaction. The amount is encrypted before broadcast."
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#1a1a25] to-transparent" />
                )}
                <div className="glass-card p-8 text-center relative">
                  <div className="text-5xl font-medium text-[#1a1a25] mb-6">{item.numeral}</div>
                  <h3 className="text-xl font-medium text-[#e8e8ed] mb-3">{item.title}</h3>
                  <p className="text-sm text-[#58586a] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-32 px-8 border-t border-[#1a1a25]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm text-[#58586a] uppercase tracking-wider mb-4">Technology</p>
              <h2 className="text-4xl md:text-5xl font-medium text-[#e8e8ed] mb-8 glow-text">
                Powered by Arcium
              </h2>
              <p className="text-lg text-[#9898a8] leading-relaxed mb-8">
                Obscura leverages Arcium's Multi-Party Computation (MPC) network to encrypt transaction amounts. 
                This means your transfer values are never visible on-chain - only you and your recipient can see them.
              </p>
              <div className="space-y-4">
                {[
                  { numeral: "I", text: "Multi-Party Computation (MPC) for encryption" },
                  { numeral: "II", text: "Decentralized node network for security" },
                  { numeral: "III", text: "Zero-knowledge proofs for verification" },
                  { numeral: "IV", text: "Solana integration for speed and low fees" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#151520] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-[#58586a]">{item.numeral}</span>
                    </div>
                    <span className="text-[#9898a8]">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a 
                  href="https://arcium.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#58586a] hover:text-[#9898a8] transition-colors inline-flex items-center gap-2"
                >
                  Learn more about Arcium
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                    <div className="flex-1 h-2 bg-[#151520] rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-[#3a3a50] to-[#2a2a40] rounded-full" />
                    </div>
                    <span className="text-xs text-[#58586a]">Encrypting</span>
                  </div>
                  <div className="p-4 bg-[#0a0a0f] rounded-xl border border-[#1a1a25]">
                    <p className="text-xs text-[#58586a] mb-2">Encrypted Amount</p>
                    <p className="text-sm text-[#9898a8] font-mono break-all">
                      0x8a7f3d2e1b4c5f6a9e8d7c2b1a0f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0a0a0f] rounded-xl border border-[#1a1a25]">
                      <p className="text-xs text-[#58586a] mb-1">Sender</p>
                      <p className="text-sm text-[#9898a8] font-mono">7xKp...3mNq</p>
                    </div>
                    <div className="p-4 bg-[#0a0a0f] rounded-xl border border-[#1a1a25]">
                      <p className="text-xs text-[#58586a] mb-1">Recipient</p>
                      <p className="text-sm text-[#9898a8] font-mono">9dLw...5rTx</p>
                    </div>
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-xs text-[#58586a]">Amount hidden from public view</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 border-t border-[#1a1a25]/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-[#e8e8ed] mb-6 glow-text">
            Ready to send privately?
          </h2>
          <p className="text-lg text-[#9898a8] mb-12">
            Connect your wallet and make your first encrypted transfer.
          </p>
          <Link href="/app" className="btn-primary text-lg py-5 px-14">
            Launch App
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-[#1a1a25]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
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
              <span>Solana Devnet</span>
              <span className="w-1 h-1 rounded-full bg-[#58586a]" />
              <Link href="/games" className="hover:text-[#9898a8] transition-colors">
                Games
              </Link>
              <span className="w-1 h-1 rounded-full bg-[#58586a]" />
              <a href="https://x.com/obscura_arc" target="_blank" rel="noopener noreferrer" className="hover:text-[#9898a8] transition-colors">
                Twitter
              </a>
              <span className="w-1 h-1 rounded-full bg-[#58586a]" />
              <Link href="/docs" className="hover:text-[#9898a8] transition-colors">
                Docs
              </Link>
              <span className="w-1 h-1 rounded-full bg-[#58586a]" />
              <a href="https://arcium.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#9898a8] transition-colors">
                Arcium
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
