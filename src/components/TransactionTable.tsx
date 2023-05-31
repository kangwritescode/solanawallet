import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { api } from '~/utils/api';
import { truncateText } from '~/utils/truncateText';
import { useTheme } from '@mui/material';
import { lamportToSolana } from '~/utils/lamportToSolana';
import { useWallet } from '@solana/wallet-adapter-react';
import { type SolanaTransaction } from '~/shared/types';

interface TransactionTableProps {
    onTransactionSelected: (transaction: SolanaTransaction) => void;
}

export default function TransactionTable({ onTransactionSelected }: TransactionTableProps) {

    // Hooks
    const theme = useTheme();
    const { publicKey } = useWallet();

    // Queries
    const { data: transactions } = api.transaction.getTransactions.useQuery({
        walletId: publicKey?.toString()
    }, {
        enabled: !!publicKey
    });

    return (
        <TableContainer
            component={Paper}
            sx={{
                border: `1px solid ${theme.palette.divider}`,
            }}>
            <Table sx={{ color: theme.palette.grey[300] }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ py: 1 }}>Signature</TableCell>
                        <TableCell sx={{ py: 1 }}>From</TableCell>
                        <TableCell sx={{ py: 1 }}>To</TableCell>
                        <TableCell sx={{ py: 1 }}>SOL</TableCell>
                        <TableCell sx={{ py: 1 }}>Date</TableCell>
                        <TableCell sx={{ py: 1 }}>Slot Number</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions?.map((transaction) => {

                        const readableDate = transaction.timestamp.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                        });

                        return (
                            <TableRow
                                key={transaction._id.toString()}
                                onClick={() => onTransactionSelected(transaction)}
                                sx={{
                                    '&:hover': {
                                        background: theme.palette.grey[900],
                                        cursor: 'pointer',
                                    },
                                }}>
                                <TableCell sx={{ py: 1 }}>{truncateText(transaction.transactionHash, 8)}</TableCell>
                                <TableCell sx={{ py: 1 }}>{truncateText(transaction.from, 8)}</TableCell>
                                <TableCell sx={{ py: 1 }}>{truncateText(transaction.to, 8)}</TableCell>
                                <TableCell sx={{ py: 1 }}>{truncateText(lamportToSolana(transaction.amount), 8)}</TableCell>
                                <TableCell sx={{ py: 1 }}>{readableDate}</TableCell>
                                <TableCell sx={{ py: 1 }}>{truncateText(transaction.slotNumber, 8)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}