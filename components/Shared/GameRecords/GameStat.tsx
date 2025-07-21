import React from 'react';
import { Stat, StatLabel, StatNumber, Divider, HStack } from '@chakra-ui/react';

import { convertCurrencyToDisplay } from '../../utils/convertCurrency';

interface GameStatProps {
    label: string;
    value: bigint;
    statColor?: string;
    addSignage?: boolean;
}

export function GameStat({
    label,
    value,
    statColor = '#FFFFFF',
    addSignage,
}: GameStatProps) {
    return (
        <HStack>
            <Divider
                borderColor="rgba(255, 255, 255, 0.10)"
                orientation="vertical"
                h="1.25rem"
            />
            <Stat
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                textAlign="left"
            >
                <StatLabel
                    fontSize="12px"
                    color="rgba(255, 255, 255, 0.60)"
                    isTruncated
                >
                    {label}
                </StatLabel>
                <StatNumber color={statColor} fontSize="1rem">
                    {value < 0
                        ? `${addSignage ? '-' : ''}$${convertCurrencyToDisplay(value).slice(1)}`
                        : `${addSignage ? '+' : ''}$${convertCurrencyToDisplay(value)}`}
                </StatNumber>
            </Stat>
        </HStack>
    );
}
