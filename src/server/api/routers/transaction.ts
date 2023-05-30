import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type SolanaTransaction } from "~/shared/types";

export const transactionRouter = createTRPCRouter({
    recordTransaction: publicProcedure
        .input(z.object({
            transactionHash: z.string(),
            from: z.string(),
            to: z.string(),
            amount: z.number(),
            slotNumber: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { transactionHash, from, to, amount, slotNumber } = input;

            const result = await ctx.db.collection('transactions').insertOne({
                transactionHash,
                from,
                to,
                amount,
                slotNumber,
                timestamp: new Date(),
            });

            return result;
        }),
    getTransactions: publicProcedure
        .input(z.object({
            walletId: z.string(),
        }))
        .query(async ({ input, ctx }) => {

            const result = await ctx.db.collection<SolanaTransaction>('transactions').find({
                from: input.walletId,
            }).toArray();

            return result;
        }),
    getTransactionByHash: publicProcedure
        .input(z.object({
            walletId: z.string(),
            transactionHash: z.string(),
        }))
        .query(async ({ input, ctx }) => {

            const result = await ctx.db.collection<SolanaTransaction>('transactions').find({
                from: input.walletId,
                transactionHash: { $regex: `^${input.transactionHash}` }
            }).toArray();

            result.filter((transaction) => transaction.transactionHash === input.transactionHash)

            if (result.length > 0) {
                return result[0];
            }

            return null;
        }),
});
