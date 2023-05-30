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

            console.log(result);

            return result;
        }),
    getTransactions: publicProcedure
        .query(async ({ ctx }) => {
            const result = await ctx.db.collection<SolanaTransaction>('transactions').find({}).toArray();

            return result;
        }),
});
