import React from 'react';
import { HStack, Input, Box, Menu, MenuButton, MenuList, MenuItem, Icon, useBreakpointValue, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FaSearch } from 'react-icons/fa';

interface GameHistoryControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
}

const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'ACTIVE', label: 'Ongoing' },
    { value: 'WITHDRAWN', label: 'Completed' },
];

const sortOptions = [
    { value: 'Latest', label: 'Latest' },
    { value: 'Oldest', label: 'Oldest' },
];

export const GameHistoryControls: React.FC<GameHistoryControlsProps> = ({
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    statusFilter,
    setStatusFilter,
}) => {
    // Responsive: portrait (base): search input on top, dropdowns side by side below; landscape (md+): all in one row
    const isLandscape = useBreakpointValue({ base: false, md: true });
    const direction = isLandscape ? 'row' : 'column';
    const inputWidth = isLandscape ? '50%' : '100%';
    const dropdownWidth = isLandscape ? '50%' : '100%';
    return (
        <HStack
            w="100%"
            pb="10px"
            spacing={direction === 'column' ? 0 : 5}
            justifyContent="space-between"
            flexDirection={direction}
            alignItems={direction === 'column' ? 'stretch' : 'center'}
        >
            <InputGroup w={inputWidth} h="48px">
                <Input
                    fontSize="14px"
                    placeholder="Search for Game ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="brand.gray50"
                    border="1px solid"
                    borderColor="white"
                    borderWidth="1px"
                    color="rgba(255, 255, 255, 0.90)"
                    height="48px"
                    borderRadius="0.5rem"
                    fontWeight="700"
                    fontFamily="Nunito Sans, sans-serif"
                    pr="44px"
                />
                <InputRightElement h="48px" pr="16px" pointerEvents="none">
                    <FaSearch size={18} color="rgba(255,255,255,0.5)" />
                </InputRightElement>
            </InputGroup>
            <HStack spacing={isLandscape ? 2 : 3} w={dropdownWidth} flexDirection="row" alignItems="center" mt={direction === 'column' ? 3 : 0}>
                <Box w={isLandscape ? '50%' : '100%'}>
                    <Menu matchWidth>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    as={Box}
                                    w="100%"
                                    height="48px"
                                    px="16px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    bg="brand.gray50"
                                    borderRadius="0.5rem"
                                    border="1px solid"
                                    borderColor="whiteAlpha.600"
                                    borderWidth="1px"
                                    color="white"
                                    fontWeight="700"
                                    fontFamily="Nunito Sans, sans-serif"
                                    fontSize="14px"
                                    cursor="pointer"
                                >
                                    {statusOptions.find(opt => opt.value === (statusFilter === 'All Games' ? 'All' : statusFilter))?.label || 'All'}
                                    <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} ml={2} color="whiteAlpha.700" boxSize={5} />
                                </MenuButton>
                                <MenuList
                                    bg="brand.gray50"
                                    borderRadius="0.5rem"
                                    border="1px solid"
                                    borderColor="whiteAlpha.600"
                                    borderWidth="1px"
                                    py={2}
                                    px={0}
                                    minW="100%"
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            onClick={() => setStatusFilter(option.value)}
                                            bg="transparent"
                                            color="white"
                                            fontWeight="700"
                                            fontFamily="Nunito Sans, sans-serif"
                                            fontSize="14px"
                                            _hover={{ bg: 'brand.gray45' }}
                                            py={3}
                                            pl={3}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Box>
                <Box w={isLandscape ? '50%' : '100%'}>
                    <Menu matchWidth>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    as={Box}
                                    w="100%"
                                    height="48px"
                                    px="16px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    bg="brand.gray50"
                                    borderRadius="0.5rem"
                                    border="1px solid"
                                    borderColor="whiteAlpha.600"
                                    borderWidth="1px"
                                    color="white"
                                    fontWeight="700"
                                    fontFamily="Nunito Sans, sans-serif"
                                    fontSize="14px"
                                    cursor="pointer"
                                >
                                    {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort'}
                                    <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} ml={2} color="whiteAlpha.700" boxSize={5} />
                                </MenuButton>
                                <MenuList
                                    bg="brand.gray50"
                                    borderRadius="0.5rem"
                                    border="1px solid"
                                    borderColor="whiteAlpha.600"
                                    borderWidth="1px"
                                    py={2}
                                    px={0}
                                    minW="100%"
                                >
                                    {sortOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            onClick={() => setSortOption(option.value)}
                                            bg="transparent"
                                            color="white"
                                            fontWeight="700"
                                            fontFamily="Nunito Sans, sans-serif"
                                            fontSize="14px"
                                            _hover={{ bg: 'brand.gray45' }}
                                            py={3}
                                            pl={3}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Box>
            </HStack>
        </HStack>
    );
};

export default GameHistoryControls;
