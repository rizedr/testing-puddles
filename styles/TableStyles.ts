import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { nunitoSans } from '../tools/fonts';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers([...tableAnatomy.keys]);

const baseStyle = definePartsStyle({
    th: {
        color: 'brand.textWhite',
        fontFamily: nunitoSans.style.fontFamily,
        fontSize: '0.875rem',
        fontStyle: 'normal',
        borderRight: '1px solid',
        borderColor: 'brand.gray20',
        fontWeight: '400',
        lineHeight: 'normal',
    },
});

export const Table = defineMultiStyleConfig({ baseStyle });

export default Table;
