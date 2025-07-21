import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const solid = defineStyle({
    background: 'brand.primaryBlue',
});

const baseStyle = defineStyle({
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '0.75rem',
    fontWeight: '600',
    lineHeight: 'normal',
    color: 'brand.white80',
    _disabled: {
        opacity: '0.5',
    },
});

const test = defineStyle({
    background: 'linear-gradient(138.64deg, #B37FEB 0%, #22075E 100%)',
});

const primary = defineStyle({
    background: 'brand.primaryBlue',
    _hover: {
        background: 'brand.primaryBlueHover',
    },
    _active: {
        bg: 'brand.primaryBlueActive',
    },
    fontSize: '1rem',
    boxShadow: '2px 2px 3px 0px rgba(0, 0, 0, 0.50)',
});

const callButton = defineStyle({
    background: '#4A9A6D',
    borderRadius: '0.75rem',
    _hover: {
        background: '#4A9A6D',
        transform: 'translateY(2px)',
    },
    _active: {
        background: '#4A9A6D',
        transform: 'translateY(4px)',
    },
    _disabled: {
        background: '#4A9A6D',
        opacity: '1.0',
        pointerEvents: 'none',
    },
});

const foldButton = defineStyle({
    background: '#D96963',
    borderRadius: '0.75rem',
    _hover: {
        background: '#D96963',
        transform: 'translateY(2px)',
    },
    _active: {
        background: '#D96963',
        transform: 'translateY(4px)',
    },
    _disabled: {
        background: '#D96963',
        opacity: '1.0',
        pointerEvents: 'none',
    },
});

const raiseButton = defineStyle({
    background: '#3E84D1',
    color: 'white',
    // padding: '8px 16px',
    borderRadius: '0.75rem',
    _hover: {
        background: '#3E84D1',
        transform: 'translateY(2px)',
    },
    _active: {
        background: '#3E84D1',
        transform: 'translateY(4px)',
    },
    _disabled: {
        background: '#3E84D1',
        opacity: '1.0',
        pointerEvents: 'none',
    },
});

const extraTimeButton = defineStyle({
    background: 'brand.gray10',
    borderRadius: '0.75rem',
    _hover: {
        background: 'brand.gray10',
        transform: 'translateY(2px)',
    },
    _active: {
        background: 'brand.gray10',
        transform: 'translateY(4px)',
    },
});

const secondary = defineStyle({
    background: 'transparent',
    boxShadow: 'inset 0px 0px 0px 1px rgba(255, 255, 255, 0.50)',
    _hover: {
        bg: 'brand.gray30',
    },
    boxSizing: 'border-box',
    borderRadius: '0.25rem',
});

const primaryDark = defineStyle({
    background: 'brand.gray15',
    borderRadius: '0.75rem',
    _hover: {
        background: 'brand.gray15',
        transform: 'translateY(2px)',
    },
    _active: {
        background: 'brand.gray15',
        transform: 'translateY(4px)',
    },
    _disabled: {
        background: 'brand.gray30',
        color: 'brand.gray10',
        opacity: '1',
        pointerEvents: 'none',
    },
});

const tableSortButton = defineStyle({
    border: '1px solid',
    borderColor: 'brand.gray30',
    borderRadius: '0.125rem',
    padding: '0px 0.375rem',
    height: '1.75rem',
    width: '13.125rem',
    background: 'brand.gray30',
});

const hamburgerMenuButton = defineStyle({
    borderRadius: '100%',
    h: '3rem',
    w: '3rem',
});

const formButton = defineStyle({
    alignItems: 'center',
    background: 'brand.gray30',
    border: 'none',
    borderRadius: '0.125rem',
    color: 'white',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    minWidth: '6.125rem',
    maxHeight: '2rem',
    _hover: {
        bg: 'brand.gray20',
    },
});

const gameOptionButton = defineStyle({
    alignItems: 'center',
    background: 'purple.900',
    border: '0.125rem solid',
    borderColor: 'transparent',
    borderRadius: '12px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
    padding: '1.25rem .75rem',
    width: '5rem',
    _hover: {
        bg: 'purple.700',
    },
    _active: {
        background: 'purple.700',
    },
});

const commonTimerButton = {
    borderRadius: '0.25rem',
    background: 'brand.gray30',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid',
    borderColor: 'transparent',
    w: '100%',
    color: 'brand.textWhite',
    textAlign: 'center',
    fontSize: '0.75rem',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: '0.75rem',
    _hover: {
        borderColor: 'brand.primaryBlue',
    },
    _active: {
        backgroundColor: 'brand.primaryBlue',
    },
};

const timerButton = defineStyle({
    ...commonTimerButton,
});

const menuButton = defineStyle({
    background: 'brand.gray30',
    border: '3px solid transparent',
    borderRadius: '0.25rem',
    color: 'brand.textWhite',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    _hover: {
        border: '3px solid',
        borderColor: 'brand.primaryBlue',
    },
    _active: {
        backgroundColor: 'brand.primaryBlue',
    },
});

const chatButton = defineStyle({
    background: 'brand.gray30',
    color: 'white',
    minHeight: '1.5625rem',
    height: '1.5625rem',
    minWidth: '1.5625rem',
    width: '1.5625rem',
    p: '0px',
    _hover: {
        background: 'brand.gray40',
    },
});

const shareGameButton = defineStyle({
    w: '40px',
    h: '40px',
    p: 2,
    background: '#12151B',
    borderRadius: 'full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    _hover: {
        border: '1px solid',
        borderColor: 'brand.primaryBlue',
        background: 'brand.primaryBlue',
        '& > *': {
            color: 'brand.accentWhite',
        },
    },
});

const landingPageButton = defineStyle({

    background: 'linear-gradient(353.96deg, #B37FEB -80.9%, rgba(210, 174, 245, 0) 10%, #EFDBFF 130%), #531DAB',
    backgroundBlendMode: 'soft-light, normal',
    boxShadow: '0px 2px 2px #000000, 0px 0px 8px rgba(146, 84, 222, 0.32)',
    borderRadius: '12px',
    fontWeight: '700',
    h: '2.85rem',
    fontSize: '0.95rem',
    color: 'brand.white80',
    _hover: {
        bg: 'linear-gradient(365.96deg, #B37FEB -1.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #531DAB',
        boxShadow: '0px 2px 2px #000000, 0px 0px 12px rgba(146, 84, 222, 0.32)',
    },
    _active: {
        borderImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2), #EFDBFF) 2',

        bg: 'linear-gradient(365.96deg, #B37FEB -1.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #531DAB',
    },
});

    const walletButton = defineStyle({
        h: '2.5rem',
        background: 'linear-gradient(351.96deg, #B37FEB -20.9%, rgba(210, 174, 245, 0) 20%, #EFDBFF 96%), #4B2B82',
        backgroundBlendMode: 'soft-light, normal',
        // boxShadow: '0px 2px 2px #000000, 0px 0px 8px rgba(146, 84, 222, 0.82)',
        fontWeight: '700',
        fontSize: '0.95rem',
        color: 'brand.white80',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        _hover: {
            bg: 'linear-gradient(165.96deg, #B37FEB 30.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #4B2B82',
            boxShadow: '0px 2px 2px #000000, 0px 0px 8px rgba(146, 84, 222, 0.32)',
        },
        _active: {
            bg: 'linear-gradient(265.96deg, #B37FEB 30.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #4B2B82',
            boxShadow: '0px 2px 2px #000000, 0px 0px 12px rgba(146, 84, 222, 0.32)',
        },
        _disabled: {
            color: 'brand.gray10',
            opacity: '1',
            pointerEvents: 'none',
        },
});

const secondaryTest = defineStyle({
    background: "linear-gradient(30deg, #20114A, #070310)",
    backgroundBlendMode: 'soft-light, normal',
    // boxShadow: '0px 2px 2px #000000, 0px 0px 8px rgba(146, 84, 222, 0.82)',
    fontWeight: '700',
    border: "1px solid",
    borderColor: "rgba(162, 121, 220, 1.0)",
    fontSize: '0.95rem',
    color: 'brand.white80',

    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    _hover: {
        bg: 'linear-gradient(165.96deg, #B37FEB 30.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #4B2B82',
        boxShadow: '0px 2px 2px #000000, 0px 0px 8px rgba(146, 84, 222, 0.32)',
    },
    _active: {
        bg: 'linear-gradient(265.96deg, #B37FEB 30.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #4B2B82',
        boxShadow: '0px 2px 2px #000000, 0px 0px 12px rgba(146, 84, 222, 0.32)',
    },
});

const rewardsActiveButton = defineStyle({
    h: '2.5rem',
    background: 'linear-gradient(351.96deg, #B37FEB -20.9%, rgba(210, 174, 245, 0) 20%, #EFDBFF 96%), #4B2B82',
    backgroundBlendMode: 'soft-light, normal',
    fontWeight: '700',
    fontSize: '0.95rem',
    color: 'brand.white80',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    _hover: {
        // No hover effect - keep the same background
        background: 'linear-gradient(351.96deg, #B37FEB -20.9%, rgba(210, 174, 245, 0) 20%, #EFDBFF 96%), #4B2B82',
    },
    _active: {
        bg: 'linear-gradient(265.96deg, #B37FEB 30.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #4B2B82',
        boxShadow: '0px 2px 2px #000000, 0px 0px 12px rgba(146, 84, 222, 0.32)',
    },
    _disabled: {
        color: 'brand.gray10',
        opacity: '1',
        pointerEvents: 'none',
    },
});

const rewardsInactiveButton = defineStyle({
    background: "linear-gradient(30deg, #20114A, #070310)",
    backgroundBlendMode: 'soft-light, normal',
    fontWeight: '700',
    border: "1px solid",
    borderColor: "rgba(162, 121, 220, 1.0)",
    fontSize: '0.95rem',
    color: 'brand.white80',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    _hover: {
        // Use the non-hovered background from walletButton
        background: 'linear-gradient(351.96deg, #B37FEB -20.9%, rgba(210, 174, 245, 0) 20%, #EFDBFF 96%), #4B2B82',
    },
    _active: {
        bg: 'linear-gradient(265.96deg, #B37FEB 30.9%, rgba(210, 174, 245, 0) 100%, #EFDBFF 30%), #4B2B82',
        boxShadow: '0px 2px 2px #000000, 0px 0px 12px rgba(146, 84, 222, 0.32)',
    },
});

"linear-gradient(30deg, #20114A, #070310)"

export const Button = defineStyleConfig({
    baseStyle,
    variants: {
        chatButton,
        formButton,
        gameOptionButton,
        hamburgerMenuButton,
        menuButton,
        primary,
        callButton,
        foldButton,
        raiseButton,
        extraTimeButton,
        primaryDark,
        secondary,
        solid,
        tableSortButton,
        timerButton,
        shareGameButton,
        landingPageButton,
        walletButton,
        secondaryTest,
        rewardsActiveButton,
        rewardsInactiveButton
    },
});

export default Button;
