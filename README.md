# Obscura

Private wallet-to-wallet transfers on Solana using Arcium's confidential computation.

## Overview

Obscura enables private token transfers on Solana by leveraging Arcium's Multi-Party Computation (MPC) network. Transaction amounts are encrypted and only visible to sender and recipient.

## Status

| Component | Status |
|-----------|--------|
| Network | Solana Devnet |
| Privacy Layer | Arcium C-SPL |
| Mainnet | Q1 2026 |

## Features

- Confidential transfers with encrypted amounts
- Multi-wallet support (Phantom, Solflare, Backpack)
- Real-time transaction history
- Contact address book
- Devnet faucet integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Solana wallet (Phantom recommended)

### Installation

```bash
git clone https://github.com/obscurasol/obscura.git
cd obscura
npm install
```

### Development

```bash
npm run dev
```

Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Usage

1. Connect wallet
2. Switch network to Devnet
3. Request devnet SOL via faucet (if needed)
4. Enter recipient address and amount
5. Confirm transaction

## Architecture

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page
│   ├── app/page.tsx    # Application UI
│   └── docs/page.tsx   # Documentation
├── components/
│   ├── Header.tsx
│   ├── SendForm.tsx
│   ├── TransactionHistory.tsx
│   ├── AddressBook.tsx
│   └── Providers.tsx
├── lib/
│   └── arcium.ts       # Arcium integration
└── store/
    └── useStore.ts     # State management
```

## Privacy Model

Obscura uses Arcium's MPC network to encrypt transaction amounts before they reach the blockchain. The encryption is performed across multiple nodes, ensuring no single party can decrypt the data.

```
Sender                    Arcium MPC              Blockchain
  |                           |                        |
  |  Amount: 100 SOL          |                        |
  |-------------------------->|                        |
  |                           |                        |
  |                    Encrypt via MPC                 |
  |                    Split into shares               |
  |                           |                        |
  |                           |  [encrypted blob]      |
  |                           |----------------------->|
  |                           |                        |

Public view:  [Wallet A] -> [encrypted] -> [Wallet B]
Participant:  [Wallet A] -> [100 SOL]   -> [Wallet B]
```

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Solana Wallet Adapter
- Zustand

## Roadmap

- [x] Core transfer UI
- [x] Wallet integration
- [x] Transaction history
- [x] Address book
- [ ] Arcium mainnet integration
- [ ] SPL token support
- [ ] Mobile optimization

## Resources

- [Arcium Documentation](https://docs.arcium.com/)
- [C-SPL Token Standard](https://www.arcium.com/articles/confidential-spl-token)
- [Solana Docs](https://docs.solana.com/)

## Links

- Website: [obscurasol.com](https://obscurasol.com)
- Twitter: [@obscura_arc](https://x.com/obscura_arc)

## License

MIT
