import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { modalAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers([...modalAnatomy.keys]);

const baseStyle = definePartsStyle({
    header: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
    },
    dialog: {
        bg: 'brand.primaryGray',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
    },
    body: {
        alignItems: 'center',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        py: '1.875rem',
        textAlign: 'center',
    },
    closeButton: {
        color: 'white',
    },
    footer: {
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'flex-end',
        padding: '0.75rem 1rem',
    },
});

export const Modal = defineMultiStyleConfig({ baseStyle });
