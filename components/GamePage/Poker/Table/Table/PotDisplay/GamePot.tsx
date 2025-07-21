import { Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { useMoneyDisplay } from '../../../../../Shared/MoneyDisplay';

export const GamePot = ({
    pot,
    streetPot,
}: {
    pot: bigint;
    streetPot: bigint;
}) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const potDisplay = useMoneyDisplay(pot);
    const totalPotDisplay = useMoneyDisplay(pot + streetPot);
    return (
        // <Flex position="relative">
        <Flex
            position="absolute"
            top={isPortrait ? '26%' : '25.5%'}
            left="50%"
            transform="translate(-50%, -50%)"
        >
            <Text
                fontSize={isPortrait ? '1.85vmax' : '2.1vmin'}
                variant="bold"
                color="brand.textWhite"
                bg="brand.darkestGray"
                borderRadius="full"
                px={isPortrait ? '1.55vmax' : '1.55vmin'}
                py={isPortrait ? '0.9vmax' : '0.95vmin'}
            >
                {potDisplay}
            </Text>
            <Text
                fontSize={isPortrait ? '1.1vmax' : '1.2vmin'}
                variant="bold"
                bg="brand.darkGray"
                position="absolute"
                color="#FFFFFF88"
                left="50%"
                top={isPortrait ? '-1.35vmax' : '-1.65vmin'}
                px={isPortrait ? '0.65vmax' : '0.8vmin'}
                py={isPortrait ? '0.225vmax' : '0.35vmin'}
                borderRadius="full"
                border="0.5px solid rgba(255, 255, 255, 0.25)"
                visibility={streetPot > 0 ? 'visible' : 'hidden'}
                transform="translateX(-50%)"
            >
                Total{' '}
                <span style={{ color: '#FFFFFF' }}>{totalPotDisplay}</span>
            </Text>
        </Flex>
    );
};
