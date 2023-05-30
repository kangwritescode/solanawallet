import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
});
