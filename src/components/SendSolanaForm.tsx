import { Box, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast';
import { api } from '~/utils/api';

function SendSolanaForm() {

    // State
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Hooks
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const theme = useTheme();

    // Mutations
    const recordTransaction = api.transaction.recordTransaction.useMutation();

    const sendSolana = useCallback(async (recipientAddress: string, amount: string) => {
        try {
            setIsSending(true);
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
            await recordTransaction.mutateAsync({
                transactionHash: signature,
                from: publicKey.toString(),
                to: recipientAddress,
                amount: parseFloat(amount) * 1e9,
                slotNumber: slot,
            })
            setRecipientAddress('');
            setAmount('');
            toast.success('Transaction recorded successfully!');
            setIsSending(false)
        }
        catch ({message}: any) {
            toast.error(message as string);
            console.log(message)
            setIsSending(false);
        }
    }, [publicKey, connection, sendTransaction, recordTransaction]);



    return (
        <Box
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
                <TextField
                    size='small'
                    placeholder="Recipient Address"
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                    sx={{ marginBottom: 2 }}
                    fullWidth
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <TextField
                    size='small'
                    placeholder="Amount"
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                    sx={{ marginBottom: 2 }}
                    fullWidth
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <Button
                    disabled={!recipientAddress || !amount || isSending}
                    onClick={() => void sendSolana(recipientAddress, amount)}
                    fullWidth
                    variant='outlined'
                    size='large'
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