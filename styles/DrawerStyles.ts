import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { drawerAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers([...drawerAnatomy.keys]);

const baseStyle = definePartsStyle({
    dialog: {
        bg: 'brand.primaryGray',
        color: 'brand.accentWhite',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
    },
});

export const Drawer = defineMultiStyleConfig({ baseStyle });
