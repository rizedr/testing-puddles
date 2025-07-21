import { Grid, GridItem, Text, Box, Show } from '@chakra-ui/react';

import { formatMicroDollars } from '../../../../../../utils/formatMoney';
import { useRaiseActions } from './hooks/useRaiseActions';
import { useGetPlayerRaise } from '../../../../../../hooks/useGetPlayerRaise';
import useGameData from '../../../../../../hooks/useGameData';

interface RaiseActionsGridProps {
    setValue: (value: number, index: number) => void;
    selectedActionIndex: number | null;
    displayInBigBlinds?: boolean;
    bigBlindValue?: number;
}

export const RaiseActionsGrid = ({
    setValue,
    selectedActionIndex,
    displayInBigBlinds = false,
    bigBlindValue = 1000000,
}: RaiseActionsGridProps) => {
    const { raiseActions } = useRaiseActions();
    const { maxRaise } = useGetPlayerRaise();
    const { gameSettings, raiseOptions } = useGameData();
    const isPLO = gameSettings?.game_mode === 1; // 1 is PLO
    const potLimit = raiseOptions?.pot_raise || 0;

    // Format the value based on display preference
    const formatValue = (value: number): string => {
        if (displayInBigBlinds) {
            const bbValue = value / bigBlindValue;
            return `${bbValue.toFixed(1)} BB`;
        }
        return `$${formatMicroDollars(value)}`;
    };

    // Filter out "All In" option for PLO if it exceeds pot limit
    const filteredActions = raiseActions?.filter((action, index) => {
        if (action.name === 'All In' && isPLO && maxRaise > potLimit) {
            return false;
        }
        return true;
    });

    return (
        <Grid
            w="100%"
            templateColumns={`repeat(${filteredActions?.length || 1}, 1fr)`}
            gap={2}
        >
            {filteredActions?.map((action, index) => {
                const isSelected = index === selectedActionIndex;
                const isDisabled = action.value > maxRaise;
                
                return (
                    <GridItem key={index}>
                        <Box
                            background={
                                isSelected
                                    ? 'brand.primaryBlue'
                                    : isDisabled 
                                    ? 'brand.gray25'
                                    : 'brand.primaryGray'
                            }
                            cursor={isDisabled ? "not-allowed" : "pointer"}
                            px="0.25rem"
                            py="0.5rem"
                            textAlign="center"
                            onClick={() => !isDisabled && setValue(action.value, index)}
                            boxSizing="border-box"
                            border="1px solid"
                            borderColor={
                                isSelected
                                    ? 'brand.primaryBlue'
                                    : isDisabled
                                    ? 'rgba(255, 255, 255, 0.2)'
                                    : 'rgba(255, 255, 255, 0.5)'
                            }
                            borderRadius="0.5rem"
                            _hover={{
                                borderColor: isDisabled ? 'rgba(255, 255, 255, 0.2)' : 'brand.primaryBlue',
                                background: isDisabled ? 'brand.gray25' : 'brand.primaryBlueHover',
                                '& > *': {
                                    color: isDisabled ? 'brand.white50' : 'brand.accentWhite',
                                },
                            }}
                            _active={{
                                background: isDisabled ? 'brand.gray25' : 'brand.primaryBlueActive',
                            }}
                            opacity={isDisabled ? 0.7 : 1}
                        >
                            <Text
                                size="md"
                                textColor={
                                    isSelected
                                        ? 'brand.accentWhite'
                                        : isDisabled
                                        ? 'brand.white50'
                                        : 'brand.white70'
                                }
                                fontFamily="mono"
                            >
                                {action.name}
                            </Text>
                            <Show above="xl">
                                <Text
                                    size="md"
                                    variant="bold"
                                    textColor={
                                        isSelected
                                            ? 'brand.accentWhite'
                                            : isDisabled
                                            ? 'brand.white50'
                                            : 'brand.white70'
                                    }
                                >
                                    {formatValue(action.value)}
                                </Text>
                            </Show>
                        </Box>
                    </GridItem>
                );
            })}
        </Grid>
    );
};
