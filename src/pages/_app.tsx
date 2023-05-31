
import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { type AppType } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material";
import { Toaster } from 'react-hot-toast';
import CssBaseline from '@mui/material/CssBaseline';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, type Cluster } from "@solana/web3.js";
import '@solana/wallet-adapter-react-ui/styles.css';

import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {

    const theme = createTheme({
        palette: {
            mode: 'dark',
        }
    });

    const network: Cluster = WalletAdapterNetwork.Devnet;
    const endpoint: string = clusterApiUrl(network);

    const wallets = useMemo(
        () => [new UnsafeBurnerWalletAdapter()],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <Layout>
                            <Component {...pageProps} />
                            <Toaster position="bottom-left" reverseOrder={false} />
                        </Layout>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </ThemeProvider>
    );
};

export default api.withTRPC(MyApp);
