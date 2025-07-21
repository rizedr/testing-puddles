import { Text, useBreakpointValue, VStack, Box } from '@chakra-ui/react';
import { Action } from '../../../../../../../../../client';
import { truncated } from '../../../../../../../../utils/getPlayerInfo';
import { usePlayerUsername } from '../../../../../../../../hooks/usePlayerUsername';
import { useMoneyDisplay } from '../../../../../../../../Shared/MoneyDisplay';
import { useEffect, useState, useRef } from 'react';

// Temporary interface to fix type error
interface Player {
    player_id: string;
    amount: bigint;
    action?: Action;
    hand_win_odds?: number;
    hand?: any[];
    bet_amount: bigint;
}

interface AvatarInfoProps {
    player: Player;
    isAway?: boolean;
    isShowdown?: boolean;
    isWinner?: boolean;
    amountWon?: bigint;
}

export const AvatarInfo = ({ player, isAway, isShowdown, isWinner, amountWon }: AvatarInfoProps) => {
    const username = usePlayerUsername(player.player_id);
    const isFolded = player.action === Action.FOLD;
    const textColor = isFolded ? 'brand.gray10' : 'brand.white80';
    const textColorAmount = isFolded
        ? 'rgba(157, 216, 244, 0.6)'
        : 'rgba(157, 216, 244, 1)';
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const moneyDisplay = useMoneyDisplay(player.amount, isFolded, true, player.bet_amount);
    const amountWonDisplay = useMoneyDisplay(amountWon ?? 0n, isFolded, true, player.bet_amount);
    
    const [displayName, setDisplayName] = useState<string>(truncated(username));
    const [isShowingWinOdds, setIsShowingWinOdds] = useState<boolean>(false);
    const [winOdds, setWinOdds] = useState<number>(0);
    const [showWinningAmount, setShowWinningAmount] = useState<boolean>(false);
    const [winningAmountOpacity, setWinningAmountOpacity] = useState<number>(1);
    const [storedWinningAmountDisplay, setStoredWinningAmountDisplay] = useState<string>('');
    const prevOddsRef = useRef<number | undefined>(undefined);
    const prevShowingOddsRef = useRef<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const winningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Handle winning amount display
    useEffect(() => {
        if (isWinner && amountWon && amountWon > 0n) {
            // Clear any existing timeouts
            if (winningTimeoutRef.current) clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            
            // Store the winning amount display value
            setStoredWinningAmountDisplay(amountWonDisplay);
            
            // Show winning amount immediately
            setShowWinningAmount(true);
            setWinningAmountOpacity(1);
        } else if (showWinningAmount) {
            // Start fade animation when no longer winner
            if (winningTimeoutRef.current) clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            
            setWinningAmountOpacity(0);
            
            // After 0.5 seconds fade, hide the winning amount
            fadeTimeoutRef.current = setTimeout(() => {
                setShowWinningAmount(false);
                setStoredWinningAmountDisplay('');
            }, 500);
        } else {
            // Clear timeouts and hide winning amount
            if (winningTimeoutRef.current) clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            setShowWinningAmount(false);
            setWinningAmountOpacity(1);
            setStoredWinningAmountDisplay('');
        }
        
        return () => {
            if (winningTimeoutRef.current) clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        };
    }, [isWinner, amountWon, showWinningAmount, amountWonDisplay]);
    
    useEffect(() => {
        if (isShowdown) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setDisplayName(truncated(username));
            setIsShowingWinOdds(false);
            setWinOdds(0);
        } else {
            const currentlyShowingOdds = player.hand_win_odds !== undefined && player.hand_win_odds >= 0;
            const oddsChanged = currentlyShowingOdds && prevShowingOddsRef.current && prevOddsRef.current !== undefined && player.hand_win_odds !== prevOddsRef.current;

            if (oddsChanged) {
                // Delay update by 0.4s
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setDisplayName(`${player.hand_win_odds}%`);
                    setIsShowingWinOdds(true);
                    setWinOdds(player.hand_win_odds!);
                }, 420);
            } else if (currentlyShowingOdds) {
                // Immediate update if switching to odds or first time
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setDisplayName(`${player.hand_win_odds}%`);
                setIsShowingWinOdds(true);
                setWinOdds(player.hand_win_odds!);
            } else {
                // Not showing odds
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setDisplayName(truncated(username));
                setIsShowingWinOdds(false);
                setWinOdds(0);
            }
            prevOddsRef.current = player.hand_win_odds;
            prevShowingOddsRef.current = currentlyShowingOdds;
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [player.hand_win_odds, username, isShowdown]);
    
    const getTextColor = () => {
        if (!isShowingWinOdds) return textColor;
        
        if (winOdds < 15) return '#FF6666'; // Lighter red for 0-15%
        if (winOdds < 30) return '#FFBBBB'; // Even lighter red for 15-30%
        if (winOdds < 50) return '#FFFFE0'; // Yellow for 30-50%
        if (winOdds < 75) return '#ABEBC6'; // Light green for 50-75%
        return '#2ECC71';                   // Green for 75-100%
    };
    
    // Determine what to display in the amount section
    const getAmountDisplay = () => {
        if (isAway) return 'AWAY';
        if (showWinningAmount) return ''; // Hide player amount while showing winning amount
        return moneyDisplay;
    };
    
    const getAmountColor = () => {
        if (isAway) return 'brand.gray10';
        if (showWinningAmount) return 'transparent'; // Hide player amount text
        return textColorAmount;
    };
    
    return (
        <VStack
            py={isPortrait ? '0.2875vmax' : '0.5vmin'}
            spacing={isPortrait ? '0.2875vmax' : '0.2875vmin'}
            h="100%"
            w="100%"
            borderRadius="full"
            justifyContent="center"
            position="relative"
        >
            <Text
                color={getTextColor()}
                fontWeight="700"
                overflow="hidden"
                fontSize={isPortrait ? '1.35vmax' : '1.45vmin'}
                textAlign="center"
                textOverflow="ellipsis"
                w="100%"
                whiteSpace="nowrap"
            >
                {displayName}
            </Text>
            <Box
                h={isPortrait ? '1.25vmax' : '1.5vmin'}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Text
                    color={getAmountColor()}
                    fontWeight="800"
                    lineHeight={isPortrait ? '1.25vmax' : '1.5vmin'}
                    fontSize={isPortrait ? '1.35vmax' : '1.475vmin'}
                    textAlign="center"
                >
                    {getAmountDisplay()}
                </Text>
            </Box>
            {showWinningAmount && (
                <Box
                    position="absolute"
                    top="72%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="#4A9A6D"
                    borderRadius="0.5rem"
                    py={isPortrait ? '0.28vmax' : '0.38vmin'}
                    px={isPortrait ? '0.5vmax' : '0.7vmin'}
                    opacity={winningAmountOpacity}
                    transition="opacity 0.5s ease-out"
                    zIndex={10}
                >
                    <Text
                        color="brand.textWhite"
                        fontWeight="800"
                        lineHeight={isPortrait ? '1.1vmax' : '1.3vmin'}
                        fontSize={isPortrait ? '1.175vmax' : '1.275vmin'}
                        textAlign="center"
                    >
                        +{storedWinningAmountDisplay}
                    </Text>
                </Box>
            )}
        </VStack>
    );
};

export default AvatarInfo;
