import { Box } from '@chakra-ui/react';
import { Player } from '../../../../../../client';
import EmptySeat from './EmptySeat';
import Avatar from './PlayerSeat/Avatar/Avatar';
import { PlayerHandBox } from './PlayerSeat/Avatar/AvatarAction/PlayerHandBox';
import { useAvatar } from './PlayerSeat/Avatar/useAvatar';

export const Seat = ({
    player,
    index,
}: {
    player: Player | null;
    index: number;
}) => {
    if (!player)
        return (
            <Box position="relative" h="100%">
                <EmptySeat index={index} />
            </Box>
        );
        
    return (
        <Box position="relative">
            <Avatar player={player} />
            <Box position="relative" transform="translate(-10%, 0%)">
                <PlayerHandBox player={player} />
            </Box>
        </Box>
    );
};
