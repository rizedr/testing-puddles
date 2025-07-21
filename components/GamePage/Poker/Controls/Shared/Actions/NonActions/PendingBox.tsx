import { Text, VStack } from '@chakra-ui/react';

import { Action, playerAction } from '../../../../../../../client';
import APIButton from '../../../../../../Shared/APIButton';
import useViewer from '../../../../../../hooks/useViewer';
import useGameId from '../../../../../../hooks/useGameID';

export const PendingBox = () => {
    const gameId = useGameId();
    const { userId } = useViewer();

    return (
        <VStack paddingX="2rem" my="auto" w="100%" justifyContent="center">
            <Text
                size="md"
                variant="bold"
                textAlign="center"
                whiteSpace="pre-wrap"
            >
                Your request to join is pending.
            </Text>
            {userId && (
                <APIButton
                    endpoint={playerAction}
                    params={{
                        path: {
                            game_id: gameId,
                        },
                        body: {
                            action: Action.CANCEL_JOIN,
                        },
                    }}
                    variant={'walletButton'}
                    alignSelf="center"
                >
                    Cancel Request
                </APIButton>
            )}
        </VStack>
    );
};

export default PendingBox;
