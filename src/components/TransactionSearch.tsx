import { Autocomplete, Box, Button, Stack, TextField, useTheme } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect } from 'react'
import { type SolanaTransaction } from '~/shared/types';
import { api } from '~/utils/api';
import { truncateText } from '~/utils/truncateText';

interface TransactionSearchProps {
    onTransactionSelected: (transaction: SolanaTransaction) => void;
}

function TransactionSearch({ onTransactionSelected }: TransactionSearchProps) {

    // State
    const [options, setOptions] = React.useState<SolanaTransaction[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const [formValue, setFormValue] = React.useState<SolanaTransaction | null>(null);

    // Hooks
    const { publicKey } = useWallet();

    // Queries
    const { data: transactionData } = api.transaction.getTransactionByHash.useQuery({
        walletId: publicKey?.toString(),
        transactionHash: inputValue
    }, {
        enabled: inputValue.length > 0
    });

    useEffect(() => {
        if (transactionData) {
            setOptions([transactionData])
        } else {
            setOptions([])
        }
    }, [transactionData, inputValue])

    const theme = useTheme()

    return (
        <Box
            component='form'
            key={0}
            onSubmit={() => undefined}
            sx={{
                padding: theme.spacing(2),
                border: `1px solid ${theme.palette.grey[600]}`,
                marginBottom: 3,
            }}>
            <Stack direction='row' justifyContent='space-between'>
                <Autocomplete
                    options={options}
                    noOptionsText="No transaction found"
                    onInputChange={(_, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    getOptionLabel={(option) => option.transactionHash}
                    filterOptions={x => x}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder='Enter confirmation hash'
                            size='small'
                            sx={{
                                width: 310,
                            }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: null,
                            }}
                            fullWidth
                        />
                    )}
                    onChange={(_, newValue) => setFormValue(newValue)}
                    value={formValue}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} tabIndex={0}>
                            <span>{truncateText(option.transactionHash, 30)}</span>
                        </Box>
                    )}
                />
                <Button
                    {...(transactionData && {
                        onClick: () => onTransactionSelected(transactionData),
                    })}
                    disabled={!transactionData}
                    fullWidth
                    sx={{
                        marginLeft: theme.spacing(2),
                    }}
                    size='small'
                    variant='outlined'>
                    View Transaction
                </Button>
            </Stack>
        </Box>
    )
}

export default TransactionSearch;
