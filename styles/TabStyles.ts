import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { tabsAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers([...tabsAnatomy.keys]);

const baseStyle = definePartsStyle({
    root: {
        border: 'none',
    },
    tab: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '1rem',
        fontStyle: 'normal',
        fontWeight: '700',
        backgroundColor: 'brand.gray30',
        textTransform: 'uppercase',
        _selected: {
            textDecoration: 'underline',
            color: 'brand.white80',
        },
    },
});

const variants = {
    chat: definePartsStyle({
        root: {
            border: 'none',
        },
        tab: {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1rem',
            fontStyle: 'normal',
            fontWeight: '700',
            minWidth: '5.5rem',
            _selected: {
                backgroundColor: 'brand.lightGray',
                borderBottom: 'none',
                borderTop: '0.125rem solid',
                color: 'rgba(202, 235, 237, 1.0)',
                textDecoration: 'none',
            },
            _hover: {
                backgroundColor: 'brand.lightGray',
                color: 'rgba(202, 235, 237, 1.0)',
                borderBottom: 'none',
            },
            _focus: {
                boxShadow: 'none',
                borderBottom: 'none',
            },
            _active: {
                backgroundColor: 'brand.lightGray',
                borderBottom: 'none',
            },
        },
        tablist: {
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: '0px',
        },
        tabpanel: {
            border: 'none',
            backgroundColor: 'brand.lightGray',
        },
    }),
};

export const Tabs = defineMultiStyleConfig({ baseStyle, variants });
