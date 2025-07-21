import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers([...menuAnatomy.keys]);

const MenuStyles = definePartsStyle({
    item: {
        bg: 'brand.mediumGray',
        color: 'white',
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'normal',
        _hover: {
            bg: 'brand.darkestGray',
        },
    },
    list: {
        maxWidth: '270px',
        bg: 'brand.mediumGray',
        border: 'none',
        borderRadius: '0.125rem',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
        marginTop: '0.625rem',
    },
});

const variants = {
    formField: definePartsStyle({
        button: {
            variant: 'formButton',
        },
        item: {
            bg: 'brand.gray30',
            color: 'white',
            fontSize: '0.875rem',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: 'normal',
            _hover: {
                bg: 'brand.darkestGray',
            },
            width: '100%',
            minWidth: '6.25rem',
        },
        list: {
            bg: 'brand.gray30',
            border: 'none',
            borderRadius: '0.125rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
            marginTop: '0.625rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: '0',
            minWidth: '6.25rem',
        },
    }),
    gameMenu: definePartsStyle({
        item: {
            bg: 'brand.mediumGray',
            color: 'white',
            fontSize: '1rem',
            textAlign: 'start',
            fontWeight: 'bold',
            whiteSpace: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            _hover: {
                bg: 'brand.darkestGray',
            },
        },
    }),
};

export const Menu = defineMultiStyleConfig({ baseStyle: MenuStyles, variants });

export default Menu;
