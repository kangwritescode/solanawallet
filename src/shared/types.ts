/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    type PublicKey,
    type Transaction,
    type SendOptions
} from '@solana/web3.js';
import { type ObjectId } from 'mongodb';

type DisplayEncoding = 'utf8' | 'hex';

type PhantomEvent = 'connect' | 'disconnect' | 'accountChanged';

type PhantomRequestMethod =
    | 'connect'
    | 'disconnect'
    | 'signAndSendTransaction'
    | 'signTransaction'
    | 'signAllTransactions'
    | 'signMessage';

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

export interface PhantomProvider {
    publicKey: PublicKey | null;
    isConnected: boolean | null;
    signAndSendTransaction: (
        transaction: Transaction,
        opts?: SendOptions
    ) => Promise<{ signature: string; publicKey: PublicKey }>;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    signMessage: (message: Uint8Array | string, display?: DisplayEncoding) => Promise<any>;
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export type Status = 'success' | 'warning' | 'error' | 'info';

export interface TLog {
    status: Status;
    method?: PhantomRequestMethod | Extract<PhantomEvent, 'accountChanged'>;
    message: string;
    messageTwo?: string;
}

export interface SolanaTransaction {
    _id: ObjectId;
    transactionHash: string;
    from: string;
    to: string;
    amount: number;
    timestamp: Date;
    slotNumber: number;
}