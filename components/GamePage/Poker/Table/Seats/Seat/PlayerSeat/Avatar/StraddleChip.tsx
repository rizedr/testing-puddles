import { Box, Image } from '@chakra-ui/react';
import { useGetPlayerUIPosition } from '../../../../../../../hooks/useGetPlayerUIPositions';
import { Player } from '../../../../../../../../client';
import { getPosition, PlayerPosition } from './sharedPositioning';
import { useBreakpointValue } from '@chakra-ui/react';

const landscapeStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '4vmin', bottom: '-5.5vmin' },
    topRight: { right: '-10vmin', bottom: '-5.5vmin' },
    upperLeft: { left: '4.5vmin', bottom: '-3.25vmin' },
    upperRight: { right: '-10vmin', bottom: '-3.25vmin' },
    left: { left: '2.75vmin', top: '-5.1vmin' },
    right: { right: '-10.5vmin', top: '-4.5vmin' },
    bottomLeft: { left: '6.85vmin', top: '-6.75vmin' },
    bottom: { left: '0.5vmin', top: '-6.75vmin' },
    bottomRight: { right: '6.75vmin', top: '-6.75vmin' },
};

const portraitStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '5vmax', top: '5.75vmax' },
    topRight: { right: '-8vmax', top: '5.75vmax' },
    upperLeft: { left: '5.5vmax', top: '5.5vmax' },
    upperRight: { right: '-7.25vmax', top: '5.5vmax' },
    left: { left: '4.75vmax', top: '5.5vmax' },
    right: { right: '-7.75vmax', top: '5.5vmax' },
    bottomLeft: { left: '5.75vmax', top: '5.5vmax' },
    bottomRight: { right: '-7.25vmax', top: '5.5vmax' },
    bottom: { left: '0.75vmax', top: '-6.25vmax' },
};

interface StraddleChipProps {
    player: Player;
    isStraddle: boolean;
}

export const StraddleChip = ({ player, isStraddle }: StraddleChipProps) => {
    const currentPlayerPosition = useGetPlayerUIPosition(player?.player_id);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const position = getPosition(currentPlayerPosition);
    const styles = isPortrait ? portraitStyles : landscapeStyles;

    if (isStraddle) {
        return (
            <Box
                position="absolute"
                zIndex={1000}
                w="100%"
                alignItems="center"
                justifyContent="center"
                {...styles[position as keyof typeof styles]}
            >
                <Image
                    src="/icons/StraddleChipIcon.png"
                    alt="Straddle Chip"
                    height={isPortrait ? "1.65vmax" : "2vmin"}
                    width={isPortrait ? "2.1vmax" : "2.7vmin"}
                />
            </Box>
        );
    }
};

export default StraddleChip;
