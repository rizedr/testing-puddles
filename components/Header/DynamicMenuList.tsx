import {
    MenuList,
    MenuDivider,
    Icon,
    MenuItem,
    MenuGroup,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

import { CashOutMenuItem } from './CashOutMenuItem';
import useUserStatus from '../hooks/useUserStatus';
import React from 'react';
import LedgerModal from '../Modals/LedgerModal/LedgerModal';
import TopUpModal from '../Modals/TopUpModal/TopUpModal';
import { useReferralLink } from '../hooks/useReferralLink';
import GameSettings from '../Modals/GameSettingsModal/GameSettingsModal';
import PlayerManagement from '../Modals/PlayerManagementModal/PlayerManagement';
import { useHotkeyBlockingDisclosure } from '../hooks/useHotkeyBlockingDisclosure';
import AwayMenuItem from './AwayMenuItem';
import { UserPreferencesModal } from '../Modals/UserPreferencesModal/UserPreferencesModal';
import { useConvexAuth } from 'convex/react';
import { useGameData } from '../hooks/useGameData';
import { Action } from '../../client';

interface CustomMenuItemProps {
    onClick: () => void;
    icon?: IconType;
    label: string;
    leftPadding?: number;
}

interface ModalMenuItemProps {
    icon?: IconType;
    label: string;
    leftPadding?: number;
    modal: React.ComponentType<{
        isOpen: boolean;
        onClose: () => void;
    }>;
}

export const CustomMenuItem = ({
    onClick,
    icon,
    label,
}: CustomMenuItemProps) => (
    <MenuItem
        onClick={onClick}
        fontSize="1rem"
        fontWeight="medium"
        h="2.3rem"
        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        display="flex"
        alignItems="center"
    >
        {icon && <Icon as={icon} color="white" boxSize={4} mr={4} />}
        <span style={{ marginLeft: icon ? '6px' : '0' }}>{label}</span>
    </MenuItem>
);

const ModalMenuItem = ({ icon, label, modal }: ModalMenuItemProps) => {
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();
    return (
        <>
            <CustomMenuItem onClick={onOpen} icon={icon} label={label} />
            {React.createElement(modal, { isOpen, onClose })}
        </>
    );
};

const DynamicMenuList = () => {
    const { copyURL } = useReferralLink();

    const { isHost, isSpectator, isAway } = useUserStatus();
    const { isAuthenticated } = useConvexAuth();
    const { players } = useGameData();
    const isHeadsUp =
        players.length <= 2 ||
        players.filter((player) => player.action !== Action.AWAY).length <= 2;

    return (
        <MenuList borderRadius="0.5rem" p={2}>
            {isHost && isAuthenticated && (
                <MenuGroup
                    title="HOST"
                    fontSize="0.75rem"
                    color="rgba(211, 211, 211, 0.7)"
                    textAlign="left"
                    margin="12px 0px 4px 20px"
                    fontWeight="bold"
                    display="block"
                >
                    <ModalMenuItem
                        label="Manage Players"
                        modal={PlayerManagement}
                    />
                    <MenuDivider
                        borderColor="rgba(255, 255, 255, 0.2)"
                        width="calc(100% - 34px)"
                        mx="18px"
                    />
                </MenuGroup>
            )}

            {isAuthenticated && (
                <MenuGroup
                    title="USER"
                    fontSize="0.75rem"
                    color="rgba(211, 211, 211, 0.7)"
                    textAlign="left"
                    margin="12px 0px 4px 20px"
                    fontWeight="bold"
                    display="block"
                >
                    <ModalMenuItem
                        label="User Preferences"
                        modal={UserPreferencesModal}
                    />
                    <MenuDivider
                        borderColor="rgba(255, 255, 255, 0.2)"
                        width="calc(100% - 34px)"
                        mx="18px"
                    />
                </MenuGroup>
            )}

            <MenuGroup
                title="IN-GAME"
                fontSize="0.75rem"
                color="rgba(211, 211, 211, 0.7)"
                textAlign="left"
                margin="12px 0px 4px 20px"
                fontWeight="bold"
                display="block"
            >
                <ModalMenuItem label="Game Settings" modal={GameSettings} />
                <ModalMenuItem label="Session Ledger" modal={LedgerModal} />
                {isAuthenticated && (
                    <CustomMenuItem onClick={copyURL} label="Invite Player" />
                )}

                {!isSpectator && (
                    <ModalMenuItem label="Top Up" modal={TopUpModal} />
                )}
                {isAuthenticated && !isSpectator && !isAway && <AwayMenuItem />}
            </MenuGroup>

            <MenuDivider
                borderColor="rgba(255, 255, 255, 0.2)"
                my={2}
                width="calc(100% - 34px)"
                mx="18px"
            />

            <CashOutMenuItem isSpectator={isSpectator} />
        </MenuList>
    );
};

export default DynamicMenuList;
