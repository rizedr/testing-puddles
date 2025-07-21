import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

interface DiamondProps extends IconProps {
    isFourColorDeck: boolean;
}

export const Diamond = ({ isFourColorDeck, ...props }: DiamondProps) => (
    <Icon viewBox="0 0 26 33" {...props}>
        <path
            d="M0 16.5C0 16.5 4.41146 12.8287 7.21875 9.075C10.026 5.32125 12.8333 0 12.8333 0C12.8333 0 15.6406 5.3625 18.4479 9.075C21.2552 12.7875 25.6667 16.5 25.6667 16.5C25.6667 16.5 22.0573 19.8 18.849 23.925C15.6406 28.05 12.8333 33 12.8333 33C12.8333 33 10.026 28.325 6.81771 23.925C3.60938 19.525 0 16.5 0 16.5Z"
            fill={isFourColorDeck ? 'white' : '#C02F2F'}
        />
    </Icon>
);
