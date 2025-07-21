'use client';

import React, { useState } from 'react';
import {
    VStack,
    Input,
    InputRightElement,
    InputGroup,
    IconButton,
    Box,
    Image,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useConvex } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';

interface ProfileHeaderProps {
    onSearchResult: (found: boolean) => void;
}

export const ProfileHeader = ({ onSearchResult }: ProfileHeaderProps) => {
    const router = useRouter();
    const convex = useConvex();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(
        searchParams?.get('username') || '',
    );
    const [showNotFound, setShowNotFound] = useState(false);

    const handleSearchSubmit = async () => {
        // Don't search if input is empty
        if (!searchValue.trim()) {
            return;
        }
        
        const user = await convex.query(api.tasks.getUserByUsername, {
            username: searchValue,
        });
        
        if (user) {
            setShowNotFound(false);
            onSearchResult(true);
            router.push(`/profile/${user._id}`);
        } else {
            setShowNotFound(true);
            onSearchResult(false);
        }
    };

    const handleSearchChange = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
        <>
            <Box w="100%" mx="auto" position="relative" py="1rem">
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    height="160px"
                    backgroundImage="url('/PokerCats.jpg')"
                    backgroundPosition="cover"
                    opacity="0.4"
                    zIndex="0"
                    filter="blur(3px)"
                    sx={{
                        '@media (max-width: 600px)': {
                            backgroundSize: 'cover',
                        },
                    }}
                />
                <VStack spacing="16px" position="relative" zIndex="1">
                    <Image
                        src="/logos/Ginza Gaming_Logo System_Secondary_White.png"
                        alt="Ginza Gaming Logo"
                        boxSize="150px"
                        objectFit="contain"
                        mt="-40px"
                    />
                    <Box w="70%" maxW="550px" mx="auto" position="relative" zIndex="1" mt="-50px">
                        <InputGroup>
                            <Input
                                fontSize="14px"
                                placeholder="Search for Player Username"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleSearchChange}
                                bg="brand.gray50"
                                border="1px solid"
                                borderColor="brand.accentWhite"
                                color="rgba(255, 255, 255, 1)"
                                height="48px"
                                flexGrow={1}
                                pl="12px"
                            />
                            <InputRightElement
                                h="100%"
                                display="flex"
                                alignItems="center"
                                pr="16px"
                            >
                                <IconButton
                                    aria-label="Search"
                                    icon={
                                        <FaSearch
                                            size="16px"
                                            color="var(--chakra-colors-brand-silverGray)"
                                        />
                                    }
                                    size="20px"
                                    onClick={handleSearchSubmit}
                                    variant="ghost"
                                    _hover={{}}
                                    _active={{}}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </VStack>
            </Box>
            {showNotFound && (
                <Box 
                    w="100%" 
                    h="50%" 
                    paddingTop="130px"
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundRepeat="no-repeat"
                    sx={{
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'url(/NoUserBackground.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(12px)',
                            zIndex: 0,
                        }
                    }}
                >
                    <Image
                        src="/five_cards_blindfold.png"
                        alt="No user found"
                        objectFit="cover"
                        w="160px"
                        h="200px"
                        position="relative"
                        zIndex={1}
                        filter="drop-shadow(0 0 50px rgba(255, 255, 255, 0.25))"
                    />
                    <Box
                        fontSize="1.75rem"
                        fontWeight="900"
                        color="purple.300"
                        paddingTop="12px"
                        position="relative"
                        zIndex={1}
                    >
                        USER NOT FOUND
                    </Box>
                    <Box
                        fontSize="1.25rem"
                        fontWeight="400"
                        color="white"
                        mt="4px"
                        position="relative"
                        zIndex={1}
                    >
                        Try searching for a different username!
                    </Box>
                </Box>
            )}
        </>
    );
};
