'use client';

import {
    HStack,
    Box,
    Heading,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Tooltip,
    useToast,
    Flex,
    Text,
    useBreakpointValue,
    Button,
} from '@chakra-ui/react';
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, SearchIcon, CheckIcon, CloseIcon, RepeatIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';


export const Withdrawals = () => {
    const withdrawalsWithUsers = useQuery(api.withdrawals.batchGetWithdrawalsWithUsers);
    const toast = useToast();
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [auditedWithdrawals, setAuditedWithdrawals] = useState<Set<string>>(new Set());
    const [auditingUserId, setAuditingUserId] = useState<string | null>(null);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    const retryWithdrawal = useMutation(api.withdrawals.retryWithdrawal);
    
    const truncateId = (id: string) => {
        if (!id) return '';
        return `${id.slice(0, 4)}...${id.slice(-4)}`;
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    const formatAmount = (amount: string) => {
        const value = parseFloat(amount) / 1000000;
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: '2-digit' 
        }) + ' ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status: string) => {
        if (status === 'PENDING' || status === 'UNDER_REVIEW') return 'yellow.300';
        if (status === 'FAILED' || status === 'REJECTED' || status === 'ERROR') return 'red.400';
        if (status === 'COMPLETED') return 'green.400';
        return 'white';
    };

    const formatStatus = (status: string) => {
        if (status === 'UNDER_REVIEW') return 'REVIEW';
        return status;
    };

    const usernameLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        _hover: {
            textDecoration: 'underline',
        }
    };

    const handleAuditUser = (userId: string) => {
        setAuditingUserId(userId);
        
        setAuditedWithdrawals(prev => {
            const updated = new Set(prev);
            updated.add(userId);
            return updated;
        });
        
        document.getElementById('user-audit-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (auditingUserId && window) {
            const event = new CustomEvent('runAuditUser', { detail: { userId: auditingUserId } });
            window.dispatchEvent(event);
        }
    }, [auditingUserId]);

    const renderAuditIcon = (auditStatus: string | undefined) => {
        if (auditStatus === "PASSED") {
            return <CheckIcon color="green.400" />;
        } else if (auditStatus === "FAILED") {
            return <CloseIcon color="red.400" />;
        }
    };

    // Calculate pagination data
    const totalPages = withdrawalsWithUsers ? Math.ceil(withdrawalsWithUsers.length / itemsPerPage) : 0;
    const paginatedWithdrawalsWithUsers = withdrawalsWithUsers 
        ? withdrawalsWithUsers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        : [];
        
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Box w="100%">
            <Heading size="md" mb="1rem" color="white">Withdrawals (100 most recent)</Heading>
            <Box
                w="100%"
                p="1.5rem"
                bg="brand.gray60"
                borderRadius="16px"
                border="0.1rem solid"
                borderColor="purple.400"
            >
                {withdrawalsWithUsers === undefined ? (
                    <Spinner />
                ) : withdrawalsWithUsers.length === 0 ? (
                    <Text color="white">No withdrawals found</Text>
                ) : (
                    <Flex direction="column" w="100%" h="500px" position="relative">
                        <Box overflowX="auto" w="100%" flex="1" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">ID</Th>
                                        <Th color="purple.100" fontWeight="bold">User</Th>
                                        <Th color="purple.100" fontWeight="bold" textAlign="right">Amount</Th>
                                        <Th color="purple.100" fontWeight="bold">Status</Th>
                                        <Th color="purple.100" fontWeight="bold">
                                            <SearchIcon color="purple.100" />
                                        </Th>
                                        <Th color="purple.100" fontWeight="bold">Date</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedWithdrawalsWithUsers.map(({ withdrawal, user }) => (
                                        <Tr key={withdrawal._id}>
                                            <Td color="gray.300">
                                                <HStack spacing="2" justifyContent="space-between">
                                                    {!isPortrait && <Text>{truncateId(withdrawal._id)}</Text>}
                                                    <Tooltip label="Copy full ID">
                                                        <IconButton
                                                            aria-label="Copy ID"
                                                            icon={<CopyIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="purple.500"
                                                            _hover={{ bg: "purple.600" }}
                                                            onClick={() => copyToClipboard(withdrawal._id)}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white">
                                                <HStack spacing="2" justifyContent="space-between">
                                                    <Link 
                                                        href={`/profile/${withdrawal.userId}`}
                                                        target="_blank"
                                                        passHref
                                                    >
                                                        <Text
                                                            as="span"
                                                            sx={usernameLinkStyle}
                                                        >
                                                            {user ? user.username : truncateId(withdrawal.userId)}
                                                        </Text>
                                                    </Link>
                                                    <Tooltip label={auditedWithdrawals.has(withdrawal.userId) ? "Re-Audit" : "Audit"}>
                                                        <IconButton
                                                            aria-label={auditedWithdrawals.has(withdrawal.userId) ? "Re-Audit" : "Audit"}
                                                            icon={<SearchIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="blue.500"
                                                            _hover={{ bg: "blue.600" }}
                                                            onClick={() => handleAuditUser(withdrawal.userId)}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white">
                                                <Text textAlign="right" fontWeight="bold">{formatAmount(withdrawal.amount.toString())}</Text>
                                            </Td>
                                            <Td>
                                                <HStack spacing="2">
                                                <Text color={getStatusColor(withdrawal.status)} fontWeight="bold" textAlign="left" fontSize="sm">
                                                    {formatStatus(withdrawal.status)}
                                                </Text>

                                                {withdrawal.status === "ERROR" && (
                                                    <Tooltip label="Retry Withdrawal">  
                                                        <IconButton 
                                                            aria-label="Retry Withdrawal" 
                                                            icon={<RepeatIcon color="white" />} 
                                                            size="xs" 
                                                            variant="solid" 
                                                            bg="red.500" 
                                                            _hover={{ bg: "red.600" }} onClick={() => retryWithdrawal({withdrawalId: withdrawal._id })}>
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                </HStack>
                                            </Td>
                                            <Td textAlign="center">
                                                {renderAuditIcon(withdrawal.auditResult)}
                                            </Td>
                                            <Td color="gray.300">{formatDate(withdrawal._creationTime)}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                        
                        {/* Pagination Controls */}
                        <HStack mt="auto" pt={4} pb={2} justifyContent="center" spacing={4}>
                            <IconButton
                                aria-label="Previous Page"
                                icon={<ChevronLeftIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handlePrevPage}
                                isDisabled={currentPage === 0}
                            />
                            <Text color="white">
                                Page {currentPage + 1} of {totalPages || 1}
                            </Text>
                            <IconButton
                                aria-label="Next Page"
                                icon={<ChevronRightIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handleNextPage}
                                isDisabled={currentPage >= totalPages - 1}
                            />
                        </HStack>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default Withdrawals; 
