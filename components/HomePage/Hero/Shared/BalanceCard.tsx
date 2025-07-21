'use client';

import {
    VStack,
    Text,
    Image,
    HStack,
    Spacer,
    useDisclosure,
    useToast,
    Input,
    Button,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useBreakpointValue,
    Box,
} from '@chakra-ui/react';
import { GinzaSignInButton } from '../../../Shared/AuthButtons';
import { useCurrentUserBalance } from '../../../hooks/useCurrentBalance';
import useViewer from '../../../hooks/useViewer';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { GinzaSurface } from '../../../Modals/GinzaModal';
import { usdcIcon } from '../../../../tools/config';
import { FaCopy, FaWallet } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { useMutation, useAction, useQuery } from 'convex/react';
import { api } from '../../../../../../packages/convex/convex/_generated/api';
import { toMicroDollars } from '../../../utils/formatMoney';
import { GameMenu } from '../../../Header/GameMenu';
import { usePathname } from 'next/navigation';
import {
    Chain,
    CHAIN_INFO,
    getSupportedChains,
    SUPPORTED_WITHDRAWAL_TOKENS,
} from '../../../../../../packages/convex/convex/constants';
import { ChevronDownIcon, ExternalLinkIcon, CheckIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useAuthModal } from '../../../Shared/AuthModalContext';
import Link from 'next/link';
import { Blockchains } from '../../../../../../packages/convex/convex/vaultody.types';
import useDepositToast from '../../../hooks/useDepositToast';

const ChainAndCurrencySection = ({
    supportedChains,
    selectedChain,
    setSelectedChain,
}: {
    supportedChains: Chain[];
    selectedChain: Chain;
    setSelectedChain: (chain: Chain) => void;
}) => {
    return (

        <HStack spacing="24px" align="stretch">
            {/* Chain Selection Section */}
            <VStack align="stretch" flex="1">
                <Text
                    color="brand.white80"
                    fontWeight="700"
                    fontSize="md"
                    alignSelf="start"
                >
                    Network
                </Text>
                <Menu>
                    <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        bg="whiteAlpha.100"
                        border="1.5px solid"
                        borderColor="purple.400"
                        color="white"
                        borderRadius="xl"
                        h="48px"
                        w="100%"
                        _hover={{ bg: 'whiteAlpha.200' }}
                        _active={{ bg: 'whiteAlpha.200' }}
                    >
                        <HStack>
                            <Image
                                src={CHAIN_INFO[selectedChain.id].icon}
                                w="24px"
                                h="24px"
                                alt={CHAIN_INFO[selectedChain.id].name}
                            />
                            <Text>{CHAIN_INFO[selectedChain.id].name}</Text>
                        </HStack>
                    </MenuButton>
                    <MenuList bg="#1A202C" borderColor="whiteAlpha.200">
                        {supportedChains.map((chain) => (
                            <MenuItem
                                key={chain.id}
                                onClick={() => setSelectedChain(chain)}
                                bg="#1A202C"
                                _hover={{ bg: 'whiteAlpha.200' }}
                            >
                                <HStack>
                                    <Image
                                        src={CHAIN_INFO[chain.id].icon}
                                        w="24px"
                                        h="24px"
                                        alt={CHAIN_INFO[chain.id].name}
                                    />
                                    <Text color="white">
                                        {CHAIN_INFO[chain.id].name}
                                    </Text>
                                </HStack>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </VStack>

            {/* Currency Section */}
            <VStack align="stretch" flex="1">
                <Text
                    color="brand.white80"
                    fontWeight="700"
                    fontSize="md"
                    alignSelf="start"
                >
                    Currency
                </Text>
                <HStack
                    p="2"
                    bg="whiteAlpha.100"
                    borderRadius="xl"
                    justify="space-between"
                    h="48px"
                    border="1.5px solid"
                    borderColor="purple.400"
                >
                    <HStack>
                        <Image src={usdcIcon} w="24px" h="24px" alt="USDC" />
                        <Text color="white" fontWeight="700">USDC</Text>
                    </HStack>
                </HStack>
            </VStack>
        </HStack>
    );
};

const DepositAddressSection = ({
    predeployAddress,
}: {
    predeployAddress: string;
}) => {
    const toast = useToast();
    const copyAddress = () => {
        navigator.clipboard.writeText(predeployAddress);
        toast({
            title: 'Address copied to clipboard',
            status: 'success',
        });
    };
    return (
        <VStack align="stretch">
            <Text
                color="brand.white80"
                fontWeight="700"
                fontSize="md"
                alignSelf="start"
            >
                Deposit Address
            </Text>
            <HStack
                p="4"
                bg="whiteAlpha.200"
                borderRadius="xl"
                justify="space-between"
            >
                <Text color="white" fontSize="sm" userSelect="text">
                    {predeployAddress}
                </Text>
                <Box
                    as={FaCopy}
                    onClick={copyAddress}
                    color="white"
                    fontSize="20px"
                    cursor="pointer"
                    _hover={{ color: 'purple.300' }}
                />
            </HStack>
        </VStack>
    );
};

const DepositWarningSection = ({
    selectedChain,
}: {
    selectedChain: Chain;
}) => {
    return (
        <VStack align="center" w="100%" spacing={2}>
            <Box
                w="100%"
                bg="#F3EFFF"
                borderRadius="16px"
                px={5}
                py={3}
                display="flex"
                alignItems="center"
            >
                <InfoOutlineIcon color="purple.400" mr={2} style={{ transform: 'rotate(180deg)' }} />
                <Box w="100%">
                    <Text color="gray.700" fontWeight="600" fontSize="sm">
                        Only send USDC through the {CHAIN_INFO[selectedChain.id].name} network.
                    </Text>

                    <Text color="gray.700" fontWeight="800" fontSize="sm">
                        The minimum deposit is $5!
                    </Text>
                </Box>
            </Box>
        </VStack>
    );
};

const DepositContent = () => {
    const getUserAddresses = useAction(api.vaultody.getUserAddresses);
    const isSolanaEnabled = useQuery(api.deposits.getIsSolanaEnabledForUser);
    const SUPPORTED_CHAINS = getSupportedChains(process.env.NEXT_PUBLIC_IS_TESTNET === 'true', isSolanaEnabled);
    
    const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
    const [addresses, setAddresses] = useState<{
        [chainId: string]: string;
    }>({});
    const hasFetchedAddresses = useRef(false);

    useEffect(() => {
        if (!hasFetchedAddresses.current) {
            hasFetchedAddresses.current = true;
            getUserAddresses().then((addresses) => {
                setAddresses(addresses);
            });
        }
    }, [getUserAddresses]);

    return (
        <VStack spacing="16px" align="stretch" w="100%" px="1rem" py="1rem">
            <HStack alignSelf="end" spacing="4px">
                <Text color="whiteAlpha.800" fontSize="sm" alignSelf="start"
                    _hover={{ textDecoration: 'underline' }}
                >
                    <Link href="/transactions">View Past Transactions</Link>
                </Text>
                <ExternalLinkIcon color="whiteAlpha.800" h="12px" />
            </HStack>
            <DepositWarningSection selectedChain={selectedChain} />
            <ChainAndCurrencySection
                supportedChains={SUPPORTED_CHAINS}
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
            />
            <DepositAddressSection
                predeployAddress={
                        addresses[selectedChain.id] ||
                        'N/A, please contact support'
                }
            />
            <Text
                color="whiteAlpha.600"
                fontSize="sm"
                textAlign="center"
                w="100%"
                whiteSpace="pre-line"
                wordBreak="break-word"
            >
                You can close this tab while waiting for your deposit to be processed.
            </Text>
        </VStack>
    );
};

const WithdrawContent = () => {
    const [address, setAddress] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const isSolanaEnabled = useQuery(api.deposits.getIsSolanaEnabledForUser);
    const SUPPORTED_CHAINS = getSupportedChains(process.env.NEXT_PUBLIC_IS_TESTNET === 'true', isSolanaEnabled);
    const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const requestWithdrawal = useMutation(api.withdrawals.requestWithdrawal);
    const { formattedBalance } = useCurrentUserBalance();

    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    
    const isValidAddress = (address: string) => {
        if (selectedChain.blockchain === Blockchains.solana) {
            return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
        }

        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9.]/g, '');
        // If value starts with a decimal, prepend a 0
        if (value.startsWith('.')) value = `0${value}`;
        // Prevent multiple decimal points
        const parts = value.split('.');
        if (parts.length > 2) return;
        // Limit decimal places to 2
        if (parts[1]?.length > 2) return;
        setWithdrawAmount(value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress = e.target.value;
        setAddress(newAddress);
        // No toast messages here
    };

    const handleWithdraw = async () => {
        if (isInvalidWithdraw) {
            return;
        }
        setIsSubmitting(true);
        
        try {
            const withdrawalAmountNumber = Number(withdrawAmount);
            // The server will now handle the audit
            const result = await requestWithdrawal({
                withdrawAddress: address,
                withdrawAmount: toMicroDollars(withdrawalAmountNumber),
                tokenContractAddress:
                    SUPPORTED_WITHDRAWAL_TOKENS[selectedChain.id][0],
                chainId: selectedChain.id,
            });
            
            if (result.requiresReview) {
                toast({
                    title: 'Withdrawal under review',
                    description: 'Your withdrawal request has been submitted for review',
                    status: 'warning',
                });
            } else {
                toast({
                    title: 'Withdrawal requested',
                    description: 'Your withdrawal request has been submitted',
                    status: 'success',
                });
            }
            
            setAddress('');
            setWithdrawAmount('');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to request withdrawal',
                status: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const minWithdraw = Math.min(0.01, Number(formattedBalance));
    const maxWithdraw = Number(formattedBalance);

    const isInvalidWithdraw =
        Number(withdrawAmount) < Number(minWithdraw) ||
        Number(withdrawAmount) > Number(maxWithdraw) ||
        Number(withdrawAmount) > Number(formattedBalance);

    return (
        <VStack spacing="16px" align="stretch" w={isPortrait ? "100%" : "450px"} alignSelf="center" px="1rem" py="1rem">
            <VStack spacing="16px" align="stretch" w="100%">
                <ChainAndCurrencySection
                    supportedChains={SUPPORTED_CHAINS}
                    selectedChain={selectedChain}
                    setSelectedChain={setSelectedChain}
                />
                <VStack align="stretch">
                    <HStack align="center" justify="space-between">
                        <Text
                            color="brand.white80"
                            fontWeight="700"
                            fontSize="md"
                            alignSelf="start"
                        >
                            Amount
                        </Text>
                        <Text color="whiteAlpha.800" fontSize="sm">
                            Available Balance: ${formattedBalance}
                        </Text>
                    </HStack>
                    <InputGroup
                        borderRadius="xl"
                        py="3"
                        bg="whiteAlpha.200"
                        border="1.5px solid"
                        borderColor={withdrawAmount && isInvalidWithdraw ? 'red' : 'whiteAlpha.400'}
                    >
                        <InputLeftElement h="100%">
                            <Image
                                src="/GinzaCoin.png"
                                w="24px"
                                h="24px"
                                alt="Gold coin"
                            />
                        </InputLeftElement>
                        <Input
                            borderColor={withdrawAmount && isInvalidWithdraw ? 'red' : 'white'}
                            value={withdrawAmount}
                            onChange={handleInputChange}
                            border="none"
                            bg="none"
                            focusBorderColor="transparent"
                            placeholder="Enter amount"
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            color="white"
                            h="100%"
                        />
                    </InputGroup>
                </VStack>
                <VStack align="stretch">
                    <HStack align="center" justify="space-between">
                        <Text
                            color="brand.white80"
                            fontWeight="700"
                            fontSize="md"
                            alignSelf="start"
                        >
                            Destination Address
                        </Text>
                        <HStack>
                            <Text
                                color={
                                    isValidAddress(address)
                                        ? 'green.400'
                                        : 'gray.500'
                                }
                                fontSize="sm"
                            >
                                {isValidAddress(address)
                                    ? 'Valid Address'
                                    : 'Invalid Address'}
                            </Text>
                            {isValidAddress(address) && (
                                <CheckIcon color="green.400" />
                            )}
                        </HStack>
                    </HStack>
                    <Input
                        placeholder="Enter destination address"
                        value={address}
                        onChange={handleAddressChange}
                        color="white"
                        border="1.5px solid"
                        borderColor="whiteAlpha.400"
                        borderRadius="xl"
                        p="2"
                        pl="4"
                        h="48px"
                        bg="whiteAlpha.200"
                    />
                </VStack>
            </VStack>
            
            <Button
                onClick={handleWithdraw}
                isDisabled={
                    !address || 
                    isInvalidWithdraw || 
                    !isValidAddress(address) || 
                    isSubmitting
                }
                isLoading={isSubmitting}
                loadingText="Processing"
                variant="walletButton"
            >
                Confirm Withdrawal
            </Button>
        </VStack>
    );
};

const DepositModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(
        'deposit',
    );

    return (
        <GinzaSurface
            title="Deposit / Withdraw"
            content={
                <VStack align="stretch" w="100%">
                    <HStack spacing={3} w="100%" justify="center" mb={2} mt={2}>
                        <Button
                            bg={activeTab === 'deposit'
                                ? '#6841A8'
                                : 'rgba(162, 121, 220, 0.18)'}
                            color={activeTab === 'deposit' ? 'white' : 'brand.white80'}
                            borderRadius="12px"
                            fontWeight={700}
                            fontSize="1rem"
                            h="40px"
                            w="100%"
                            maxW="120px"
                            boxShadow="none"
                            border="none"
                            onClick={() => setActiveTab('deposit')}
                            _hover={{ bg: activeTab === 'deposit' ? '#6841A8' : 'rgba(162, 121, 220, 0.22)' }}
                            _active={{ bg: activeTab === 'deposit' ? '#6841A8' : 'rgba(162, 121, 220, 0.22)' }}
                        >
                            Deposit
                        </Button>
                        <Button
                            bg={activeTab === 'withdraw'
                                ? '#6841A8'
                                : 'rgba(162, 121, 220, 0.18)'}
                            color={activeTab === 'withdraw' ? 'white' : 'brand.white80'}
                            borderRadius="12px"
                            fontWeight={700}
                            fontSize="1rem"
                            h="40px"
                            w="100%"
                            maxW="120px"
                            boxShadow="none"
                            border="none"
                            onClick={() => setActiveTab('withdraw')}
                            _hover={{ bg: activeTab === 'withdraw' ? '#6841A8' : 'rgba(162, 121, 220, 0.22)' }}
                            _active={{ bg: activeTab === 'withdraw' ? '#6841A8' : 'rgba(162, 121, 220, 0.22)' }}
                        >
                            Withdraw
                        </Button>
                    </HStack>
                    {activeTab === 'deposit' ? (
                        <DepositContent />
                    ) : (
                        <WithdrawContent />
                    )}
                </VStack>
            }
            isOpen={isOpen}
            onClose={onClose}
        />
    );
};

export const BalanceCard: React.FC = () => {
    const { formattedBalance } = useCurrentUserBalance();
    const { open } = useAuthModal();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const isPortrait = useBreakpointValue({
        base: true,
        md: true,
        lg: false,
        xl: false,
    });
    const pathname = usePathname();
    const isInPokerGame = pathname.startsWith('/poker');
    useDepositToast();

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('openSignIn') === 'true') {
            setTimeout(() => {
                open();
                localStorage.removeItem('openSignIn');
            }, 250);
        }
    }, [open]);

    return (
        <HStack
            w="100%"
            zIndex="1000"
            background="rgba(6, 8, 1, 0.99)"
            p="0.5rem"
            justify="space-between"
            h="auto"
            minH="70px"
            borderBottom="0.5px solid rgba(255, 255, 255, 0.15)"
        >
            <HStack spacing="0.15rem">
                {isInPokerGame && isPortrait && (
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            marginLeft: '12px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <GameMenu />
                    </div>
                )}
                {(!isInPokerGame || !isPortrait) && (
                    <Link href="/">
                        <Image
                            src="/GinzaLogoWhite2.png"
                            w={isPortrait ? '10.5rem' : '9.6825rem'}
                            h={isPortrait ? '3.75rem' : '3.625rem'}
                            alt="Ginza Logo"
                            alignSelf="start"
                        />
                    </Link>
                )}
            </HStack>
            <SignedIn>
                <HStack w="100%">
                    <Spacer />
                    <HStack spacing="4">
                        <VStack
                            align="flex-start"
                            borderColor="rgba(162, 121, 220, 1.0)"
                            borderWidth="1.75px"
                            spacing="4px"
                            bg="linear-gradient(30deg, #20114A, #070310)"
                            py="0.28rem"
                            px="0.75rem"
                            borderRadius="xl"
                            // boxShadow="0px 0px 8px 0px rgba(101, 63, 159, 0.85)"
                        >
                            <HStack h="1.65rem" alignItems="center">
                                <Image
                                    src="/GinzaCoin.png"
                                    w="2.9rem"
                                    h="2.9rem"
                                    alt="Gold coin"
                                    ml="-28px"
                                    mb="1px"
                                />
                                <Text
                                    color="rgba(255, 255, 255, 0.9)"
                                    fontSize="1rem"
                                    fontWeight="bold"
                                >
                                    {formattedBalance}
                                </Text>
                            </HStack>
                        </VStack>

                        <Button
                            variant="walletButton"
                            borderRadius="12px"
                            onClick={onOpen}
                            cursor="pointer"
                            _active={{
                                transform: 'translateY(2px)',
                            }}
                            filter="saturation(250%)"
                        >
                            <HStack spacing="0.6rem">
                                <FaWallet width="5rem" height="5rem" />
                                <Text
                                    fontSize="0.85rem"
                                    fontWeight="800"
                                    color="rgba(255, 255, 255, 1.0)"
                                >
                                    DEPOSIT
                                </Text>
                            </HStack>
                        </Button>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: {
                                        width: '40px',
                                        height: '40px',
                                        border: '1.5px solid rgba(255, 255, 255, 0.25)',
                                    },
                                },
                            }}
                        />
                    </HStack>
                </HStack>
            </SignedIn>
            <SignedOut>
                <Spacer />
                <GinzaSignInButton />
            </SignedOut>
            <DepositModal isOpen={isOpen} onClose={onClose} />
        </HStack>
    );
};
