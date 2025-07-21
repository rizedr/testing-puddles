import React, { useState } from 'react';
import { Box, IconButton, HStack, Text, Image } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaThumbtack } from 'react-icons/fa';

export const NewsletterCard: React.FC = () => {
    const images = [
        "/AFFILIATE0.webp",
    ];

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1; // Adjust this to show more images per page if needed
    const totalPages = Math.ceil(images.length / itemsPerPage);

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

    const paginatedImages = images.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <Box
            p={4}
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182"
            borderRadius="16px"
            border="0.3px solid rgb(40, 39, 44)"
            boxShadow="0 0 1.5rem rgba(128, 90, 213, 0.3)"
            overflow="visible"
            height="100%"
            display="flex"
            flexDirection="column"
        >
            {/* <HStack
                alignSelf="flex-start"
                spacing="0.75rem"
                justify="flex-start"
                mb={4}
                alignItems="center"
            >
                <Image
                    src="/NEWS_ICON.webp"
                    alt="News Icon"
                    boxSize="40px"
                />
                <Text
                    fontSize="1.5rem"
                    fontWeight="900"
                    // p="12px"
                    textAlign="center"
                    alignSelf="center"
                    // transform="translateX(-10px)"
                >
                    COMMUNITY EVENTS
                </Text>
            </HStack> */}
            <Box flex="1">
                {paginatedImages.map((src, index) => (
                    <Box key={index} height="100%">
                        <Image 
                            src={src} 
                            alt={`Slide ${index + 1}`} 
                            width="100%" 
                            height="100%"
                            objectFit="cover"
                            pointerEvents="auto"
                            userSelect="none"
                            draggable={false}
                        />
                    </Box>
                ))}
            </Box>

            {/* Pagination Controls */}
            <HStack mt={8} justifyContent="center" spacing={4}>
                <IconButton
                    aria-label="Previous Page"
                    icon={<ChevronLeftIcon color="white" />}
                    size="sm"
                    variant="ghost"
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 0}
                />
                <Box
                    bg="purple.600"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="md"
                >
                    {currentPage + 1}
                </Box>
                <IconButton
                    aria-label="Next Page"
                    icon={<ChevronRightIcon color="white" />}
                    size="sm"
                    variant="ghost"
                    onClick={handleNextPage}
                    isDisabled={currentPage >= totalPages - 1}
                />
            </HStack>
        </Box>
    );
}; 