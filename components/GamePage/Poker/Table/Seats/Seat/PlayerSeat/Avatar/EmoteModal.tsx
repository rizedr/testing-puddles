import React from 'react';
import { Box, Image, Modal, ModalContent, ModalBody } from '@chakra-ui/react';

interface EmoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectEmote: (emoteId: string) => void;
    isPortrait: boolean;
}

const emotes = [
    { src: '/emotes/1_happy.webp', id: '1_happy.webp' },
    { src: '/emotes/1_sad.webp', id: '1_sad.webp' },
    { src: '/emotes/1_angry.webp', id: '1_angry.webp' },
    { src: '/emotes/1_surprised.webp', id: '1_surprised.webp' },
    { src: '/emotes/1_mischievous.webp', id: '1_mischievous.webp' },
    { src: '/emotes/1_sleeping.webp', id: '1_sleeping.webp' },
];

export const EmoteModal: React.FC<EmoteModalProps> = ({ isOpen, onClose, onSelectEmote, isPortrait }) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            closeOnOverlayClick={true}
            useInert={false}
            blockScrollOnMount={false}
            trapFocus={false}
            overlayProps={{ bg: 'transparent' }}
        >
            <ModalContent
                left={isPortrait ? "0vmax" : "-7.4vmin"}
                top={isPortrait ? "45vmax" : "34.5vmin"}
                transform="translateX(-50%)"
                alignItems="center"
                justifyContent="center"
                height={isPortrait ? "17.5vmax" : "20vmin"}
                width={isPortrait ? "27vmax" : "30vmin"}
                bg="rgba(18, 20, 24, 1)"
                boxShadow={`0 0 8px rgb(177, 137, 241)`}
                borderRadius="12px"
                border="1px solid rgb(121, 102, 132)"
                position="relative"
                _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderWidth: '10px 10px 0 10px',
                    borderStyle: 'solid',
                    borderColor: 'rgb(121, 102, 132) transparent transparent transparent',
                }}
            >
                <ModalBody>
                    <Box 
                        display="grid" 
                        gridTemplateColumns="repeat(3, 1fr)" 
                        gridTemplateRows="repeat(2, 1fr)" 
                        gap="4px"
                        justifyContent="center" 
                        alignItems="center"
                    >
                        {emotes.map((emote) => (
                            <Image
                                key={emote.id}
                                src={emote.src}
                                alt={emote.id}
                                onClick={() => {
                                    onSelectEmote(emote.id);
                                    onClose();
                                }}
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                                cursor="pointer"
                                width="100%"
                                _hover={{ transform: 'scale(1.1)' }}
                                transition="transform 0.2s"
                                userSelect="none"
                            />
                        ))}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EmoteModal;
