import { useDisclosure } from '@chakra-ui/react';

export const useHotkeyBlockingDisclosure = () => {
    const { isOpen, onOpen: _onOpen, onClose: _onClose } = useDisclosure();

    const onOpen = () => {
        _onOpen();
    };

    const onClose = () => {
        _onClose();
    };

    return { isOpen, onOpen, onClose };
};
