import { AppBar, Button, Toolbar } from '@mui/material'
import WalletModal from './WalletModal';
import { useEffect, useState } from 'react';
import getProvider from '~/utils/getProvider';
import { type PhantomProvider } from '~/shared/types';

interface LayoutProps {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
    const [provider, setProvider] = useState<PhantomProvider | undefined>();
    const [connected, setConnected] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const provider = getProvider();
        setProvider(provider);
    }, [])

    useEffect(() => {
        if (provider) {
            provider.on('connect', () => {
                setConnected(true);
                setModalIsOpen(false);
            })
            provider.on('disconnect', () => {
                setConnected(false);
            })
            setConnected(provider.isConnected || false);
        }
    }, [provider])

    return (
        <>
            <AppBar
                color='transparent'
                position='absolute'>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Button
                        onClick={provider && provider.isConnected ? () => provider.disconnect() : () => setModalIsOpen(true)}
                        variant='outlined'
                        sx={{
                            borderRadius: 10,
                            textTransform: 'none',
                        }}>
                        {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
                    </Button>
                </Toolbar>
            </AppBar>
            {children}
            <WalletModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                provider={provider}
            />
        </>
    )
}

export default Layout