import { AppBar, Toolbar } from '@mui/material'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

interface LayoutProps {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
    // This is a hack to prevent the WalletMultiButton from rendering on the server
    const [didMount, setDidMount] = useState(false)
    useEffect(() => {
        setDidMount(true)
    }, [])
    return (
        <>
            <AppBar
                color='transparent'
                position='absolute'>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    {didMount && <WalletMultiButton style={{
                        borderRadius: 30,
                    }} />}
                </Toolbar>
            </AppBar>
            {children}
        </>
    )
}

export default Layout;