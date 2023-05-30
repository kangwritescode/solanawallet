import {
    AppBar,
    Toolbar,
    useTheme
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

    const theme = useTheme()

    return (
        <>
            <AppBar
                color='transparent'
                position='sticky'
                sx={{
                    background: theme.palette.background.default,
                }}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: 2,
                }}>
                    {didMount && <WalletMultiButton style={{
                        borderRadius: 30,
                        background: '#512da8',
                    }} />}
                </Toolbar>
            </AppBar>
            {children}
        </>
    )
}

export default Layout;