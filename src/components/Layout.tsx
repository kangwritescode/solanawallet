import {
    AppBar,
    Toolbar
} from '@mui/material'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    type ReactNode,
    useEffect,
    useState
} from 'react';

interface LayoutProps {
    children: ReactNode
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
                position='static'>
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