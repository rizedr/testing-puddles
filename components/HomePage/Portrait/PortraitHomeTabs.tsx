'use client';

import React from 'react';
import { Box, HStack, Text, Image, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import { PokerIcon } from '../../Shared/PokerIcon';
import useViewer from '../../hooks/useViewer';
import { useState } from 'react';
import { UserPreferencesModal } from '../../Modals/UserPreferencesModal/UserPreferencesModal';
import { FaUserShield } from 'react-icons/fa';
import { Image as ChakraImage } from '@chakra-ui/react';

const TabContent = ({
    icon,
    text,
    isActive,
}: {
    icon?: React.ReactElement;
    text?: string;
    isActive: boolean;
}) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={0}
        p={0}
        color={isActive ? 'brand.primary' : 'inherit'}
        height="100%"
    >
        {icon}
        <Text mt="0.15rem" fontSize="sm">{text}</Text>
    </Box>
);

export function PortraitHomeTabs() {
    const pathname = usePathname();
    const router = useRouter();
    const { userId, isAuthenticated, user, isAdmin, isModerator } = useViewer();
    const [isPreferencesOpen, setPreferencesOpen] = useState(false);
    const [isHamburgerOpen, setHamburgerOpen] = useState(false);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    if (pathname.startsWith('/poker') || !isAuthenticated) {
        return null;
    }

    const tabData = [
        {
            icon: (
                <Image
                    src={user?.imageUrl ?? undefined}
                    width="1.2rem"
                    height="1.2rem"
                    borderRadius="50%"
                    alt="User Avatar"
                />
            ),
            text: 'Profile',
            path: `/profile/${userId}`,
        },
        {
            icon: (
                <ChakraImage
                    src="/RewardsIcon.png"
                    alt="Rewards"
                    width="1.3rem"
                    height="1.3rem"
                    borderRadius="50%"
                    objectFit="contain"
                />
            ),
            text: 'Rewards',
            path: '/rewards',
        },
        {
            icon: <PokerIcon />,
            text: 'Home',
            path: '/',
        },
    ] as const;

    return (
        <HStack
            width="100%"
            bg="brand.gray70"
            boxShadow="0 -2.5px 4px rgba(255, 255, 255, 0.5)"
            pt="0.8rem"
            pb="1.1rem"
            minHeight="4rem"
            justify="space-around"
            zIndex="100"
        >
            {tabData.map((tab, index) => (
                <Link
                    key={`${tab.text}-${index}`}
                    href={tab.path}
                    style={{ textDecoration: 'none' }}
                >
                    <TabContent
                        icon={tab.icon}
                        text={tab.text}
                        isActive={pathname === tab.path}
                    />
                </Link>
            ))}
            <Box as="button" onClick={() => setPreferencesOpen(true)} background="none" border="none" p={0} m={0} display="flex" alignItems="center">
                <TabContent
                    icon={<SettingsIcon boxSize="1.1rem" color="brand.accentWhite" />}
                    text={"Settings"}
                    isActive={false}
                />
            </Box>
            <Box as="button" onClick={() => setHamburgerOpen(true)} background="none" border="none" p={0} m={0} display="flex" alignItems="center">
                <TabContent
                    icon={<HamburgerIcon boxSize="1.3rem" color="brand.accentWhite" />}
                    text={"Menu"}
                    isActive={false}
                />
            </Box>
            {isPortrait && (
                <Drawer placement="bottom" onClose={() => setHamburgerOpen(false)} isOpen={isHamburgerOpen} size="xs">
                    <DrawerOverlay />
                    <DrawerContent
                        bg="brand.primaryGray"
                        border="1px solid"
                        borderColor="whiteAlpha.400"
                        borderRadius="0.5rem"
                        boxShadow="0px -2px 16px rgba(0,0,0,0.25)"
                        p={0}
                        height="auto"
                        minH="unset"
                        mb="5.25rem"
                        width="min(40vw, 300px)"
                        ml="auto"
                        mr="0.35rem"
                    >
                        <DrawerBody p={0} height="auto" minH="unset" display="block">
                            <Box as="button"
                                w="100%"
                                py={4}
                                px={2}
                                pl={5}
                                textAlign="left"
                                bg="transparent"
                                border="none"
                                _hover={{ bg: 'brand.gray45' }}
                                onClick={() => {
                                    setHamburgerOpen(false);
                                    router.push('/transactions');
                                }}
                                display="flex"
                                alignItems="center"
                                gap={3}
                            >
                                <ChakraImage
                                    src="/TransactionsIcon.png"
                                    alt="Transactions"
                                    boxSize="24px"
                                    minW="24px"
                                    minH="24px"
                                    objectFit="contain"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    ml="-3px"
                                />
                                <Text fontSize="md" color="white" fontWeight="normal">Transactions</Text>
                            </Box>
                            {(isAdmin || isModerator) && (
                                <Box as="button"
                                    w="100%"
                                    py={4}
                                    px={2}
                                    pl={5}
                                    textAlign="left"
                                    bg="transparent"
                                    border="none"
                                    _hover={{ bg: 'brand.gray45' }}
                                    onClick={() => {
                                        setHamburgerOpen(false);
                                        router.push('/admin');
                                    }}
                                    display="flex"
                                    alignItems="center"
                                    gap={3}
                                >
                                    <FaUserShield size={20} color="#E8E8E8" style={{ minWidth: 20 }} />
                                    <Text fontSize="md" color="white" fontWeight="normal">Admin</Text>
                                </Box>
                            )}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            )}
            <UserPreferencesModal isOpen={isPreferencesOpen} onClose={() => setPreferencesOpen(false)} />
        </HStack>
    );
}

export default PortraitHomeTabs;
