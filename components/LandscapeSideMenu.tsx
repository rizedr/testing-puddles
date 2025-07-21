'use client';

import {
    VStack,
    Text,
    Icon,
    Spacer,
    HStack,
    useDisclosure,
    Image,
    Box,
} from '@chakra-ui/react';
import Link from 'next/link';
import {
    FaBook,
    FaUser,
    FaHome,
    FaTelegramPlane,
    FaUserShield,
    FaCog,
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useQuery } from 'convex/react';

import useViewer from './hooks/useViewer';
import { SignedIn } from '@clerk/nextjs';
import { UserPreferencesModal } from './Modals/UserPreferencesModal/UserPreferencesModal';
import { api } from '../../../packages/convex/convex/_generated/api';

function MenuItem({
    href,
    label,
    icon,
    customImage,
    isExternal,
    isOpen,
    onClick,
}: {
    href?: string;
    label: string;
    icon?: React.ElementType;
    customImage?: string;
    isExternal?: boolean;
    isOpen: boolean;
    onClick?: () => void;
}) {
    const pathname = usePathname();
    const isActive = href ? pathname === href : false;

    const MenuContent = (
        <HStack
            borderRadius="12px"
            bgGradient={
                isActive ? 'linear(to-r, pink.700, purple.600)' : 'transparent'
            }
            py={customImage ? '10px' : '12px'}
            px="12px"
            alignItems="center"
            width="100%"
            role="group"
            _hover={{
                bg: isActive ? '' : 'rgba(255, 255, 255, 0.1)',
                color: 'brand.accentWhite',
            }}
            cursor="pointer"
            onClick={onClick}
        >
            {icon && (
                <Icon
                    as={icon}
                    w="18px"
                    h="18px"
                    color={isActive ? 'brand.accentWhite' : '#C0C0C0'}
                    _groupHover={{
                        color: 'brand.accentWhite',
                    }}
                />
            )}
            {customImage && (
                <Image
                    src={customImage}
                    alt={label}
                    boxSize="24px"
                    minW="24px"
                    minH="24px"
                    objectFit="contain"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    ml="-3px"
                    filter={
                        isActive
                            ? 'brightness(1.2)'
                            : 'opacity(1) brightness(1)'
                    }
                    _groupHover={{
                        filter: 'brightness(1.2)',
                    }}
                />
            )}
            {isOpen && (
                <Text
                    fontSize="15px"
                    fontWeight="600"
                    lineHeight="16px"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    w="100%"
                    color={isActive ? 'brand.accentWhite' : '#C0C0C0'}
                    _groupHover={{
                        color: 'brand.accentWhite',
                    }}
                >
                    {label}
                </Text>
            )}
        </HStack>
    );

    if (onClick) {
        return MenuContent;
    }

    if (isExternal && href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '100%' }}
            >
                {MenuContent}
            </a>
        );
    }

    if (href) {
        return (
            <Link href={href} style={{ width: '100%' }}>
                {MenuContent}
            </Link>
        );
    }

    return MenuContent;
}

export function LandscapeSideMenu() {
    const { userId, isAdmin, isModerator } = useViewer();
    const { onToggle, isOpen } = useDisclosure();
    const {
        isOpen: isPreferencesOpen,
        onOpen: onPreferencesOpen,
        onClose: onPreferencesClose,
    } = useDisclosure();

    // Fetch total poker hands
    // const totalPokerHandsData = useQuery(api.tasks.getTotalPokerHands, {});
    // const totalPokerHands = totalPokerHandsData?.totalPokerHands;

    return (
        <>
            <VStack
                zIndex={1000}
                spacing="16px"
                p="16px"
                alignItems="flex-start"
                h="100%"
                pt="4.5rem"
                bgColor="rgba(10, 13, 6, 0.85)"
                position="relative"
                borderRight="1px solid rgba(255, 255, 255, 0.1)"
                borderBottomRightRadius="12px"
                width={isOpen ? '180px' : '75px'}
                transition={'all 0s'}
            >
                <HStack
                    onClick={onToggle}
                    cursor="pointer"
                    alignItems="center"
                    justifyContent="center"
                    width="36px"
                    py="10px"
                    height="36px"
                    position="absolute"
                    left="20px"
                    top="1rem"
                    zIndex={3000}
                    borderRadius="12px"
                    border="1.5px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    bgColor="brand.primaryGray"
                    _hover={{
                        borderColor: 'rgba(162, 121, 220, 0.75)',
                    }}
                >
                    <Image
                        src="/icons/SideMenuChevron.png"
                        alt="Toggle menu"
                        w="16px"
                        h="16px"
                        transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                        filter="opacity(0.75) brightness(0.9)"
                    />
                </HStack>
                <MenuItem href="/" label="Home" icon={FaHome} isOpen={isOpen} />
                <SignedIn>
                    <MenuItem
                        href={`/profile/${userId}`}
                        label="Profile"
                        icon={FaUser}
                        isOpen={isOpen}
                    />
                    {/* <MenuItem
                        href="/clubs"
                        label="Clubs"
                        icon={FaUserFriends}
                        isOpen={isOpen}
                    /> */}
                    <MenuItem
                        href="/rewards"
                        label="Rewards"
                        customImage="/RewardsIcon.png"
                        isOpen={isOpen}
                    />
                    <MenuItem
                        href="/transactions"
                        label="Transactions"
                        customImage="/TransactionsIcon.png"
                        isOpen={isOpen}
                    />
                    <MenuItem
                        label="Settings"
                        icon={FaCog}
                        isOpen={isOpen}
                        onClick={onPreferencesOpen}
                    />
                    {(isAdmin || isModerator) && (
                        <MenuItem
                            href="/admin"
                            label="Admin"
                            icon={FaUserShield}
                            isOpen={isOpen}
                        />
                    )}
                    {/* Total Poker Hands Box */}
                    {/* {isOpen && (
                        <Box
                            mt={4}
                            p={3}
                            borderRadius="12px"
                            bgColor="#181A2A"
                            w="100%"
                        >
                            <Text fontSize="sm" color="purple.200" fontWeight="bold">
                                Total Poker Hands
                            </Text>
                            <Text fontSize="sm" color="white" fontWeight="bold">
                                {totalPokerHands !== undefined ? totalPokerHands.toLocaleString() : '...'}
                            </Text>
                        </Box>
                    )} */}
                </SignedIn>
                <Spacer />
                <MenuItem
                    href="https://docs.ginzagaming.com/"
                    label="Docs"
                    icon={FaBook}
                    isExternal
                    isOpen={isOpen}
                />
                <MenuItem
                    href="https://t.me/CCPGaming"
                    label="Telegram"
                    icon={FaTelegramPlane}
                    isExternal
                    isOpen={isOpen}
                />
            </VStack>
            <UserPreferencesModal
                isOpen={isPreferencesOpen}
                onClose={onPreferencesClose}
            />
        </>
    );
}
