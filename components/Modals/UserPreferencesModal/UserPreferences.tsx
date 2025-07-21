import React from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import useViewer from '../../hooks/useViewer';
import { SwitchWithIcon } from './SwitchWithIcon';

export const UserPreferences = () => {
    const { user } = useViewer();

    const updatePreferences = useMutation(api.users.updateUserPreferences);

    const handleStraddleToggle = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        try {
            await updatePreferences({
                pokerPreferences: {
                    theme: 'GREEN',
                    autoStraddle: e.target.checked ?? false, // Default to false if undefined
                    fourColorDeck:
                        user?.pokerPreferences?.fourColorDeck ?? false, // Default to false if undefined
                    displayAmountsInBigBlinds:
                        user?.pokerPreferences?.displayAmountsInBigBlinds ??
                        false, // Default to false if undefined
                    autoActivateExtraTime:
                        user?.pokerPreferences?.autoActivateExtraTime ?? true, // Default to true if undefined
                    keyboardShortcuts:
                        user?.pokerPreferences?.keyboardShortcuts ?? true, // Default to true if undefined
                },
            });
        } catch (error) {
            // More detailed error message
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error updating preferences:', errorMessage);
        }
    };

    const handleFourColorDeckToggle = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        try {
            await updatePreferences({
                pokerPreferences: {
                    theme: 'GREEN',
                    autoStraddle: user?.pokerPreferences?.autoStraddle ?? false, // Default to false if undefined
                    fourColorDeck: e.target.checked ?? false, // Default to false if undefined
                    displayAmountsInBigBlinds:
                        user?.pokerPreferences?.displayAmountsInBigBlinds ??
                        false, // Default to false if undefined
                    autoActivateExtraTime:
                        user?.pokerPreferences?.autoActivateExtraTime ?? true, // Default to true if undefined
                    keyboardShortcuts:
                        user?.pokerPreferences?.keyboardShortcuts ?? true, // Default to true if undefined
                },
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error updating preferences:', errorMessage);
        }
    };

    const handleDisplayAmountsInBigBlindsToggle = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        try {
            await updatePreferences({
                pokerPreferences: {
                    theme: 'GREEN',
                    autoStraddle: user?.pokerPreferences?.autoStraddle ?? false, // Default to false if undefined
                    fourColorDeck:
                        user?.pokerPreferences?.fourColorDeck ?? false, // Default to false if undefined
                    displayAmountsInBigBlinds: e.target.checked ?? false, // Default to false if undefined
                    autoActivateExtraTime:
                        user?.pokerPreferences?.autoActivateExtraTime ?? true, // Default to true if undefined
                    keyboardShortcuts:
                        user?.pokerPreferences?.keyboardShortcuts ?? true, // Default to true if undefined
                },
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error updating preferences:', errorMessage);
        }
    };

    const handleAutoActivateExtraTimeToggle = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        try {
            await updatePreferences({
                pokerPreferences: {
                    theme: 'GREEN',
                    autoStraddle: user?.pokerPreferences?.autoStraddle ?? false,
                    fourColorDeck: user?.pokerPreferences?.fourColorDeck ?? false,
                    displayAmountsInBigBlinds: user?.pokerPreferences?.displayAmountsInBigBlinds ?? false,
                    autoActivateExtraTime: e.target.checked ?? true,
                    keyboardShortcuts: user?.pokerPreferences?.keyboardShortcuts ?? true,
                },
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error updating preferences:', errorMessage);
        }
    };

    const handleKeyboardShortcutsToggle = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        try {
            await updatePreferences({
                pokerPreferences: {
                    theme: 'GREEN',
                    autoStraddle: user?.pokerPreferences?.autoStraddle ?? false,
                    fourColorDeck: user?.pokerPreferences?.fourColorDeck ?? false,
                    displayAmountsInBigBlinds: user?.pokerPreferences?.displayAmountsInBigBlinds ?? false,
                    autoActivateExtraTime: user?.pokerPreferences?.autoActivateExtraTime ?? true,
                    keyboardShortcuts: e.target.checked ?? true,
                },
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Error updating preferences:', errorMessage);
        }
    };

    return (
        <VStack spacing={6} align="stretch" width="100%" p={4}>
            <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <VStack align="start" spacing={1}>
                    <FormLabel htmlFor="auto-straddle" mb="0">
                        Auto-Straddle UTG
                    </FormLabel>
                    <Text fontSize="sm" color="gray.500">
                        Automatically place 2BB straddle bet in the UTG position
                    </Text>
                </VStack>
                <SwitchWithIcon
                    id="auto-straddle"
                    isChecked={!!user?.pokerPreferences?.autoStraddle}
                    onChange={handleStraddleToggle}
                />
            </FormControl>
            <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <VStack align="start" spacing={1}>
                    <FormLabel htmlFor="four-color-deck" mb="0">
                        Four Color Deck
                    </FormLabel>
                    <Text fontSize="sm" color="gray.500">
                        Use a four color deck for better card visibility
                    </Text>
                </VStack>
                <SwitchWithIcon
                    id="four-color-deck"
                    isChecked={!!user?.pokerPreferences?.fourColorDeck}
                    onChange={handleFourColorDeckToggle}
                />
            </FormControl>
            <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <VStack align="start" spacing={1}>
                    <FormLabel htmlFor="display-amounts-in-big-blinds" mb="0">
                        Display Amounts in Big Blinds
                    </FormLabel>
                    <Text fontSize="sm" color="gray.500">
                        Display amounts in big blinds instead of dollars
                    </Text>
                </VStack>
                <SwitchWithIcon
                    id="display-amounts-in-big-blinds"
                    isChecked={!!user?.pokerPreferences?.displayAmountsInBigBlinds}
                    onChange={handleDisplayAmountsInBigBlindsToggle}
                />
            </FormControl>
            <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <VStack align="start" spacing={1}>
                    <FormLabel htmlFor="auto-activate-extra-time" mb="0">
                        Auto Activate Extra Time
                    </FormLabel>
                    <Text fontSize="sm" color="gray.500">
                        Automatically activate extra time when it becomes your turn
                    </Text>
                </VStack>
                <SwitchWithIcon
                    id="auto-activate-extra-time"
                    isChecked={user?.pokerPreferences?.autoActivateExtraTime ?? true}
                    onChange={handleAutoActivateExtraTimeToggle}
                />
            </FormControl>
            <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <VStack align="start" spacing={1}>
                    <FormLabel htmlFor="keyboard-shortcuts" mb="0">
                        Keyboard Shortcuts
                    </FormLabel>
                    <Text fontSize="sm" color="gray.500">
                        Enable keyboard shortcut hotkeys for poker actions
                    </Text>
                </VStack>
                <SwitchWithIcon
                    id="keyboard-shortcuts"
                    isChecked={user?.pokerPreferences?.keyboardShortcuts ?? true}
                    onChange={handleKeyboardShortcutsToggle}
                />
            </FormControl>
        </VStack>
    );
};
