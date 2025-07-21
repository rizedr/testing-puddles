import { VStack, useBreakpointValue } from '@chakra-ui/react';

import { PotWinners } from './PotWinners';
type Pot = any;

interface WinningPotsProps {
    mainPot: Pot;
    sidePots: Pot[];
}

const calculatePotAmount = (
    amount: Pot['amount'],
    winners: Pot['winners'],
): number => {
    return (amount ?? 0) / (winners?.length || 1);
};

export const WinningPots: React.FC<WinningPotsProps> = ({
    mainPot,
    sidePots,
}) => {
    const mainPotWinners = mainPot?.winners;
    const mainPotAmount = calculatePotAmount(mainPot?.amount, mainPotWinners);
    const hasSidePots = sidePots && sidePots.length > 0 && sidePots.some(p => p?.winners?.length);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const bothPots = mainPotWinners && mainPotWinners.length > 0 && hasSidePots && !isPortrait;

    return (
        <VStack spacing="0.8rem" justify="center">
            <PotWinners
                winners={mainPotWinners}
                potType="MAIN"
                amount={mainPotAmount}
                position={bothPots ? 'left' : 'center'}
            />
            {sidePots?.map((sidePot, index) => {
                const sidePotWinners = sidePot?.winners;
                const sidePotAmount = calculatePotAmount(
                    sidePot?.amount,
                    sidePotWinners,
                );
                return (
                    <PotWinners
                        key={index}
                        winners={sidePotWinners}
                        potType="SIDE"
                        amount={sidePotAmount}
                        position={bothPots ? 'right' : 'center'}
                    />
                );
            })}
        </VStack>
    );
};
