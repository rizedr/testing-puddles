import { Button } from '@chakra-ui/react';
import { HStack, Text } from '@chakra-ui/react';
import { RiShareForwardFill } from 'react-icons/ri';

interface ShareGameButtonProps {
    onClick?: () => void;
    isPortrait?: boolean;
    [key: string]: any;
}

export function ShareGameButton({ onClick, isPortrait = false }: ShareGameButtonProps) {
    return (
        <Button 
            onClick={onClick} 
            variant={'walletButton'} 
            size="la" 
            fontSize="14px"
            borderRadius="10px"
            width={isPortrait ? "42px" : "90px"}
        >
            {isPortrait ? (
                <RiShareForwardFill size={'16px'} color="white" />
            ) : (
                <HStack spacing={2}>
                    <Text>Share</Text>
                    <RiShareForwardFill size={'16px'} color="white" />
                </HStack>
            )}
        </Button>
    );
}

export default ShareGameButton;
