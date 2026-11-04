# Lume contract

This Rust contract is the single source file for Lume's financial layer. All contract implementation lives in `src/lib.rs`; it accepts deposits from one configured NEP-141 token contract through `ft_on_transfer`, tracks campaign balances in integer base units, and allows an authorized settlement coordinator to submit idempotent publisher batches.

Settlement batches use an atomic pull-payment model: a batch debits the campaign and credits publisher liabilities in one transaction. Publishers claim their recorded earnings individually through the approved token contract. A failed claim restores that publisher's liability in the callback, avoiding partial multi-publisher payouts.

The token contract is supplied at initialization and must be configured to an approved deployment. No token address is hardcoded.

Build guidance: install the NEAR Rust toolchain and `cargo-near`, then run `cargo near build` from this directory. Deployment and initialization are intentionally not performed by this repository.
