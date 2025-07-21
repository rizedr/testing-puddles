import { Box } from '@chakra-ui/react';
import { GameProgressStatus } from '../../../hooks/useGameHistory';

export const GameStatusIcon = ({ status }: { status: GameProgressStatus }) => {
    let color;
    let text;

    switch (status) {
        case GameProgressStatus.ACTIVE:
            color = '#F8C171';
            text = 'IN PROGRESS';
            break;
        case GameProgressStatus.WITHDRAWN:
            color = 'green.400';
            text = 'COMPLETED';
            break;
        default:
            return null;
    }

    return (
        <Box
            as="span"
            color={color}
            borderColor={color}
            border="1px solid"
            borderRadius="0.5rem"
            px="4px"
            py="3.25px"
            fontSize="12px"
            fontWeight="semibold"
            display="flex"
            alignItems="center"
        >
            {text}
        </Box>
    );
};

export default GameStatusIcon;
