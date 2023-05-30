import React, { useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import SendSolanaForm from '~/components/SendSolanaForm';
import { useWallet } from '@solana/wallet-adapter-react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import TransactionTable from '~/components/TransactionTable';
import TransactionSearch from '~/components/TransactionSearch';
import { type SolanaTransaction } from '~/shared/types';
import TransactionModal from '~/components/TransactionModal';
import SolanaSvg from '~/assets/solana-sol-logo.svg';
import Image from 'next/image';

const Home: NextPage = () => {
    const [selectedTransaction, setSelectedTransaction] = useState<SolanaTransaction>();
    const { publicKey } = useWallet();
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Solana Wallet Prototype</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box
                position='relative'
                component='main'
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                minHeight='86vh'
            >
                <Box
                    position='absolute'
                    zIndex={0}
                    component={Image}
                    src={SolanaSvg as string}
                    alt="Solana Logo"
                    width="50%"
                    sx={{
                        opacity: 0.02,
                        pointerEvents: 'none',
                    }}
                />
                {publicKey ? (
                    <Stack
                        alignItems='center'
                        mb={16}
                        direction='column'
                        gap={5}
                        sx={{
                            [theme.breakpoints.up('sm')]: {
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                            },
                        }}>
                        <Stack>
                            <TransactionSearch onTransactionSelected={(transaction: SolanaTransaction) => setSelectedTransaction(transaction)} />
                            <TransactionTable onTransactionSelected={(transaction: SolanaTransaction) => setSelectedTransaction(transaction)} />
                        </Stack>
                        <SendSolanaForm />
                    </Stack>
                ) : <Typography zIndex={3} variant="h4">Please connect your wallet ☝️</Typography>}
            </Box>
            <TransactionModal
                isOpen={selectedTransaction !== undefined}
                onClose={() => setSelectedTransaction(undefined)}
                selectedTransaction={selectedTransaction}
            />
        </>
    );
};

export default Home;
