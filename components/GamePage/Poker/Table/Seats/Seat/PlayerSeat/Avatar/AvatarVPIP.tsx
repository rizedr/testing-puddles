import { Text, Box, useBreakpointValue } from '@chakra-ui/react';
import { Player } from '../../../../../../../../client';
import useGameData from '../../../../../../../hooks/useGameData';

export const PlayerVPIP = ({ player }: { player: Player }) => {
    const {vpipArchive} = useGameData();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const vpip = vpipArchive[player.player_id] && vpipArchive[player.player_id].hands_played > 0
        ? Math.round((vpipArchive[player.player_id].vpip_count / vpipArchive[player.player_id].hands_played) * 100)
        : 0;

    return (
        <Box
            bg="brand.darkBlueGray"
            borderRadius="6.25rem"
            border={isPortrait ? "0.1vmax solid" : "0.1rem solid"}
            borderColor={isPortrait ? "brand.white70" : "brand.white70"}
            bottom={isPortrait ? "-0.25vmax" : "-0.25rem"}
            left={isPortrait ? "-0.45vmax" : "-0.25rem"}
            position="absolute"
            zIndex={400}
        >
            <Text
                fontSize={isPortrait ? "1.25vmax" : "1.3vmin"}
                py={isPortrait ? "0.0625vmax" : "min(0.0625vmin, 0.0625vmax)"}
                px={isPortrait ? "0.5125vmax" : "min(0.5125vmin, 0.5125vmax)"}
                variant="bold"
            >
                {vpip}
            </Text>
        </Box>
    );
};

export default PlayerVPIP;
