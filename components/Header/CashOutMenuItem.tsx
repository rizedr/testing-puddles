import { VStack, Text, useToast, MenuItem } from '@chakra-ui/react';

import { Action, playerAction, PlayerActionResponse } from '../../client';
import APIButton from '../Shared/APIButton';
import { Cashout } from '../Modals/CashoutModal/Cashout';
import { useHotkeyBlockingDisclosure } from '../hooks/useHotkeyBlockingDisclosure';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useGameId from '../hooks/useGameID';

interface CashOutMenuItemProps {
    isSpectator: boolean;
}

export const CashOutMenuItem = ({ isSpectator }: CashOutMenuItemProps) => {
    const gameId = useGameId();

    const toast = useToast();
    const [cashoutAmount, setCashoutAmount] = useState<bigint>(BigInt(0));

    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();

    const onCashoutSuccess = (data: PlayerActionResponse) => {
        setCashoutAmount(BigInt(data.data.amount));
        onOpen();
    };

    const onCashoutError = (e: Error) => {
        toast({
            title: 'Unable to cash out',
            status: 'error',
            duration: 2000,
        });
    };

    const router = useRouter();

    return (
        <MenuItem
            closeOnSelect={isSpectator}
            h="2.5rem"
            _hover={{
                bg: isSpectator
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.0)',
            }}
            as="div"
            onClick={() => {
                if (isSpectator) {
                    router.push('/');
                }
            }}
        >
            <VStack align="start" w="100%">
                {isSpectator && (
                    <Link href="/">
                        <Text
                            overflow="wrap"
                            overflowWrap="break-word"
                            variant="menuItem"
                            color="brand.textPrimary"
                        >
                            Exit Game
                        </Text>
                    </Link>
                )}
                {!isSpectator && (
                    <APIButton
                        endpoint={playerAction}
                        params={{
                            path: {
                                game_id: gameId,
                            },
                            body: {
                                action: Action.CASH_OUT,
                            },
                        }}
                        onSuccess={onCashoutSuccess}
                        onError={onCashoutError}
                        variant="walletButton"
                        width="100%"
                    >
                        Cash Out
                    </APIButton>
                )}
            </VStack>
            <Cashout
                isOpen={isOpen}
                onClose={onClose}
                cashoutAmount={cashoutAmount}
            />
        </MenuItem>
    );
};

export default CashOutMenuItem;
