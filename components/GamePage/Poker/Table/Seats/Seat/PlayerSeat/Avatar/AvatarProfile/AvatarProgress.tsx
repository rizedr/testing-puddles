import { CircularProgress, useBreakpointValue } from '@chakra-ui/react';

interface AvatarProgressProps {
    isCurrentPlayer: boolean;
    isYourTurn: boolean;
    progressValue: number;
    progressColor: string;
    extraTimeProgressValue: number;
    extraTimeProgressColor: string;
    extraTimeActivated: boolean;
}

export const AvatarProgress = ({
    isCurrentPlayer,
    isYourTurn,
    progressValue,
    progressColor,
    extraTimeProgressValue,
    extraTimeProgressColor,
    extraTimeActivated,
}: AvatarProgressProps) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const size = isPortrait ? '5.7vmax' : "6.25vmin";
    const outerSize = isPortrait ? '6.35vmax' : '7.05vmin'; // Even larger for purple bar
    const thickness = isYourTurn ? '0.45rem' : '0.4rem';
    const outerThickness = isYourTurn ? '0.45rem' : '0.39rem'; // Middle thickness for outer

    return (
        <>
            {/* Show the partial white track for the purple extra time bar (outer) only if extraTimeActivated */}
            {extraTimeActivated && (
                <CircularProgress
                    value={100 * 0.58}
                    max={100}
                    size={isPortrait ? '6.15vmax' : '6.7vmin'}
                    thickness={isYourTurn ? '0.65rem' : '0.58rem'}
                    position="absolute"
                    zIndex={0}
                    top="50.1%"
                    left={isPortrait ? "46.1%" : "46.2%"}
                    borderRadius="100%"
                    style={{
                        transform: 'translate(-50%, -50%) scaleX(1) rotate(0deg)'
                    }}
                    color="rgba(250, 250, 250, 0.9)"
                    trackColor="transparent"
                    visibility={isCurrentPlayer? 'visible' : 'hidden'}
                />
            )}
            {/* Show the purple extra time bar (outer) only if extraTimeActivated */}
            {extraTimeActivated && (
                <CircularProgress
                    value={extraTimeProgressValue * 0.58}
                    max={100}
                    size={outerSize}
                    thickness={outerThickness}
                    position="absolute"
                    zIndex={1}
                    top="50%"
                    left="46.2%"
                    borderRadius="100%"
                    style={{
                        filter: 'drop-shadow(0 0 4px #9F7AEA)',
                        transform: 'translate(-50%, -50%) scaleX(1) rotate(0deg)'
                    }}
                    color={extraTimeProgressColor}
                    trackColor="transparent"
                    visibility={isCurrentPlayer ? 'visible' : 'hidden'}
                />
            )}
            {/* Main progress bar (inner) */}
            <CircularProgress
                value={progressValue}
                size={size}
                thickness={thickness}
                position="absolute"
                zIndex={2}
                top="50%"
                left="46.2%"
                borderRadius="100%"
                transform="translate(-50%, -50%)"
                color={progressColor}
                trackColor={progressValue > 0 ? "rgba(250, 250, 250, 0.9)" : "rgba(250, 250, 250, 0.75)"}
                visibility={isCurrentPlayer ? 'visible' : 'hidden'}
            />
        </>
    );
};
