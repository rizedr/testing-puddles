import { Flex, Box } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { useScrollToBottom } from './useScrollToBottom';

import Message, { LogMessage } from './Message';
import { ChatInput } from './ChatInput';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../../packages/convex/convex/_generated/api';
import { Doc } from '../../../../../../../packages/convex/convex/_generated/dataModel';
import useGameId from '../../../../hooks/useGameID';
import { LogType } from '../../../../../client';

interface ChatProps {
    showLogs: boolean;
    height?: string;
    tabIndex: number;
}

interface MessageListProps {
    messagesToDisplay: (Doc<'chat'> | Doc<'gameLogs'>)[];
    showLogs: boolean;
    tabIndex: number;
    scrollRef: React.RefObject<HTMLDivElement>;
}

interface RowProps {
    index: number;
    style: React.CSSProperties;
    data: {
        messagesToDisplay: (Doc<'chat'> | Doc<'gameLogs'>)[];
        showLogs: boolean;
        getItemSize: (index: number) => number;
        setItemSize: (index: number, size: number) => void;
    };
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
    const { messagesToDisplay, showLogs, getItemSize, setItemSize } = data;
    const msg = messagesToDisplay[index];
    
    // Create a ref to measure the content
    const measureRef = useRef<HTMLDivElement>(null);
    
    // Effect to measure the height after rendering
    useEffect(() => {
        if (measureRef.current) {
            const height = measureRef.current.getBoundingClientRect().height;
            if (height !== getItemSize(index)) {
                setItemSize(index, height);
            }
        }
    }, [index, getItemSize, setItemSize, msg]);

    return (
        <div 
            style={{
                ...style,
                // Add a minimum height to prevent overlap
                height: Math.max((style.height as number), getItemSize(index) + 4), 
            }}
        >
            <div ref={measureRef}>
                <Box 
                    px="4px" 
                    paddingY="0.1rem"
                >
                    {showLogs ? (
                        <LogMessage log={msg as Doc<'gameLogs'>} />
                    ) : (
                        <Message message={msg as Doc<'chat'>} />
                    )}
                </Box>
            </div>
        </div>
    );
};

const MessageList: React.FC<MessageListProps> = ({
    messagesToDisplay,
    showLogs,
    tabIndex,
    scrollRef,
}) => {
    const listRef = useRef<List>(null);
    const sizeMap = useRef<Record<number, number>>({});

    const getItemSize = (index: number) => {
        return sizeMap.current[index] || 30; // Slightly larger default size
    };

    const setItemSize = (index: number, size: number) => {
        // Add a small buffer to the size to ensure spacing
        const sizeWithBuffer = size + 4; 
        sizeMap.current[index] = sizeWithBuffer;
        if (listRef.current) {
            listRef.current.resetAfterIndex(index);
        }
    };

    // Clear size cache when tab changes to force remeasuring
    useEffect(() => {
        sizeMap.current = {};
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, [tabIndex, showLogs]);

    // Also reset when message list changes length
    useEffect(() => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, [messagesToDisplay.length]);

    const itemData = {
        messagesToDisplay,
        showLogs,
        getItemSize,
        setItemSize,
        tabIndex,
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            const listElement = scrollRef.current;
            if (listElement) {
                const isNearBottom =
                    listElement.scrollHeight -
                        listElement.scrollTop -
                        listElement.clientHeight <
                    150;
                const isAtTop = listElement.scrollTop === 0;
                if (isNearBottom || isAtTop) {
                    listRef.current?.scrollToItem(
                        messagesToDisplay.length - 1,
                        'end',
                    );
                }
            }
        });
    }, [tabIndex, messagesToDisplay]);

    return (
        <Flex
            direction="column"
            bg="brand.chatGray"
            id="chat-scroll-container"
            w="100%"
            h="100%"
            flex="1"
            overflow="hidden"
            align="start"
            ref={scrollRef}
        >
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        outerRef={scrollRef}
                        width={width}
                        height={height}
                        itemCount={messagesToDisplay.length}
                        itemSize={getItemSize}
                        itemData={itemData}
                        overscanCount={10} // Increased overscan for better performance
                        style={{ paddingBottom: "4px" }} // Add padding at bottom of list
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </Flex>
    );
};

export const Chat = (props: ChatProps) => {
    const { showLogs, height = '100%', tabIndex } = props;
    const { scrollRef } = useScrollToBottom();
    const gameId = useGameId();
    const chatMessages: Doc<'chat'>[] =
        useQuery(
            api.chat.getChat,
            showLogs
                ? 'skip'
                : {
                      gameId: gameId,
                  },
        ) ?? [];
    const gameLogMessages: Doc<'gameLogs'>[] =
        useQuery(
            api.tasks.getGameLogs,
            showLogs
                ? {
                      gameId: gameId,
                  }
                : 'skip',
        ) ?? [];

    const messagesToDisplay = showLogs
        ? gameLogMessages.filter((log) => log.logType !== LogType.PLAYERS)
        : chatMessages;

    return (
        <Flex direction="column" h={height}>
            <MessageList
                key={tabIndex} // Add key prop to force remount on tabIndex change
                messagesToDisplay={messagesToDisplay}
                showLogs={showLogs}
                scrollRef={scrollRef}
                tabIndex={tabIndex}
            />
            {!showLogs && (
                <Box w="100%" mt="0.625rem" h="2.25rem" mb="0.125rem">
                    <ChatInput gameId={gameId} />
                </Box>
            )}
        </Flex>
    );
};

export default Chat;
