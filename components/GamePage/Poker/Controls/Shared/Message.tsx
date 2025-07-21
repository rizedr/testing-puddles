import { Text, Box, HStack, Image } from '@chakra-ui/react';
import React from 'react';

import { HandName, LogType } from '../../../../../client';
import { formatMoneyStringWithCommas } from '../../../../utils/formatMoney';
import { truncated } from '../../../../utils/getPlayerInfo';
import { stringToHSLColor } from '../../../../utils/chatUtils';
import { usePlayerUsername } from '../../../../hooks/usePlayerUsername';
import { Doc } from '../../../../../../../packages/convex/convex/_generated/dataModel';
import useUser from '../../../../hooks/useUser';
import { handNameToText } from '../../../../utils/handNameToText';


export const Message = ({ message }: { message: Doc<'chat'> }) => {
    const { user } = useUser(message.senderId);
    const timestamp = new Date(message._creationTime).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });

    const timeDisplay = timestamp;
    const messageDisplay =
        typeof message.message === 'string' ? message.message : '';

    return (
        <Box
            bg="brand.primaryGray"
            borderRadius="1.25rem"
            paddingX="0.625rem"
            paddingY="0.5rem"
            fontSize="0.875rem"
        >
            <HStack spacing={2} align="center">
                <Text
                    textAlign="start"
                    whiteSpace="pre-wrap"
                    fontWeight="bold"
                >
                    <Text as="span" color="brand.gray10" fontSize="0.8rem">
                        {timeDisplay}
                    </Text>{' '}
                    <Text
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        sx={{ transform: 'translateY(2.25px)' }}
                    >
                        <Image
                            src={user?.imageUrl ?? undefined}
                            alt="User Avatar"
                            width="1rem"
                            height="1rem"
                            borderRadius="50%"
                        />
                    </Text>
                    <Text
                        as="span"
                        color={stringToHSLColor(user?.username ?? '')}
                    >
                        {' ' + truncated(user?.username ?? '')}
                    </Text>
                    {' ' + messageDisplay}
                </Text>
            </HStack>
        </Box>
    );
};

const faceCardToValue: { [key: string]: string } = {
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    '11': 'J',
    '12': 'Q',
    '13': 'K',
    '14': 'A',
};

const suitToValue: { [key: string]: string } = {
    '0': '♥',
    '1': '♦',
    '2': '♣',
    '3': '♠',
};

const USER_LOG_TYPES = [
    LogType.CHECK,
    LogType.FOLD,
    LogType.CALL,
    LogType.BET,
    LogType.RAISE,
    LogType.ALL_IN,
    LogType.HOST_CHANGED,
    LogType.LEAVE,
    LogType.POST_SB,
    LogType.POST_BB,
    LogType.TIMEOUT,
    LogType.WIN,
    LogType.BOARD_WIN,
    LogType.UNCALLED_BET,
    LogType.SHOW_CARD,
    LogType.SHOW_CARDS,
    LogType.GAME_CREATED,
    LogType.STRADDLE,
    LogType.PLAYERS,
];

export const LogMessage = ({ log }: { log: Doc<'gameLogs'> }) => {
    let args = log.args;

    if (log.logType === LogType.HAND_END) {
        return null;
    }

    if (USER_LOG_TYPES.includes(log.logType)) {
        const username = usePlayerUsername(log.args[0] || '') || '';
        args = [username, ...log.args.slice(1)];
    }

    const logMessageFunction = LOG_ACTION_TO_USER_MESSAGE[log.logType];
    const logMessage = logMessageFunction
        ? logMessageFunction(args)
        : <Text color="red">Unknown log type</Text>;

    return (
        <HStack width="100%" align="center">
            <Text fontSize="0.75rem" color="brand.gray10">
                {new Date(log._creationTime).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                })}
            </Text>
            <Text
                fontSize="0.75rem"
                color={LOG_ACTION_TO_COLOR[log.logType] || 'gray.400'}
                overflowWrap="break-word"
                wordBreak="break-word"
            >
                {logMessage}
            </Text>
        </HStack>
    );
};

const LOG_ACTION_TO_COLOR: Record<number, string> = {
    [LogType.CHECK]: 'yellow.300',
    [LogType.FOLD]: 'red.300',
    [LogType.CALL]: 'yellow.300',
    [LogType.POST_SB]: 'gray.300',
    [LogType.POST_BB]: 'gray.300',
    [LogType.POST_BOMB_POT]: 'gray.300',
    [LogType.POST_ANTE]: 'gray.300',
    [LogType.STRADDLE]: 'gray.300',
    [LogType.TIMEOUT]: 'brand.white50',
    [LogType.WIN]: 'green.400',
    [LogType.BOARD_WIN]: 'green.400',
    [LogType.RAISE]: 'blue.300',
    [LogType.BET]: 'blue.300',
    [LogType.HAND_START]: 'brand.white60',
    [LogType.HAND_END]: 'brand.white60',
    [LogType.UNCALLED_BET]: 'gray.400',
    [LogType.BOMB_POT]: 'purple.300',
    [LogType.FLOP]: 'gray.200',
    [LogType.TURN]: 'gray.200',
    [LogType.RIVER]: 'gray.200',
    [LogType.ALL_IN]: 'blue.300',
};

const LOG_ACTION_TO_USER_MESSAGE: Record<number, (args: string[]) => React.ReactElement> = {
    [LogType.PLAYERS]: (args) => {
        // args: [username, index, amount, is_dealer, is_small_blind, is_big_blind]
        const labels = [];
        if (args[3]) labels.push('Dealer');
        if (args[4]) labels.push('SB');
        if (args[5]) labels.push('BB');
        return (
            <>
                <b> {args[1]} {truncated(args[0])} <b>${(parseFloat(args[2]) / 1000000).toFixed(2)}</b> {labels.length > 0 ? labels.join(' / ') : ''} </b>
            </>
        );
    },
    [LogType.CHECK]: (args) => (
        <>
            <b> {truncated(args[0])}</b> checks
        </>
    ),
    [LogType.FOLD]: (args) => (
        <>
            <b> {truncated(args[0])}</b> folds
        </>
    ),
    [LogType.CALL]: (args) => (
        <>
            <b> {truncated(args[0])}</b> calls <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.BET]: (args) => (
        <>
            <b> {truncated(args[0])}</b> bets <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.RAISE]: (args) => (
        <>
            <b> {truncated(args[0])}</b> raises to <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.ALL_IN]: (args) => (
        <>
            <b> {truncated(args[0])}</b> goes all in for <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.HOST_CHANGED]: (args) => (
        <>
            <b> {truncated(args[0])}</b> becomes the host
        </>
    ),
    [LogType.LEAVE]: (args) => (
        <>
            <b> {truncated(args[0])}</b> left the game
        </>
    ),
    [LogType.WIN]: (args) => {
        let handText = '';
        let showHandDetail = true;
        if (args[2] !== undefined && args[2] !== null && args[2] !== '') {
            const handNameNum = parseInt(args[2], 10);
            handText = handNameToText[handNameNum as HandName] || args[2];
            if (handNameNum === 1) { // 1 = LAST_PLAYER_STANDING
                showHandDetail = false;
            }
        }
        const handDetail = args[3] && args[3] !== '' ? args[3] : '';
        return (
            <>
                <b> {truncated(args[0])}</b> wins{' '}
                <b>${formatMoneyStringWithCommas((parseFloat(args[1]) / 1000000).toFixed(2))}</b>
                {(handText || handDetail) && (
                    <> ({handText}{showHandDetail && handDetail ? `, ${handDetail}` : ''})</>
                )}
            </>
        );
    },
    [LogType.BOARD_WIN]: (args) => (
        <>
            [#{args[1].toString()}] {truncated(args[0])} wins <b>({handNameToText[parseInt(args[2], 10) as HandName]})</b>
        </>
    ),
    [LogType.TURN_START]: function (
        args: string[],
    ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
        throw new Error('Function not implemented.');
    },
    [LogType.TIMEOUT]: (args) => (
        <>
            <b> {truncated(args[0])}</b> timed out
        </>
    ),
    [LogType.GAME_CREATED]: (args) => (
        <>
            <b> {truncated(args[0])}</b> created the game
        </>
    ),
    [LogType.BOMB_POT]: (args) => {
        return (
            <>
                <b>BOMB POT [{args[0]} BB]</b>
            </>
        );
    },
    [LogType.POST_BOMB_POT]: (args) => {
        return (
            <>
                All players post a <b>${(parseFloat(args[0]) / 1000000).toFixed(2)}</b> bomb pot ante  
            </>
        );
    },
    [LogType.POST_ANTE]: (args) => {
        return (
            <>
                All players post a <b>${(parseFloat(args[0]) / 1000000).toFixed(2)}</b> ante
            </>
        );
    },
    [LogType.FLOP]: (args) => {
        const flopCards = args.slice(0, 3).join(' ');
        return (
            <>
                <b>FLOP</b> - <b>[{flopCards}]</b>
            </>
        );
    },
    [LogType.TURN]: (args) => {
        const turnCards = args.slice(0, 3).join(' ');
        const turnCard = args[3];
        return (
            <>
                <b>TURN</b> - {turnCards} <b>[{turnCard}]</b>
            </>
        );
    },
    [LogType.RIVER]: (args) => {
        const riverCards = args.slice(0, 4).join(' ');
        const riverCard = args[4];
        return (
            <>
                <b>RIVER</b> - {riverCards} <b>[{riverCard}]</b>
            </>
        );
    },
    [LogType.POST_SB]: (args) => (
        <>
            <b> {truncated(args[0])}</b> posts a small blind of{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.POST_BB]: (args) => (
        <>
            <b> {truncated(args[0])}</b> posts a big blind of <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.HAND_START]: (args) => (
        <>
            <b>--------- Starting Hand #{args[0]} ---------</b>
        </>
    ),
    [LogType.HAND_END]: (args) => (
        <>
            <b>--- Ending hand #{args[0]} ---</b>
        </>
    ),
    [LogType.STRADDLE]: (args) => (
        <>
            <b> {truncated(args[0])}</b> straddles <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.UNCALLED_BET]: (args) => (
        <>
            <b>Uncalled bet of ${(parseFloat(args[1]) / 1000000).toFixed(2)}</b> returned to{' '}
            <b>{truncated(args[0])}</b>
        </>
    ),
    [LogType.SHOW_CARD]: (args) => {
        const card = faceCardToValue[args[1]] + suitToValue[args[2]];
        return (
            <>
                <b> {truncated(args[0])}</b> shows {card}
            </>
        );
    },
    [LogType.SHOW_CARDS]: (args) => (
        <>
            <b> {truncated(args[0])}</b> shows{' '}
            <b>
                {args.slice(1).join(' ')}
            </b>
        </>
    ),
};

export default Message;
