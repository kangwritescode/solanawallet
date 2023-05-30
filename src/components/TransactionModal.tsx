/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Box, Button, Modal, type Theme, Typography, Table, TableRow, TableCell, TableBody, useTheme, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { type SolanaTransaction } from '~/shared/types';
import { truncateText } from '~/utils/truncateText';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTransaction?: SolanaTransaction;
}

function TransactionModal({ isOpen, onClose, selectedTransaction }: TransactionModalProps) {
    const theme = useTheme();

    const formattedTimestamp = selectedTransaction?.timestamp.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });

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
                        width: 'fit-content'
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
                <Typography
                    marginTop={2}
                    fontWeight='bold'>
                    Transaction Details
                </Typography>
                {selectedTransaction && (
                    <Table sx={{ color: theme.palette.grey[300], marginTop: 2 }}>
                        <TableBody>
                            {Object.entries(selectedTransaction).map(([key, value]) => (
                                <Tooltip
                                    key={key}
                                    title={key === 'timestamp' ? formattedTimestamp : value}
                                    arrow>
                                    <TableRow
                                        key={key}
                                        sx={{
                                            '&:hover': {
                                                background: theme.palette.grey[900],
                                                cursor: 'pointer',
                                            },
                                        }}>
                                        <TableCell align='right'>{key}</TableCell>
                                        <TableCell align='left'>{key === 'timestamp' ? formattedTimestamp : truncateText(value, 30)}</TableCell>
                                    </TableRow>
                                </Tooltip>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Modal >
    )
}



export default TransactionModal;