import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers([...selectAnatomy.keys]);

const baseStyle = definePartsStyle({
    field: {
        alignItems: 'center',
        background: 'brand.gray30',
        border: 'none',
        borderRadius: '0.125rem',
        color: 'brand.white',
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: '700',
        gap: '0.9375rem',
        leadingTrim: 'both',
        lineHeight: 'normal',
        padding: '0.625rem',
        textEdge: 'cap',
        _selected: {
            textDecoration: 'underline',
            color: 'brand.white80',
        },
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.5)',
        width: '0.75rem',
        height: '6px',
    },
});

export const Select = defineMultiStyleConfig({ baseStyle });
