import {
    Text,
    VStack,
    Box,
    HStack,
    Image,
    useBreakpointValue,
} from '@chakra-ui/react';
import { WinnerIcon } from '../WinnerIcon';

import { useQueries } from '@tanstack/react-query';
import { api } from '../../../../../../../../packages/convex/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useMoneyDisplay } from '../../../../../Shared/MoneyDisplay';

type PotType = 'MAIN' | 'SIDE';

interface WinnerAvatarsProps {
    winners?: string[];
    potType: PotType;
    amount: number;
    position?: 'left' | 'right' | 'center';
}

const PotTypeToText = {
    MAIN: (winnerCount: number) =>
        winnerCount > 1 ? 'MAIN POT WINNERS' : 'MAIN POT WINNER',
    SIDE: (winnerCount: number) =>
        winnerCount > 1 ? 'SIDE POT WINNERS' : 'SIDE POT WINNER',
};

export const PotWinners = ({
    winners,
    potType,
    amount,
    position = 'center',
}: WinnerAvatarsProps) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const size = isPortrait ? '3vmax' : '3vmin';
    const winnerCount = winners?.length || 0;
    const winnerText = PotTypeToText[potType](winnerCount);
    const convex = useConvex();
    const userQueries = useQueries({
        queries: winners?.map((player_id) => ({
            queryKey: ['user', player_id],
            queryFn: () =>
                convex.query(api.tasks.getUserByUserId, {
                    userId: player_id,
                }),
        })),
    });
    const moneyDisplay = useMoneyDisplay(amount);
    let left = '50%';
    let transform = 'translate(-50%, -50%)';
    if (!isPortrait) {
        if (position === 'left') {
            left = '40%';
        } else if (position === 'right') {
            left = '60%';
        }
    }
    return (
        <HStack
            alignItems="center"
            position="absolute"
            top="22%"
            left={left}
            transform={transform}
            bg="brand.darkestGray"
            borderRadius="full"
            pl="2.5rem"
            pr="2rem"
            pt="0.3rem"
            zIndex={2000}
        >
            {winners?.map((player_id, index) => (
                <Box
                    marginLeft="-1.875rem"
                    key={player_id}
                    zIndex={winners.length + index}
                    position="relative"
                    display="inline-block"
                >
                    <Box position="relative" display="inline-block">
                        {potType === 'MAIN' && (
                            <Box
                                position="absolute"
                                top="-30%"
                                left="-25%"
                                zIndex={1}
                                width="60%"
                                height="60%"
                            >
                                <WinnerIcon width="100%" height="100%" />
                            </Box>
                        )}
                        <Image
                            src={
                                userQueries[index]?.data?.imageUrl ?? undefined
                            }
                            alt="User Avatar"
                            width={size}
                            height={size}
                            borderRadius="50%"
                            objectFit="cover"
                        />
                    </Box>
                </Box>
            ))}
            <VStack spacing="-4px">
                <Text
                    pt="0.3125rem"
                    size="sm"
                    variant="bold"
                    fontSize={isPortrait ? '1.25vmax' : '1.35vmin'}
                    color="brand.white50"
                >
                    {winnerText}
                </Text>
                <Text
                    pb="0.3125rem"
                    size="sm"
                    // size={isPortrait ? '5.25vmax' : '5.25vmin'}
                    fontSize={isPortrait ? '1.35vmax' : '1.35vmin'}
                    variant="bold"
                    color="brand.winnerGreen"
                >
                    {moneyDisplay}
                    {winnerCount > 1 && ' ea.'}
                </Text>
            </VStack>
        </HStack>
    );
};
