import React from 'react';
import {
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Image,
} from '@chakra-ui/react';

// import { useGameSettingsModal } from './useGameSettingsModal';
// import useDeviceProperties from '../../hooks/useDeviceProperties';

// import HostSettingsStep from '../Shared/HostSettingsStep';
// import SwipeableDrawer from '../../Shared/SwipeableDrawer';
// import { primaryProps } from '../../../styles/Buttons/CommonStyles';

export default function ClubModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    // const { isPortrait } = useDeviceProperties();

    // if (isPortrait) {
    //     return (
    //         <SwipeableDrawer
    //             isOpen={isOpen}
    //             onClose={onClose}
    //             headerContent={<Text variant="modalHeader">Game Settings</Text>}
    //             body={
    //                 <DrawerBody
    //                     minHeight="35vh"
    //                     paddingTop="1.5rem"
    //                     display="flex"
    //                     flexDirection="column"
    //                     bg="brand.modalGray"
    //                 >
    //                     {renderContent()}
    //                 </DrawerBody>
    //             }
    //             footer={
    //                 <DrawerFooter
    //                     height="7rem"
    //                     display="flex"
    //                     bg="brand.modalGray"
    //                     padding="0.75rem 3rem"
    //                     justifyContent="flex-end"
    //                 >
    //                 </DrawerFooter>
    //             }
    //         />
    //     );
    // }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                borderRadius="0.75rem"
                position="relative"
                // minW="700px"
                // maxW="900px"

                minW="300px"
                maxW="450px"
                h="max(380px, 40vh)"
                top="0px"
                overflowY="auto"
            >
                <ModalHeader background="brand.modalGray">
                    <Image
                        src="/PokerClubs.png"
                        // w="3000px"
                        // h="120px"
                        // mb={2}
                        alignSelf="center"
                    />
                    <ModalCloseButton
                        color="#BDBDBD"
                        _hover={{
                            bg: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            color: 'white',
                        }}
                        fontSize="16px"
                        top="10px"
                        right="10px"
                        borderRadius="4px"
                        zIndex="10"
                    />
                </ModalHeader>

                {/* <Image
                        src="/PokerClubs.png"
                        w="420px"
                        h="140px"
                        // mb={2}
                        alignSelf="center"
                />     */}

                <ModalBody
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* <Image
                        src="/PokerClubs.png"
                        w="420px"
                        h="120px"
                        mb={2}
                        alignSelf="center"
                    />     */}
                    {/* <Image src="/CoolCats.png" alt="Cool Cats" boxSize="150px" marginBottom="1rem" /> */}
                    <Text fontSize="30px" fontWeight="900">
                        UNDER CONSTRUCTION
                    </Text>
                    <Text fontSize="lg" fontWeight="bold">
                        Coming soon!
                    </Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
