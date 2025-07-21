import { Box, Grid, GridItem } from '@chakra-ui/react';

import { ActionPanel } from './ActionPanel/ActionPanel';
import CardPanel from './CardPanel/CardPanel';
import { useHotkeyBlockingDisclosure } from '../../../../hooks/useHotkeyBlockingDisclosure';
import { ChatPanel } from './ChatPanel/ChatPanel';

export const LandscapeControls = () => {
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();

    return (
        <>
            <Grid
                color="white"
                templateColumns="repeat(12, 1fr)"
                gap={2}
                h="100%"
                w="100%"
            >
                <GridItem colSpan={3} zIndex={2} h="100%" position="relative">
                    <ChatPanel
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                    />
                </GridItem>
                <GridItem
                    gridColumn="span 6"
                    bg="brand.lightGray"
                    padding="8px"
                    h="100%"
                    zIndex={10}
                >
                    <ActionPanel />
                </GridItem>
                <GridItem bg="brand.lightGray" colSpan={3} position="relative">
                    <CardPanel />
                </GridItem>
            </Grid>
        </>
    );
};
