"use client";

import { FC, useState, useCallback, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useStore } from "@/store/useStore";
import { executeConfidentialTransfer, requestAirdrop, getBalance } from "@/lib/arcium";

export const SendForm: FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { selectedToken, addTransaction, contacts } = useStore();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [txSignature, setTxSignature] = useState("");

  useEffect(() => {
    if (publicKey && connection) {
      getBalance(connection, publicKey).then(setBalance);
      
      const id = connection.onAccountChange(publicKey, (account) => {
        setBalance(account.lamports / LAMPORTS_PER_SOL);
      });
      
      return () => {
        connection.removeAccountChangeListener(id);
      };
    }
  }, [publicKey, connection]);

  const isValidAddress = useCallback((address: string) => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleAirdrop = async () => {
    if (!publicKey) return;
    setIsAirdropping(true);
    try {
      await requestAirdrop(connection, publicKey, 2);
      const newBalance = await getBalance(connection, publicKey);
      setBalance(newBalance);
    } catch (error) {
      console.error("Airdrop failed:", error);
    } finally {
      setIsAirdropping(false);
    }
  };

  const handleSend = async () => {
    if (!publicKey || !signTransaction) return;
    if (!recipient || !amount) return;
    if (!isValidAddress(recipient)) {
      setErrorMessage("Invalid recipient address");
      setStatus("error");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage("Invalid amount");
      setStatus("error");
      return;
    }

    if (amountNum > balance) {
      setErrorMessage("Insufficient balance");
      setStatus("error");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const result = await executeConfidentialTransfer(
        connection,
        publicKey,
        new PublicKey(recipient),
        amountNum,
        selectedToken,
        signTransaction
      );

      if (result.success && result.signature) {
        setStatus("success");
        setTxSignature(result.signature);
        
        addTransaction({
          signature: result.signature,
          type: "send",
          recipient,
          amount: amountNum,
          token: selectedToken,
          timestamp: Date.now(),
          status: "confirmed",
          isPrivate: true,
        });

        const newBalance = await getBalance(connection, publicKey);
        setBalance(newBalance);

        setTimeout(() => {
          setRecipient("");
          setAmount("");
          setStatus("idle");
        }, 5000);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Transfer failed");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="glass-card p-16 text-center">
        <p className="text-[#58586a]">Connect wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium text-[#e8e8ed] mb-1">
            Send Privately
          </h2>
          <p className="text-sm text-[#58586a]">
            Encrypted transfer via MPC
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#58586a] uppercase tracking-wider mb-1">Balance</p>
          <p className="text-2xl font-medium text-[#e8e8ed] font-mono">{balance.toFixed(4)}</p>
          <p className="text-xs text-[#58586a]">SOL</p>
        </div>
      </div>

      {balance < 0.1 && (
        <button
          onClick={handleAirdrop}
          disabled={isAirdropping}
          className="w-full mb-6 py-4 text-sm text-[#58586a] hover:text-[#9898a8] border border-dashed border-[#1a1a25] hover:border-[#252535] rounded-xl transition-all disabled:opacity-50"
        >
          {isAirdropping ? "Requesting..." : "Request Devnet SOL"}
        </button>
      )}

      {/* Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-[#9898a8] mb-3 font-medium">
            Recipient Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="pr-24"
            />
            {contacts.length > 0 && (
              <button
                onClick={() => setShowContacts(!showContacts)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#58586a] hover:text-[#9898a8] transition-colors font-medium"
              >
                Contacts
              </button>
            )}
            
            {showContacts && contacts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f15] border border-[#1a1a25] rounded-xl overflow-hidden z-10 shadow-2xl">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setRecipient(contact.address);
                      setShowContacts(false);
                    }}
                    className="w-full px-5 py-4 text-left hover:bg-[#151520] transition-colors flex items-center justify-between border-b border-[#1a1a25] last:border-0"
                  >
                    <span className="text-sm text-[#e8e8ed] font-medium">{contact.name}</span>
                    <span className="text-xs text-[#58586a] font-mono">
                      {contact.address.slice(0, 4)}...{contact.address.slice(-4)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {recipient && !isValidAddress(recipient) && (
            <p className="text-xs text-[#9898a8] mt-2">Invalid address format</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#9898a8] mb-3 font-medium">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
              className="pr-16 text-xl"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#58586a] font-medium">
              SOL
            </span>
          </div>
          <button 
            onClick={() => setAmount(Math.max(0, balance - 0.001).toFixed(4))}
            className="text-xs text-[#58586a] hover:text-[#9898a8] mt-3 transition-colors"
          >
            Use maximum
          </button>
        </div>

        {/* Privacy info */}
        <div className="py-5 px-6 bg-[#0a0a0f]/80 rounded-xl border border-[#1a1a25]">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#151520] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-[#58586a]">i</span>
            </div>
            <div>
              <p className="text-sm text-[#9898a8] font-medium mb-1">Encrypted Transfer</p>
              <p className="text-xs text-[#58586a] leading-relaxed">
                Amount will be encrypted. Only you and the recipient can see the value.
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        {status === "success" && (
          <div className="py-5 px-6 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <p className="text-sm text-emerald-400 font-medium mb-2">Transfer complete</p>
            <a 
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400/70 hover:text-emerald-400 font-mono transition-colors"
            >
              View on Explorer
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="py-5 px-6 bg-red-500/5 rounded-xl border border-red-500/20">
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSend}
          disabled={isLoading || !recipient || !amount || !isValidAddress(recipient) || parseFloat(amount) > balance}
          className="btn-primary w-full"
        >
          {isLoading ? "Processing..." : "Send Privately"}
        </button>
      </div>
    </div>
  );
};
