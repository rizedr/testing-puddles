import { VStack, HStack, Text, Image, Button, Flex, useQuery, useToast } from '@chakra-ui/react';
import { Doc } from '../../../../../packages/convex/convex/_generated/dataModel';

export const ProfileInfo = ({ 
    userData, 

}: { 
    userData: Doc<'users'>, 
    currentUser?: Doc<'users'> 
}) => {
    const isProfileAffiliate = userData.affiliate && Object.keys(userData.affiliate).length > 0;
    
    return (
        <HStack
            alignItems="flex-start"
            spacing="1rem"
            border="1px solid"
            borderColor="purple.400"
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%),rgb(23, 30, 65)"
            borderRadius="xl"
            p="16px"
            position="relative"
        >
            {isProfileAffiliate && (
                <Button
                    variant="walletButton"
                    position="absolute"
                    top="16px"
                    right="16px"
                    size="sm"
                    color="white"
                    bg={isProfileAffiliate ? 'linear-gradient(351.96deg, #B37FEB -20.9%, rgba(210, 174, 245, 0) 20%, #EFDBFF 96%), #4B2B82' : "gray.600"}
                    _hover={{}}
                    cursor="default"
                    pointerEvents="none"
                >
                    Affiliate
                </Button>
            )}
            <Image
                src={userData.imageUrl}
                alt="User Avatar"
                width="7.5rem"
                height="7.5rem"
                borderRadius="50%"
                border="2px solid rgba(255, 255, 255, 0.25)"
            />
            <VStack align="start" w="full" justify="space-between" h="7.5rem">
                <VStack align="start" spacing="0.25rem" pl="0.5rem">
                    <Text size="lg" fontWeight="700" color="white">
                        {userData.username}
                    </Text>
                    <Text size="md" color="white" opacity="0.5">
                        {`Joined ${new Date(userData._creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                    </Text>
                    {userData.twitterUsername && (
                        <HStack align="center" spacing="0.5rem">
                            <Image
                                src="/TwitterLogo.png" // Ensure you have the correct path to the X logo
                                alt="X Logo"
                                width="0.9rem"
                                height="0.9rem"
                            />
                            <Text 
                                size="md" 
                                fontWeight="600" 
                                color="blue.400" 
                                as="a" 
                                href={`https://x.com/${userData.twitterUsername}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                                @{userData.twitterUsername}
                            </Text>
                        </HStack>
                    )}
                </VStack>
            </VStack>
        </HStack>
    );
};
