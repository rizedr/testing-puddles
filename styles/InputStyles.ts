import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers([...inputAnatomy.keys]);

const InputStyles = definePartsStyle({
    addon: {
        textColor: 'white',
        border: 'none',
        borderRadius: '0px',
        bg: 'brand.lightestGray',
        w: '92px',
        h: '2rem',
        paddingX: '0.75rem',
        _focusVisible: { outline: 'none' },
        _invalid: { outline: 'none' },
    },
});

const variants = {
    filled: {
        field: {
            borderRadius: '0px',
            border: 'none',
            bg: 'brand.gray70',
            _focusVisible: { outline: 'none' },
            _invalid: { outline: 'none' },
            _hover: { bg: 'brand.gray50' },
            _focus: { bg: 'brand.gray50' },
        },
    }
};

export const Input = defineMultiStyleConfig({
    baseStyle: InputStyles,
    variants,
});

export default Input;
