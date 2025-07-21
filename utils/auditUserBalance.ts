import { ConvexReactClient } from "convex/react";
import { api } from "../../../packages/convex/convex/_generated/api";
import { GameProgressStatus } from "../components/hooks/useGameHistory";
import { processGameHistory } from "../components/hooks/useGameHistory";
import { Id } from "../../../packages/convex/convex/_generated/dataModel";

/**
 * Performs a comprehensive audit of a user's balance by comparing their current balance
 * with the sum of all deposits, withdrawals, and game outcomes.
 * 
 * @param client The Convex client to use for queries
 * @param userId The user's ID to audit
 * @returns A promise with the audit result containing expected balance and discrepancy
 */
export async function auditUserBalance(client: ConvexReactClient, userId: string) {
  try {
    // Fetch the user's current balance
    const currentBalance = await client.query(api.tasks.getAccountBalance, { accountId: userId }) ?? 0n;
    const transactions = await client.query(api.users.getTransactionsForUser, { userId: userId as Id<'users'> });
    
    // Fetch user details to get username
    const user = await client.query(api.users.getUserById, { userId: userId as Id<'users'> });
    const username = user?.username || "Unknown User";
    
    const deposits = transactions.filter(tx => tx.type === 'DEPOSIT' && tx.status === 'COMPLETED');
    const withdrawals = transactions.filter(tx => tx.type === 'WITHDRAWAL' && tx.status === 'COMPLETED');
    
    const totalDeposits = deposits.reduce((sum, deposit) => sum + BigInt(deposit.amount), 0n);
    const totalWithdrawals = withdrawals.reduce((sum, withdrawal) => sum + BigInt(withdrawal.amount), 0n);
    
    const gameTransactions = await client.query(api.tasks.getGameTransactionsForUser, {
        userId: userId as Id<'users'>,
    }) ?? [];  
    const games = processGameHistory(gameTransactions);
    
    const totalBuyins = games.reduce(
        (acc, game) => acc + BigInt(game.buy_in),
        0n,
    );

    const totalCashouts = games.reduce(
            (acc, game) => acc + BigInt(game.cashout),
            0n,
        );

    const totalPnl = totalCashouts - totalBuyins;
    
    let hostRewards = 0n;
    try {
      const lifetimeRewards = await client.query(api.tasks.getLifetimeRewardsForUser, { userId: userId as Id<'users'> });
      hostRewards = BigInt(lifetimeRewards || 0);
    } catch (rewardsError) {
      console.warn("Could not fetch host rewards, continuing audit without rewards data:", rewardsError);
    }
    
    // Fetch affiliate rewards
    let affiliateRewards = 0n;
    try {
      const lifetimeAffiliateRewards = await client.query(api.tasks.getLifetimeAffiliateRewardsForUser, { userId: userId as Id<'users'> });
      affiliateRewards = BigInt(lifetimeAffiliateRewards || 0);
    } catch (affiliateError) {
      console.warn("Could not fetch affiliate rewards, continuing audit without affiliate reward data:", affiliateError);
    }
    
    const expectedBalance = totalDeposits - totalWithdrawals + totalPnl + hostRewards + affiliateRewards;
    const discrepancy = currentBalance - expectedBalance;
    
    return {
      userId,
      username,
      currentBalance,
      expectedBalance,
      discrepancy,
      details: {
        totalDeposits,
        totalWithdrawals,
        totalPnl,
        hostRewards,
        affiliateRewards,  // Add affiliateRewards to details
      },
      result: Number(discrepancy) < 1 ? "PASSED" : "FAILED",
    };
  } catch (error) {
    console.error("Error during user balance audit:", error);
    throw new Error("Failed to complete user balance audit: " + error);
  }
}


export async function logAuditResults(auditResult: Awaited<ReturnType<typeof auditUserBalance>>) {
  
  // TODO: add audit table later to track audit results / track failures/ flag suspicious accounts
  return auditResult;
} 