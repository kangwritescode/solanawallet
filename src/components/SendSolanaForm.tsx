/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useCallback } from 'react'
import { Controller, useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { api } from '~/utils/api';

type FormValues = {
    recipientAddress: string,
    amount: string
}

const initialValues: FormValues = {
    recipientAddress: '',
    amount: ''
}

function SendSolanaForm() {
    const theme = useTheme()
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const recordTransaction = api.transaction.recordTransaction.useMutation();

    const sendSolana = useCallback(async (recipientAddress: string, amount: string) => {
        try {
            if (!publicKey) throw new WalletNotConnectedError();

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(recipientAddress),
                    lamports: parseFloat(amount) * 1e9
                })
            );

            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight }
            } = await connection.getLatestBlockhashAndContext();

            const signature = await sendTransaction(transaction, connection, { minContextSlot });
            const { context: { slot } } = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

            // Add Transaction to DB
            recordTransaction.mutate({
                transactionHash: signature,
                from: publicKey.toString(),
                to: recipientAddress,
                amount: parseFloat(amount) * 1e9,
                slotNumber: slot,
            });
            toast.success('Transaction recorded successfully!');
        }
        catch (error) {
            console.log(error)
        }
    }, [publicKey, connection, sendTransaction, recordTransaction]);

    const onSubmit = ({ recipientAddress, amount }: FormValues) => sendSolana(recipientAddress, amount);

    const { handleSubmit, control } = useForm({
        defaultValues: initialValues
    });

    return (
        <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            borderRadius={1}
            border={`1px solid ${theme.palette.grey[600]}`}
            padding={theme.spacing(3)}
            alignItems='center'
            textAlign='center'
            width={330}>
            <Stack>
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 3 }}>
                    Send SOL
                </Typography>
                <Controller
                    name={"recipientAddress"}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            size='small'
                            placeholder="Recipient Address"
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                            sx={{ marginBottom: 2 }}
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name={"amount"}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            size='small'
                            placeholder="Amount"
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                            sx={{ marginBottom: 2 }}
                            fullWidth
                        />
                    )}
                />
                <Button
                    fullWidth
                    variant='outlined'
                    size='large'
                    type='submit'
                    sx={{
                        borderRadius: 2,
                    }}>
                    Send
                </Button>
            </Stack>
        </Box>
    )
}

export default SendSolanaForm