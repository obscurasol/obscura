import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PublicKey } from "@solana/web3.js";

// Token definitions
export interface Token {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  logoURI?: string;
}

// Supported tokens on devnet
export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
];

// Transaction record
export interface Transaction {
  id: string;
  signature: string;
  type: "send" | "receive";
  recipient: string;
  amount: number;
  token: Token;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  isPrivate: boolean;
}

// Contact for address book
export interface Contact {
  id: string;
  name: string;
  address: string;
  createdAt: number;
}

interface ObscuraState {
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void;
  removeContact: (id: string) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;

  // UI State
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
}

export const useStore = create<ObscuraState>()(
  persist(
    (set, get) => ({
      // Transactions
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: crypto.randomUUID() },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),

      // Contacts
      contacts: [],
      addContact: (contact) =>
        set((state) => ({
          contacts: [
            {
              ...contact,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            },
            ...state.contacts,
          ],
        })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),
      updateContact: (id, updates) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      // UI State
      selectedToken: SUPPORTED_TOKENS[0],
      setSelectedToken: (token) => set({ selectedToken: token }),
    }),
    {
      name: "obscura-storage",
      partialize: (state) => ({
        transactions: state.transactions,
        contacts: state.contacts,
      }),
    }
  )
);

