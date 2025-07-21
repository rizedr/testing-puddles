'use client';

import React, { useState } from 'react';
import {
    VStack,
    Box,
    Text,
    HStack,
    Image,
    Link,
    Center,
} from '@chakra-ui/react';
import { ExternalLinkIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { TransactionControls } from './components/TransactionControls';
import { CHAIN_INFO } from '../../../../../packages/convex/convex/constants';
import { Transaction } from '../../../../../packages/convex/convex/users';
import { useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { OpacityCover } from '../page';

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const isPositive = transaction.type === 'DEPOSIT';
    const chainInfo = CHAIN_INFO[transaction.chainId] ?? {
        icon: '/GinzaCoin.png',
        name: 'Unknown',
        explorer: 'https://ginzacoin.com',
    };
    const formattedDate = new Date(transaction.timestamp).toLocaleString();

    let statusColor;
    let statusText;
    switch (transaction.status) {
        case 'COMPLETED':
            statusColor = 'brand.secondaryGreen';
            statusText = 'COMPLETED';
            break;
        case 'UNDER_REVIEW':
            statusColor = '#F8C171';
            statusText = 'UNDER REVIEW';
            break;
        case 'ERROR':
            statusColor = '#F8C171';
            statusText = 'UNDER REVIEW';
            break;
        case 'PENDING':
            statusColor = '#F8C171';
            statusText = 'IN PROGRESS';
            break;
        case 'FAILED':
            statusColor = 'red.400';
            statusText = 'FAILED';
            break;
        case 'REJECTED':
            statusColor = 'red.400';
            statusText = 'REJECTED';
            break;
    }

    return (
        <Box
            w="100%"
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%),rgb(23, 30, 65)"
            borderRadius="xl"
            border="1px solid"
            borderColor="purple.400"
            p={4}
        >
            <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                    <HStack spacing={4} alignSelf="flex-start">
                        <Box position="relative">
                            {isPositive ? (
                                <Center
                                    bg="green.500"
                                    borderRadius="full"
                                    w="24px"
                                    h="24px"
                                    border="1px solid white"
                                >
                                    <ArrowDownIcon
                                        color="white"
                                        boxSize={3}
                                        transform="rotate(45deg)"
                                    />
                                </Center>
                            ) : (
                                <Center
                                    bg="purple.600"
                                    borderRadius="full"
                                    w="24px"
                                    h="24px"
                                    border="1px solid white"
                                >
                                    <ArrowUpIcon
                                        color="white"
                                        boxSize={3}
                                        transform="rotate(45deg)"
                                    />
                                </Center>
                            )}
                            <Image
                                src={chainInfo.icon}
                                w="16px"
                                h="16px"
                                alt={chainInfo.name}
                                position="absolute"
                                bottom="-5px"
                                right="-5px"
                                bg="brand.gray45"
                                borderRadius="full"
                                p="1px"
                            />
                        </Box>
                        <Text color="white" fontSize="lg" fontWeight="bold">
                            {isPositive ? 'Deposit' : 'Withdrawal'}
                        </Text>
                    </HStack>
                    <VStack justify="space-between" align="flex-end">
                        <Box
                            as="span"
                            color={statusColor}
                            borderColor={statusColor}
                            border="1px solid"
                            borderRadius="0.5rem"
                            px="4px"
                            py="3.25px"
                            fontSize="12px"
                            fontWeight="semibold"
                            display="flex"
                            alignItems="center"
                        >
                            {statusText}
                        </Box>

                        <HStack spacing="8px" justify="flex-end" width="100%">
                            <Text
                                color="whiteAlpha.800"
                                fontSize="lg"
                                fontWeight="bold"
                            >
                                {isPositive ? '+' : '-'}
                                {(transaction.status === 'FAILED' || transaction.status === 'REJECTED') 
                                    ? '0.00' 
                                    : (Number(transaction.amount) / 1e6).toFixed(2)}
                            </Text>
                            <Image
                                src="/GinzaCoin.png"
                                w="24px"
                                h="24px"
                                alt="Ginza Coin"
                            />
                        </HStack>
                    </VStack>
                </HStack>
                <HStack spacing={4}>
                    <Text color="whiteAlpha.700" fontSize="sm">
                        {formattedDate}
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                        •
                    </Text>
                    {transaction.transactionHash && <Link
                        href={`${chainInfo.explorer}/tx/${transaction.transactionHash}`}
                        isExternal
                        color="whiteAlpha.500"
                        fontSize="sm"
                    >
                        {transaction.transactionHash.slice(0, 6)}...
                        {transaction.transactionHash.slice(-4)}
                        <ExternalLinkIcon mx="2px" />
                    </Link>}
                </HStack>
            </VStack>
        </Box>
    );
};

const TransactionsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Latest');
    const [statusFilter, setStatusFilter] = useState('All');

    const transactions: Transaction[] | undefined = useQuery(
        api.users.getTransactions,
    );

    const filteredTransactions = transactions
        ?.filter((tx) => {
            if (statusFilter !== 'All' && tx.status !== statusFilter) {
                return false;
            }
            return (
                tx.transactionHash?.includes(searchTerm) ||
                tx.amount.toString().includes(searchTerm)
            );
        })
        .sort((a, b) => {
            if (sortOption === 'Latest') {
                return b.timestamp - a.timestamp;
            }
            if (sortOption === 'Oldest') {
                return a.timestamp - b.timestamp;
            }
            if (sortOption === 'Highest Amount') {
                return Number(b.amount) - Number(a.amount);
            }
            return Number(a.amount) - Number(b.amount);
        });

    return (
        <Box
            backgroundImage={`url('/home_bg4.webp')`}
            backgroundSize="cover"
            backgroundPosition="top"
            minH="100vh"
            w="100%"
            position="relative"
            overflowY="auto"
            h="100vh"
        >
            <OpacityCover opacity={0.5} blurAmount={8} />
            <Box
                display="flex"
                justifyContent="center"
                w="100%"
                p="1.5rem"
                minH="100vh"
            >
                <VStack 
                    w="100%" 
                    spacing="52px" 
                    align="stretch"
                    pb="2rem"
                    maxW="1000px"
                    h="100%"
                >
                    <VStack
                        align="center"
                        w="100%"
                        mx="auto"
                        position="relative"
                        borderRadius="16px"
                        spacing={6}
                        px={8}
                        display="flex"
                        flexDirection="column"
                        mb="2rem"
                        flex="1"
                        overflowY="auto"
                    >
                        <Box w="100%" display="flex" justifyContent="center" mb="0.5rem">
                            <Image
                                src="/logos/Ginza Gaming_Logo System_Secondary_White.png"
                                alt="Ginza Logo"
                                width="auto"
                                height="60px"
                            />
                        </Box>
                        <TransactionControls
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                        />
                        <VStack 
                            spacing={4} 
                            align="stretch" 
                            w="100%"
                            pb="40px"
                        >
                            {filteredTransactions?.length === 0 ? (
                                <Text
                                    color="whiteAlpha.700"
                                    textAlign="center"
                                    py={8}
                                    fontSize="lg"
                                >
                                    No transactions found
                                </Text>
                            ) : (
                                filteredTransactions?.map((transaction) => (
                                    <TransactionCard
                                        key={transaction.timestamp}
                                        transaction={transaction}
                                    />
                                ))
                            )}
                        </VStack>
                    </VStack>
                </VStack>
            </Box>
        </Box>
    );
};

export default TransactionsPage;
