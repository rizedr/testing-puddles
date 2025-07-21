'use client';

import {
    VStack,
    Text,
    Box,
    Flex,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useBreakpointValue,
} from '@chakra-ui/react';
import useViewer from '../../../components/hooks/useViewer';
import { GinzaSignInButton } from '../../../components/Shared/AuthButtons';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import WithdrawalsUnderReview from './WithdrawalsUnderReview';
import Withdrawals from './Withdrawals';
import AuditUser from './AuditUser';
import Users from './Users';
import Affiliates from './Affiliates';
import Transactions from './Transactions';
import Games from './Games';
import AdminRevenue from './AdminRevenue';
import AdminTransactionSummary from './AdminTransactionSummary';
import Vaults from './Vaults';

export const Admin: React.FC = () => {
    const { isAdmin, isModerator, isLoading } = useViewer();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    
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
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(129, 75, 182, 0.1) -100%, #0C0A16 52%),rgb(43, 49, 79)"
            borderRadius="16px"
        >
            <VStack
                w="100%"
                p="1rem"
                spacing="2rem"
                align="start"
            >
                <SignedIn>
                    <Tabs variant="line" colorScheme="purple" w="100%">
                        <TabList borderBottomColor="whiteAlpha.300" overflowX="auto" overflowY="hidden">
                            <Tab 
                                color="whiteAlpha.600" 
                                _hover={{ color: "whiteAlpha.800" }} 
                                _selected={{ color: "purple.300", borderColor: "purple.300" }}
                                _active={{ bg: "transparent" }}
                            >Main</Tab>
                            <Tab 
                                color="whiteAlpha.600" 
                                _hover={{ color: "whiteAlpha.800" }} 
                                _selected={{ color: "purple.300", borderColor: "purple.300" }}
                                _active={{ bg: "transparent" }}
                            >Users</Tab>
                            <Tab 
                                color="whiteAlpha.600" 
                                _hover={{ color: "whiteAlpha.800" }} 
                                _selected={{ color: "purple.300", borderColor: "purple.300" }}
                                _active={{ bg: "transparent" }}
                            >Affiliates</Tab>
                            <Tab 
                                color="whiteAlpha.600" 
                                _hover={{ color: "whiteAlpha.800" }} 
                                _selected={{ color: "purple.300", borderColor: "purple.300" }}
                                _active={{ bg: "transparent" }}
                            >GAMES</Tab>
                            <Tab 
                                color="whiteAlpha.600" 
                                _hover={{ color: "whiteAlpha.800" }} 
                                _selected={{ color: "purple.300", borderColor: "purple.300" }}
                                _active={{ bg: "transparent" }}
                            >TRANSACTIONS</Tab>
                            <Tab 
                                color="whiteAlpha.600" 
                                _hover={{ color: "whiteAlpha.800" }} 
                                _selected={{ color: "purple.300", borderColor: "purple.300" }}
                                _active={{ bg: "transparent" }}
                            >VAULTS</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Flex w="100%" gap="1.5rem" direction={isPortrait ? "column" : "row"}>
                                    {isPortrait && (
                                        <Box w="100%">
                                            <AuditUser />
                                        </Box>
                                    )}
                                    <VStack spacing="1.5rem" flex="3" align="center" w={isPortrait ? "100%" : undefined}>
                                        <WithdrawalsUnderReview />
                                        <AdminRevenue />
                                        <AdminTransactionSummary />
                                    </VStack>
                                    {!isPortrait && (
                                        <Box flex="2">
                                            <AuditUser />
                                        </Box>
                                    )}
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Users />
                            </TabPanel>
                            <TabPanel>
                                <Affiliates />
                            </TabPanel>
                            <TabPanel>
                                <Games />
                            </TabPanel>
                            <TabPanel>
                                <Transactions />
                            </TabPanel>
                            <TabPanel>
                                <Vaults />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
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

export default Admin;
