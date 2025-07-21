import {
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    IconButton,
    Box,
} from '@chakra-ui/react';

import { Chat } from '../../Shared/Chat';

import useChatPanel from './useChatPanel';
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

export const ChatPanel = ({
    isOpen,
    onOpen,
    onClose,
}: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}) => {
    const { tabIndex, setTabIndex, chatTabText, logTabText } = useChatPanel();

    const chatExpansionIcon = isOpen ? <FaChevronDown /> : <FaChevronUp />;

    return (
        <Tabs
            position="absolute"
            variant="chat"
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
            w="23.65vw"
            h={isOpen ? '250%' : '100%'}
            top={isOpen ? '-150%' : '0'}
            isLazy
        >
            <TabList position="absolute" top="-2.425rem" borderBottom="none">
                <Tab>
                    <Text fontSize="sm">{chatTabText}</Text>
                </Tab>
                <Tab>
                    <Text fontSize="sm">{logTabText}</Text>
                </Tab>
            </TabList>
            <IconButton
                position="absolute"
                aria-label="Expand chat"
                icon={chatExpansionIcon}
                right="0"
                top="-1.875rem"
                variant="chatButton"
                onClick={isOpen ? onClose : onOpen}
            />

            <TabPanels h="100%">
                <TabPanel h="100%" padding="8px" pb="16px">
                    <Chat showLogs={false} tabIndex={tabIndex} />
                </TabPanel>
                <TabPanel h="100%" bg="brand.lightGray" padding="8px">
                    <Chat showLogs={true} tabIndex={tabIndex} />
                    <Box
                        position="absolute"
                        bottom="0.82rem"
                        left="0.75rem"
                    ></Box>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default ChatPanel;
