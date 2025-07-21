import { Box, VStack, Text, Image } from '@chakra-ui/react';

export default function RestrictedPage() {
    return (
        <Box
            w="100%"
            h="100vh"
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
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
                },
            }}
        >
            <VStack
                spacing="12px"
                align="center"
                justify="center"
                h="100%"
                position="relative"
                zIndex={1}
            >
                <Image
                    src="/five_cards_blindfold.png"
                    alt="Access Restricted"
                    objectFit="cover"
                    w="160px"
                    h="200px"
                    filter="drop-shadow(0 0 50px rgba(255, 255, 255, 0.25))"
                />
                <Text fontSize="1.75rem" fontWeight="900" color="purple.300">
                    ACCESS RESTRICTED
                </Text>
                <Text
                    fontSize="1.25rem"
                    fontWeight="400"
                    color="white"
                    textAlign="center"
                    maxW="400px"
                    px="1rem"
                >
                    Ginza Gaming is not available in your region.
                </Text>
            </VStack>
        </Box>
    );
}
