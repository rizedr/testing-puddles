import { VStack, Text } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';

export const TopUpExceededStep = () => {
    return (
        <VStack
            mt="3.125rem"
            spacing="2rem"
            h="100%"
            justify="center"
            align="center"
        >
            <Text fontSize="2rem" fontWeight="700">
                Limit Exceeded
            </Text>
            <WarningTwoIcon color="brand.secondaryOrange" boxSize="150px" />
            <Text textAlign="center">
                You cannot top up because you already have more than the maximum
                allowed buy-in.
            </Text>
        </VStack>
    );
};
