import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalBody,
    ModalCloseButton,
    Text,
    HStack,
    ModalFooter,
    Spacer,
    useBreakpointValue,
} from '@chakra-ui/react';
import SwipeableDrawer from '../Shared/SwipeableDrawer';

const GinzaModalCloseButton = () => {
    return (
        <ModalCloseButton
            color="#BDBDBD"
            _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                color: 'white',
            }}
            fontSize="16px"
            top="8px"
            right="8px"
            borderRadius="4px"
        />
    );
};

export const GinzaModalHeader = ({ title }: { title: string }) => {
    return (
        <ModalHeader
            // borderBottom="1px solid rgba(255, 255, 255, 0.1)"
            bg="transparent"
            borderRadius="16px 16px 0 0"
        >
            <Text variant="modalHeader">{title}</Text>
            <GinzaModalCloseButton />
        </ModalHeader>
    );
};

export const GinzaModalFooter = ({
    primaryButton,
    secondaryButton,
}: {
    primaryButton?: React.ReactNode;
    secondaryButton?: React.ReactNode;
}) => {
    if (!primaryButton && !secondaryButton) return null;
    return (
        <ModalFooter
            position="sticky"
            bottom="0"
            // bg="brand.modalGray"
            borderTop="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="0 0 16px 16px"
        >
            <HStack width="100%">
                <Spacer />
                {secondaryButton}
                {primaryButton}
            </HStack>
        </ModalFooter>
    );
};

export const GinzaModal = ({
    isOpen,
    onClose,
    title,
    content,
    primaryButton = null,
    secondaryButton = null,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
    primaryButton?: React.ReactNode;
    secondaryButton?: React.ReactNode;
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
            isCentered
            size="md"
        >
            <ModalOverlay />
            <ModalContent
                minWidth="fit-content"
                minHeight="20vh"
                maxHeight="70vh"
                bg="brand.modalGray"
                // bg="#0F0523"
                borderRadius="16px"
                border="1px solid rgba(255,255,255,0.25)"
                maxWidth="380px"
            >
                <GinzaModalHeader title={title} />
                <ModalBody
                    p="1rem"
                    alignItems="baseline"
                    minWidth="fit-content"
                    minHeight="20vh"
                    maxHeight="70vh"
                >
                    {content}
                </ModalBody>
                <GinzaModalFooter
                    primaryButton={primaryButton}
                    secondaryButton={secondaryButton}
                />
            </ModalContent>
        </Modal>
    );
};

export const GinzaSurface = ({
    isOpen,
    onClose,
    title,
    content,
    primaryButton,
    secondaryButton,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
    primaryButton?: React.ReactNode;
    secondaryButton?: React.ReactNode;
}) => {
    const isPortrait = useBreakpointValue({ base: true, xl: false });

    if (!isOpen) return null;

    if (isPortrait) {
        return (
            <SwipeableDrawer
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                body={content}
                primaryButton={primaryButton}
                secondaryButton={secondaryButton}
            />
        );
    }

    return (
        <GinzaModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            content={content}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
        />
    );
};
