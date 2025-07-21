import { Text, useBreakpointValue, Box } from '@chakra-ui/react';
import { HandName } from '../../../../../../../../../client';
import { handNameToText } from '../../../../../../../../utils/handNameToText';
import { getPosition, PlayerPosition } from '../sharedPositioning';
import { useGetPlayerUIPosition } from '../../../../../../../../hooks/useGetPlayerUIPositions';

const landscapeStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { bottom: '-3.5vmin' },
    topRight: { bottom: '-3.5vmin' },
    upperLeft: { top: '5.5vmin' },
    upperRight: { top: '5.5vmin' },
    left: { top: '-4.5vmin' },
    right: { top: '-4.5vmin' },
    bottomLeft: { top: '-5.5vmin' },
    bottomRight: { top: '-5.5vmin' },
    bottom: { top: '5.9vmin' },
};

const portraitStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { top: '5.5vmax' },
    topRight: { top: '5.5vmax' },
    upperLeft: { top: '5.5vmax' },
    upperRight: { top: '5.5vmax' },
    left: { top: '5.5vmax' },
    right: { top: '5.5vmax' },
    bottomLeft: { top: '5vmax' },
    bottomRight: { top: '5vmax' },
    bottom: { top: '5.3vmax' },
};

interface PlayerHandBoxProps {
    player?: any;
    isYou?: boolean;
}

export const PlayerHandBox = ({ player, isYou }: PlayerHandBoxProps) => {
    const bg = 'linear-gradient(351.96deg,rgb(69, 0, 142) -20.9%, rgba(78, 35, 122, 0) 20%,rgb(136, 80, 183) 96%), #4B2B82';
    const currentPlayerPosition = useGetPlayerUIPosition(player?.player_id);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const position = getPosition(currentPlayerPosition);
    const styles = isPortrait ? portraitStyles : landscapeStyles;

    // Treat hand_name as an array
    let handNames: (HandName | string)[] = [];
    if (player?.hand_name) {
        handNames = Array.isArray(player.hand_name) ? player.hand_name : [player.hand_name];
    }
    const handDetails: (string | null | undefined)[] = player?.hand_details || [];

    // Filter out LAST_PLAYER_STANDING
    const filteredHandPairs = handNames
        .map((name: HandName | string, idx: number) => ({
            name,
            detail: handDetails[idx],
        }))
        .filter(
            (pair) => pair.name !== HandName.LAST_PLAYER_STANDING
        );

    if (filteredHandPairs.length > 0 && isYou) {
        const handTextArr = filteredHandPairs
            .map(({ name, detail }, idx) => {
                const base = handNameToText[name as keyof typeof handNameToText] || String(name);
                const text = detail ? `${base}, ${detail}` : base;
                if (filteredHandPairs.length > 1) {
                    return `[${idx + 1}] ${text}`;
                }
                return text;
            });
        const handText = handTextArr.join(' ');
        return <Box  
            fontSize={isPortrait ? '1.15vmax' : '1.25vmin'}
            fontWeight="600"
            lineHeight={isPortrait ? '1.875vmax' : '2.25vmin'}
            borderRadius={isPortrait ? '0.85vmax' : '1.15vmin'}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            zIndex={1000}
            w="fit-content"
            minW={isPortrait ? '12vmax' : '15vmin'}
            maxW={isPortrait ? '90vw' : '40vmin'}
            px={isPortrait ? 2 : 3}
            alignItems="center"
            justifyContent="center"
            bg="#191A1B"
            border="0.05rem solid rgb(255, 255, 255, 0.5)"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            {...styles[position as keyof typeof styles]}
        >
            <Text color="rgb(225, 225, 225)">{handText}</Text>
        </Box>
    }
};

export default PlayerHandBox;
