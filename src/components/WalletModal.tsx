import { Box, Button, Modal, type Theme, Typography } from '@mui/material'
import PhantomIcon from '~/assets/phantom-icon-purple.png';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import Image from 'next/image';
import { type PhantomProvider } from '~/shared/types';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: PhantomProvider | undefined;
}

function WalletModal({ isOpen, onClose, provider }: WalletModalProps) {

    const connectWallet = async () => {
        if (provider) {
            try {
                await provider.connect();
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            sx={(theme: Theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.grey[500],
            })}
        >
            <Box
                sx={(theme: Theme) => ({
                    alignItems: 'center',
                    background: theme.palette.background.default,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    outline: 'none',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    [theme.breakpoints.up('sm')]: {
                        border: `1px solid ${theme.palette.divider}`,
                        height: 'unset',
                        width: 400,
                    },
                })}>
                <Button
                    onClick={onClose}
                    color='inherit'
                    sx={(theme: Theme) => ({
                        position: 'absolute',
                        margin: 0,
                        padding: 0,
                        left: 0,
                        top: theme.spacing(2),
                    })}>
                    <CloseIcon />
                </Button>
                <Typography marginTop={2}>
                    Choose Wallet
                </Typography>
                <Button
                    fullWidth
                    sx={(theme: Theme) => ({
                        padding: theme.spacing(2),
                        marginTop: theme.spacing(2),
                        marginBottom: theme.spacing(1),
                        color: theme.palette.grey[200],
                        textTransform: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                    })}
                    disabled={!provider}
                    onClick={() => void connectWallet()}
                    variant='text'
                >
                    <Box
                        display='flex'>
                        <Box
                            sx={(theme: Theme) => ({
                                padding: theme.spacing(0.5),
                                borderRadius: 10,
                                border: `1px solid ${theme.palette.divider}`,
                                marginRight: 2
                            })}>
                            <Image src={PhantomIcon} alt={''} width={16} height={16} />
                        </Box>
                        Phantom
                    </Box>
                    {provider ? (
                        <Typography
                            color='lightseagreen'
                            fontSize={12}>
                            Detected
                        </Typography>
                    ) : undefined}
                </Button>
            </Box>
        </Modal>
    )
}

export default WalletModal