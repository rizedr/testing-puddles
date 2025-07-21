import { Button } from '@chakra-ui/react';
import { HStack, Text } from '@chakra-ui/react';
import { FaFileAlt } from 'react-icons/fa';

interface LogGameButtonProps {
    onClick?: () => void;
    isDisabled?: boolean;
    isPortrait?: boolean;
    nonce?: number;
    [key: string]: any;
}

export function LogGameButton({ onClick, isDisabled = false, isPortrait = false, nonce }: LogGameButtonProps) {
    const disabled = (typeof nonce === 'number' && nonce < 2) || isDisabled;
    return (
        <Button 
            onClick={onClick} 
            variant={'walletButton'} 
            size="md" 
            fontSize="14px"
            isDisabled={disabled}
            bg={disabled ? "gray.600" : undefined}
            _hover={disabled ? {} : undefined}
            _active={disabled ? {} : undefined}
            width={isPortrait ? "42px" : "90px"}
            borderRadius="10px"
        >
            {isPortrait ? (
                <FaFileAlt size={'16px'} color="white" />
            ) : (
                <HStack spacing={2}>
                    <Text>Log</Text>
                    <FaFileAlt size={'16px'} color="white" />
                </HStack>
            )}
        </Button>
    );
}

export default LogGameButton; 
