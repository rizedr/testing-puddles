import { extendTheme } from '@chakra-ui/react';

import { Button } from './Buttons/ButtonStyles';
import { Text } from './TextStyles';
import { Menu } from './MenuStyles';
import { Modal } from './ModalStyles';
import { Tabs } from './TabStyles';
import { Select } from './SelectStyles';
import { Radio } from './RadioStyles';
import { Input } from './InputStyles';
import { Slider } from './SliderStyles';
import { Progress } from './Progress';
import { Table } from './TableStyles';
import { Drawer } from './DrawerStyles';
import { nunitoSans, robotoMono } from '../tools/fonts';

export const theme = extendTheme({
    styles: {
        global: {
            'html, body': {
                backgroundColor: '#1C1C1C',
                fontFamily: nunitoSans.style.fontFamily,
                fontSize: { base: '0.8rem', sm: '1rem' },
            },
        },
    },
    components: {
        Button,
        Drawer,
        Input,
        Menu,
        Modal,
        Progress,
        Radio,
        Select,
        Slider,
        Table,
        Tabs,
        Text,
    },
    fonts: {
        heading: nunitoSans.style.fontFamily,
        body: nunitoSans.style.fontFamily,
        mono: robotoMono.style.fontFamily,
    },
    colors: {
        primaryButtonText: '#FFFFFF',
        brand: {
            ccpGray: '#2B2B29',
            // UPDATED 10/23/24
            primaryBlue: '#2a5ab3',
            primaryBlueHover: '#25509f',
            primaryBlueActive: '#21488f',
            primaryOrange: '#FF7B02',
            primaryGray: '#12151B',
            secondaryBlueActive: '#4955EB',
            secondaryOrange: '#FFA43C',
            secondaryGreen: '#66F28D',
            accentGreen: '#3ACC63',
            feltGreen1: '#51815B',
            feltGreen2: '#122816',
            gray70: '#05070A',
            gray65: '#0E1516',
            gray50: '#181B20',
            gray45: '#1F2127',
            gray40: '#22252B',
            gray30: '#2F333A',
            gray25: '#363B44',
            gray20: '#484E59',
            gray15: '#575E6C',
            gray10: '#8A8A8A',
            modalGray: '#121418',
            accentWhite: '#E8E8E8',
            textWhite: '#FFFFFF',
            progressGreen: '#53C473',
            progressOrange: '#FFB52D',
            progressRed: '#F30D0D',
            // LEGACY
            darkestGray: '#12151B',
            darkGray: '#1D1E21',
            lightGray: '#22252B',
            lightestGray: '#2F333A',
            mediumGray: '#181B20',
            mutedGray: '#484E59',
            silverGray: '#BDBDBD',
            darkBlueGray: '#25282E',
            darkerBlueGray: '#191B20',
            determinationGray: 'rgba(115, 115, 115, 0.2)',
            textPrimary: '#9795FF',
            chatGray: 'rgba(24, 27, 32, 1)',
            tealColor1: '#0BA1A8',
            lightBlue: '#6C84D9',
            white50: 'rgba(255, 255, 255, 0.5)',
            white70: 'rgba(255, 255, 255, 0.7)',
            white80: 'rgba(255, 255, 255, 0.8)',
            white90: 'rgba(255, 255, 255, 0.9)',
            winnerGreen: '#66F28D',
            vividGreen: 'rgba(102, 242, 141, 1)',
            vividOrange: 'rgba(255, 164, 60, 1)',
            cardDisplayBackground: '#05070A',
            black: '#000000',
        },
    },
});
