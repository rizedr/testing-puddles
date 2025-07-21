import React from 'react';

import { Button } from '@chakra-ui/react';

import { CashoutContent } from './CashoutContent';
import Link from 'next/link';
import { GinzaSurface } from '../GinzaModal';

export const Cashout = ({
    isOpen,
    onClose,
    cashoutAmount,
}: {
    isOpen: boolean;
    onClose: () => void;
    cashoutAmount: bigint;
}) => {
    return (
        <GinzaSurface
            isOpen={isOpen}
            onClose={onClose}
            title="Cash Out"
            content={<CashoutContent cashoutAmount={cashoutAmount} />}
            primaryButton={
                <Button variant="walletButton">
                    <Link href="/">Home page</Link>
                </Button>
            }
            secondaryButton={
                <Button variant="secondary" onClick={onClose}>
                    Spectate
                </Button>
            }
        />
    );
};
