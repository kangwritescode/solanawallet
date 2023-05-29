import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Layout from "~/components/Layout";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';

const MyApp: AppType = ({ Component, pageProps }) => {

    const theme = createTheme({
        palette: {
            mode: 'dark',
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
};

export default api.withTRPC(MyApp);
