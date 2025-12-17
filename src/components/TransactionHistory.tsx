"use client";

import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useStore, Transaction } from "@/store/useStore";

const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

interface TransactionRowProps {
  tx: Transaction;
  index: number;
}

const TransactionRow: FC<TransactionRowProps> = ({ tx, index }) => {
  const isOutgoing = tx.type === "send";
  const romanNumerals = ["I", "II", "III", "IV", "V"];
  
  return (
    <a
      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between py-4 px-4 -mx-4 rounded-xl hover:bg-[#151520] transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOutgoing ? 'bg-[#1a1a25]' : 'bg-emerald-500/10'}`}>
          <span className={`text-sm font-medium ${isOutgoing ? 'text-[#58586a]' : 'text-emerald-400'}`}>
            {romanNumerals[index] || (index + 1)}
          </span>
        </div>
        <div>
          <p className="text-sm text-[#e8e8ed] font-medium mb-0.5">
            {isOutgoing ? "Sent" : "Received"}
          </p>
          <p className="text-xs text-[#58586a] font-mono">
            {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-4)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium font-mono ${isOutgoing ? 'text-[#e8e8ed]' : 'text-emerald-400'}`}>
          {isOutgoing ? "-" : "+"}{tx.amount} SOL
        </p>
        <p className="text-xs text-[#58586a] mt-0.5">
          {formatTime(tx.timestamp)}
        </p>
      </div>
    </a>
  );
};

export const TransactionHistory: FC = () => {
  const { publicKey } = useWallet();
  const { transactions } = useStore();

  if (!publicKey) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-[#9898a8] uppercase tracking-wider font-medium">
          Recent Activity
        </h3>
        {transactions.length > 0 && (
          <span className="text-xs text-[#58586a] bg-[#151520] px-2 py-1 rounded-full">
            {transactions.length}
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-xl bg-[#151520] flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-medium text-[#58586a]">0</span>
          </div>
          <p className="text-sm text-[#58586a]">No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1a1a25]">
          {transactions.slice(0, 5).map((tx, index) => (
            <TransactionRow key={tx.id} tx={tx} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
