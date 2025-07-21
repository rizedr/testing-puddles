import React, { useState } from 'react';
import { Spacer, Box, Text, HStack } from '@chakra-ui/react';
import { ChatIcon, RepeatClockIcon, SettingsIcon } from '@chakra-ui/icons';

import { AwayIcon } from './AwayIcon';
import { Chat } from '../Shared/Chat';
import { Action, playerAction } from '../../../../../client';
import useUserStatus from '../../../../hooks/useUserStatus';
import SwipeableDrawer from '../../../../Shared/SwipeableDrawer';
import GameSettings from '../../../../Modals/GameSettingsModal/GameSettingsModal';
import { useHotkeyBlockingDisclosure } from '../../../../hooks/useHotkeyBlockingDisclosure';
import { useMuteState } from '../../../../hooks/useMuteState';
import { SoundOffIcon } from '../../../../Shared/SoundOffIcon';
import { SoundOnIcon } from '../../../../Shared/SoundOnIcon';
import useGameId from '../../../../hooks/useGameID';
import useGameData from '../../../../hooks/useGameData';
import useViewer from '../../../../hooks/useViewer';

const ICON_STYLES = {
    height: '1.25rem',
    width: '1.25rem',
};

const ActionButton = ({
    icon,
    text,
    onClick,
    isDisabled = false,
}: {
    icon: React.ReactElement;
    text: string;
    onClick: () => void;
    isDisabled?: boolean;
}) => (
    <Box
        as="button"
        onClick={onClick}
        alignItems="center"
        backgroundColor="transparent"
        color={isDisabled ? "gray.500" : "brand.accentWhite"}
        fill={isDisabled ? "gray.500" : "brand.accentWhite"}
        display="flex"
        flexDirection="column"
        textAlign="center"
        textTransform="uppercase"
        gap="0.15rem"
        opacity={isDisabled ? 0.5 : 1}
        cursor={isDisabled ? "not-allowed" : "pointer"}
    >
        {icon}
        <Text mt={1} fontSize="0.7rem" fontStyle="normal" fontWeight="400">
            {text}
        </Text>
    </Box>
);

const ModalButton = ({
    icon,
    text,
    modal,
}: {
    icon: React.ReactElement;
    text: string;
    modal: React.ComponentType<{
        isOpen: boolean;
        onClose: () => void;
    }>;
}) => {
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();
    const onClick = () => {
        onOpen();
    };
    return (
        <>
            <ActionButton icon={icon} text={text} onClick={onClick} />
            {React.createElement(modal, { isOpen, onClose })}
        </>
    );
};

export function SlideUpDrawer() {
    const {
        isOpen: isChatLogOpen,
        onOpen: onChatLogOpen,
        onClose: onChatLogClose,
    } = useHotkeyBlockingDisclosure();

    const [selectedChatTab, setSelectedChatTab] = useState<
        'Chat' | 'Game Logs'
    >('Chat');

    const gameId = useGameId();
    const { isSpectator } = useUserStatus();
    const { isMuted, toggleMute } = useMuteState();
    const { runItTwice, players } = useGameData();
    const { userId } = useViewer();

    var showMuted =
        typeof window !== 'undefined'
            ? window.localStorage.getItem('isMuted')
                ? window.localStorage.getItem('isMuted') === 'true'
                : false
            : true;

    // Check if Away action should be disabled during Run It Twice for active players
    const currentPlayer = players.find((player: any) => player.player_id === userId);
    const isAwayDisabled = runItTwice !== null && currentPlayer?.action !== Action.FOLD;

    const handleAction = (action: string) => {
        switch (action) {
            case 'Chat':
                setSelectedChatTab('Chat');
                onChatLogOpen();
                break;
            case 'Game Logs':
                setSelectedChatTab('Game Logs');
                onChatLogOpen();
                break;
            case 'Away':
                if (!isAwayDisabled) {
                    playerAction({
                        path: {
                            game_id: gameId,
                        },
                        body: {
                            action: Action.AWAY,
                        },
                    });
                }
                break;
        }
    };

    return (
        <>
            {/* Chat | Log Drawer */}
            <SwipeableDrawer
                isOpen={isChatLogOpen}
                onClose={onChatLogClose}
                title={selectedChatTab}
                body={
                    <Chat
                        height="60vh"
                        tabIndex={0}
                        showLogs={selectedChatTab === 'Game Logs'}
                    />
                }
                height="70vh"
            />

            {/* Main Menu */}
            <Box
                zIndex={1000}
                width="100dvw"
                position="relative"
                // bg="brand.primaryGray"
                borderTopRadius="md"
                borderTop="1px solid rgba(255, 255, 255, 0.1)"
                paddingY={2.5}
            >
                <HStack
                    justify="space-between"
                    align="center"
                    px="2.5rem"
                    py="0.5rem"
                    w="100%"
                    spacing={6}
                >
                    <ActionButton
                        icon={<ChatIcon {...ICON_STYLES} />}
                        text="Chat"
                        onClick={() => handleAction('Chat')}
                    />
                    <ActionButton
                        icon={<RepeatClockIcon {...ICON_STYLES} />}
                        text="Logs"
                        onClick={() => handleAction('Game Logs')}
                    />
                    <Spacer />
                    <ActionButton
                        icon={
                            showMuted ? (
                                <SoundOffIcon {...ICON_STYLES} />
                            ) : (
                                <SoundOnIcon {...ICON_STYLES} />
                            )
                        }
                        text={showMuted ? 'Sound Off' : 'Sound On'}
                        onClick={toggleMute}
                    />
                    {!isSpectator && (
                        <>
                            <ActionButton
                                icon={<AwayIcon {...ICON_STYLES} />}
                                text="Away"
                                onClick={() => handleAction('Away')}
                                isDisabled={isAwayDisabled}
                            />
                            <ModalButton
                                icon={<SettingsIcon {...ICON_STYLES} />}
                                text="Settings"
                                modal={GameSettings}
                            />
                        </>
                    )}
                </HStack>
            </Box>
        </>
    );
}

export default SlideUpDrawer;
