'use client';

import {
    VStack,
    Text,
    Box,
    Flex,
} from '@chakra-ui/react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import useViewer from '../../../components/hooks/useViewer';
import { GinzaSignInButton } from '../../../components/Shared/AuthButtons';
import Withdrawals from './Withdrawals';
import Deposits from './Deposits';

export const Transactions: React.FC = () => {
    const { isAdmin, isModerator, isLoading } = useViewer();
    
    if (isLoading || !(isAdmin || isModerator)) {
        return null;
    }

    return (
        <VStack
            maxW="1400px"
            align="start"
            w="100%"
            h="100%"
            position="relative"
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182"
            borderRadius="16px"
        >
            <VStack
                w="100%"
                p="1.5rem"
                spacing="2rem"
                align="start"
            >
                <SignedIn>
                    <Flex w="100%" direction="column" gap="1.5rem">
                        <VStack spacing="1.5rem" w="100%" align="center">
                            <Withdrawals />
                            <Box 
                                w="100%" 
                                p="1.5rem" 
                                bg="brand.gray60" 
                                borderRadius="16px" 
                                border="0.1rem solid" 
                                borderColor="purple.400"
                            >
                                <Deposits />
                            </Box>
                        </VStack>
                    </Flex>
                </SignedIn>
                <SignedOut>
                    <VStack w="100%" align="center" p="2rem">
                        <Text fontSize="lg" mb="1rem" color="white">
                            You must be signed in with an administrator account to access this page.
                        </Text>
                        <GinzaSignInButton />
                    </VStack>
                </SignedOut>
            </VStack>
        </VStack>
    );
};

export default Transactions;
