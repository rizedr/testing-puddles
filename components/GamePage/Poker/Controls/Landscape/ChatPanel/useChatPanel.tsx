import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHasPhysicalKeyboard } from '../../../../../hooks/useHasPhysicalKeyboard';
import useViewer from '../../../../../hooks/useViewer';

export const useChatPanel = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const hasPhysicalKeyboard = useHasPhysicalKeyboard();
    const { user } = useViewer();
    const keyboardShortcuts = user?.pokerPreferences?.keyboardShortcuts ?? true;

    const chatTabText = hasPhysicalKeyboard && keyboardShortcuts ? 'CHAT [M]' : 'CHAT';
    const logTabText = hasPhysicalKeyboard && keyboardShortcuts ? 'LOG [L]' : 'LOG';

    useHotkeys('M', () => setTabIndex(0), { enabled: keyboardShortcuts });
    useHotkeys('L', () => setTabIndex(1), { enabled: keyboardShortcuts });

    return {
        tabIndex,
        setTabIndex,
        chatTabText,
        logTabText,
    };
};

export default useChatPanel;
