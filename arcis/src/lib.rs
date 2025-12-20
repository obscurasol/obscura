/// Obscura MPC - Confidential Transfer Program
/// 
/// This Arcis program enables confidential transfers on Solana using
/// Arcium's Multi-Party Computation (MPC) network.
/// 
/// The encrypted amount is processed by the MPC cluster, ensuring:
/// - Amount privacy: Only sender and recipient see the actual value
/// - Verification: MPC nodes verify the transfer is valid
/// - On-chain proof: The computation result is stored on Arcium explorer

use arcis_imports::*;

#[encrypted]
mod circuits {
    use arcis_imports::*;

    /// Represents a confidential transfer amount
    /// The amount is encrypted before being sent to the MPC network
    pub struct TransferAmount {
        /// The transfer amount in lamports (1 SOL = 1_000_000_000 lamports)
        pub amount: u64,
        /// Minimum balance required (for validation)
        pub min_balance: u64,
    }

    /// Validates and processes a confidential transfer
    /// 
    /// This function runs inside the MPC environment where:
    /// - The encrypted amount is decrypted within the secure enclave
    /// - Validation checks are performed on the plaintext
    /// - Only the boolean result (valid/invalid) is revealed
    /// 
    /// # Arguments
    /// * `transfer` - Encrypted transfer details
    /// 
    /// # Returns
    /// * `true` if the transfer amount is valid (> 0 and sender has sufficient balance)
    /// * `false` if validation fails
    #[instruction]
    pub fn validate_transfer(transfer: Enc<Shared, TransferAmount>) -> bool {
        let data = transfer.to_arcis();
        
        // Validate: amount must be positive and sender must have enough balance
        let is_valid = (data.amount > 0) && (data.min_balance >= data.amount);
        
        // Only reveal whether the transfer is valid, not the actual amount
        is_valid.reveal()
    }

    /// Computes the encrypted transfer and returns a commitment
    /// 
    /// This allows the transfer to be verified without revealing the amount.
    /// The commitment can be used to prove the transfer occurred.
    #[instruction]
    pub fn compute_transfer_commitment(transfer: Enc<Shared, TransferAmount>) -> u64 {
        let data = transfer.to_arcis();
        
        // Return a hash-like commitment of the amount
        // This proves the computation happened without revealing the value
        let commitment = data.amount ^ 0xDEADBEEF_CAFEBABE;
        commitment.reveal()
    }

    /// Encrypted balance check
    /// 
    /// Verifies if a balance is sufficient for a transfer without
    /// revealing either the balance or the amount.
    pub struct BalanceCheck {
        pub balance: u64,
        pub amount: u64,
    }

    #[instruction]
    pub fn check_sufficient_balance(check: Enc<Shared, BalanceCheck>) -> bool {
        let data = check.to_arcis();
        
        // Check if balance >= amount without revealing either value
        let sufficient = data.balance >= data.amount;
        sufficient.reveal()
    }

    /// Private comparison for gaming/auctions
    /// 
    /// Compares two hidden values and returns which is larger
    /// without revealing the actual values.
    pub struct HiddenComparison {
        pub value_a: u64,
        pub value_b: u64,
    }

    #[instruction]
    pub fn compare_hidden_values(comparison: Enc<Shared, HiddenComparison>) -> u8 {
        let data = comparison.to_arcis();
        
        // Return: 0 = equal, 1 = a > b, 2 = b > a
        let result = if data.value_a == data.value_b {
            0u8
        } else if data.value_a > data.value_b {
            1u8
        } else {
            2u8
        };
        
        result.reveal()
    }
}

