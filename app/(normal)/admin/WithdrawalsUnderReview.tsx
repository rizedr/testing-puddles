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
} from '@chakra-ui/react';
import { useQuery, useMutation } from "convex/react";
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, CheckIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';

export const WithdrawalsUnderReview = () => {
    const underReviewWithdrawalsWithUsers = useQuery(api.withdrawals.getUnderReviewWithdrawalsWithUsers);
    const approveWithdrawalMutation = useMutation(api.withdrawals.approveWithdrawal);
    const rejectWithdrawalMutation = useMutation(api.withdrawals.rejectWithdrawal);
    const toast = useToast();
    const [reviewPage, setReviewPage] = useState(0);
    const itemsPerPage = 5;
    const [auditedWithdrawals, setAuditedWithdrawals] = useState<Set<string>>(new Set());
    const [auditingUserId, setAuditingUserId] = useState<string | null>(null);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    
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

    const usernameLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        _hover: {
            textDecoration: 'underline',
        }
    };

    // Calculate pagination data for under review withdrawals
    const totalReviewPages = underReviewWithdrawalsWithUsers ? Math.ceil(underReviewWithdrawalsWithUsers.length / itemsPerPage) : 0;
    const paginatedUnderReviewWithdrawals = underReviewWithdrawalsWithUsers 
        ? underReviewWithdrawalsWithUsers.slice(reviewPage * itemsPerPage, (reviewPage + 1) * itemsPerPage)
        : [];
        
    const handleNextReviewPage = () => {
        if (reviewPage < totalReviewPages - 1) {
            setReviewPage(reviewPage + 1);
        }
    };
    
    const handlePrevReviewPage = () => {
        if (reviewPage > 0) {
            setReviewPage(reviewPage - 1);
        }
    };

    const handleApproveWithdrawal = async (withdrawalId: string) => {
        try {
            await approveWithdrawalMutation({ withdrawalId: withdrawalId as Id<"withdrawals" | "withdrawalsV2"> });
            toast({
                title: "Withdrawal approved",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
        } catch (error) {
            toast({
                title: "Error approving withdrawal",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    };

    const handleRejectWithdrawal = async (withdrawalId: string) => {
        try {
            await rejectWithdrawalMutation({ withdrawalId: withdrawalId as Id<"withdrawals" | "withdrawalsV2"> });
            toast({
                title: "Withdrawal rejected",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
        } catch (error) {
            toast({
                title: "Error rejecting withdrawal",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
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

    return (
        <Box w="100%">
            <Box
                w="100%"
                p="1.5rem"
                bg="blackAlpha.400"
                borderRadius="16px"
                border="0.1rem solid"
                borderColor="purple.400"
            >
                <Heading size="md" mb="1rem" color="white">Withdrawals Requiring Review</Heading>

                {underReviewWithdrawalsWithUsers === undefined ? (
                    <Spinner />
                ) : underReviewWithdrawalsWithUsers.length === 0 ? (
                    <Text color="white">No withdrawals require review</Text>
                ) : (
                    <Flex 
                        direction="column" 
                        w="100%" 
                        h={underReviewWithdrawalsWithUsers.length > 0 ? "auto" : "auto"} 
                        position="relative"
                    >
                        <Box overflowX="auto" w="100%" flex="1" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">ID</Th>
                                        <Th color="purple.100" fontWeight="bold">User</Th>
                                        <Th color="purple.100" fontWeight="bold" textAlign="right">Amount</Th>
                                        <Th color="purple.100" fontWeight="bold">Audit</Th>
                                        <Th color="purple.100" fontWeight="bold">Date</Th>
                                        <Th color="purple.100" fontWeight="bold">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedUnderReviewWithdrawals.map(({ withdrawal, user }) => (
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
                                                            bg="purple.400"
                                                            _hover={{ bg: "purple.500" }}
                                                            onClick={() => copyToClipboard(withdrawal._id)}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white">
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
                                            </Td>
                                            <Td color="white">
                                                <Text textAlign="right" fontWeight="bold">{formatAmount(withdrawal.amount.toString())}</Text>
                                            </Td>
                                            <Td>
                                                <IconButton
                                                    aria-label={auditedWithdrawals.has(withdrawal.userId) ? "Re-Audit" : "Audit"}
                                                    icon={<SearchIcon color="white" />}
                                                    size="xs"
                                                    variant="solid"
                                                    bg="blue.500"
                                                    _hover={{ bg: "blue.600" }}
                                                    onClick={() => handleAuditUser(withdrawal.userId)}
                                                />
                                            </Td>
                                            <Td color="gray.300">{formatDate(withdrawal._creationTime)}</Td>
                                            <Td>
                                                <HStack spacing={2}>
                                                    <Tooltip label="Approve Withdrawal">
                                                        <IconButton
                                                            aria-label="Approve"
                                                            icon={<CheckIcon />}
                                                            size="sm"
                                                            colorScheme="green"
                                                            onClick={() => handleApproveWithdrawal(withdrawal._id)}
                                                            isDisabled={!auditedWithdrawals.has(withdrawal.userId)}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip label="Reject Withdrawal">
                                                        <IconButton
                                                            aria-label="Reject"
                                                            icon={<CloseIcon />}
                                                            size="sm"
                                                            colorScheme="red"
                                                            onClick={() => handleRejectWithdrawal(withdrawal._id)}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                        
                        {/* Pagination Controls for review section */}
                        <HStack mt="auto" pt={4} pb={2} justifyContent="center" spacing={4}>
                            <IconButton
                                aria-label="Previous Page"
                                icon={<ChevronLeftIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handlePrevReviewPage}
                                isDisabled={reviewPage === 0}
                            />
                            <Text color="white">
                                Page {reviewPage + 1} of {totalReviewPages || 1}
                            </Text>
                            <IconButton
                                aria-label="Next Page"
                                icon={<ChevronRightIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handleNextReviewPage}
                                isDisabled={reviewPage >= totalReviewPages - 1}
                            />
                        </HStack>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default WithdrawalsUnderReview; 
