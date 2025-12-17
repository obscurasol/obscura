"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useStore, Contact } from "@/store/useStore";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, address: string) => void;
}

const AddContactModal: FC<AddContactModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    try {
      new PublicKey(address);
    } catch {
      setError("Invalid address");
      return;
    }
    
    onAdd(name.trim(), address.trim());
    setName("");
    setAddress("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-card p-8 w-full max-w-md animate-fade-up">
        <h3 className="text-xl font-medium text-[#e8e8ed] mb-6">
          Add Contact
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-[#9898a8] mb-2 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm text-[#9898a8] mb-2 font-medium">Wallet Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana address"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactRowProps {
  contact: Contact;
  index: number;
  onDelete: (id: string) => void;
}

const ContactRow: FC<ContactRowProps> = ({ contact, index, onDelete }) => {
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#151520] flex items-center justify-center">
          <span className="text-sm font-medium text-[#58586a]">
            {romanNumerals[index] || (index + 1)}
          </span>
        </div>
        <div>
          <p className="text-sm text-[#e8e8ed] font-medium">{contact.name}</p>
          <p className="text-xs text-[#58586a] font-mono mt-0.5">
            {contact.address.slice(0, 8)}...{contact.address.slice(-6)}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => onDelete(contact.id)}
        className="text-xs text-[#58586a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-3 py-1.5 rounded-lg hover:bg-red-500/10"
      >
        Remove
      </button>
    </div>
  );
};

export const AddressBook: FC = () => {
  const { publicKey } = useWallet();
  const { contacts, addContact, removeContact } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  if (!publicKey) return null;

  return (
    <>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-[#9898a8] uppercase tracking-wider font-medium">
            Contacts
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-[#58586a] hover:text-[#9898a8] transition-colors font-medium"
          >
            + Add
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-[#151520] flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-medium text-[#58586a]">0</span>
            </div>
            <p className="text-sm text-[#58586a]">No contacts saved</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a25]">
            {contacts.map((contact, index) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                index={index}
                onDelete={removeContact}
              />
            ))}
          </div>
        )}
      </div>

      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(name, address) => addContact({ name, address })}
      />
    </>
  );
};
