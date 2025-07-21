import React from 'react';

import InGamePlayersTable from './InGamePlayersTable';
import PendingPlayersTable from './PendingPlayersTable';
import { useBreakpointValue, VStack } from '@chakra-ui/react';
import { GinzaSurface } from '../GinzaModal';
import InGamePlayersSection from './Portrait/InGamePlayersSection';
import PendingPlayersSection from './Portrait/PendingPlayersSection';

interface PlayerManagementProps {
    isOpen: boolean;
    onClose: () => void;
}

const PlayerManagement = ({ isOpen, onClose }: PlayerManagementProps) => {
    const isPortrait = useBreakpointValue({ base: true, xl: false });
    const content = (
        <VStack w="100%" spacing="1.5rem" align="stretch">
            {!isPortrait && <PendingPlayersTable />}
            {!isPortrait && <InGamePlayersTable />}
            {isPortrait && <PendingPlayersSection />}
            {isPortrait && <InGamePlayersSection />}
        </VStack>
    );
    return (
        <GinzaSurface
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Players"
            content={content}
        />
    );
};

export default React.memo(PlayerManagement);
