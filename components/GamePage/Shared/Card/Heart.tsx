import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

interface HeartProps extends IconProps {
    isFourColorDeck: boolean;
}

export const Heart = ({ isFourColorDeck, ...props }: HeartProps) => (
    <Icon viewBox="0 0 30 27" {...props}>
        <path
            d="M22.5 0C18.1667 0 16.1667 3.71625 15.1667 5.72503C15.1667 5.27299 12.1667 0 7.5 0C3.16667 0 0 3.31456 0 7.533C0 10.3955 1 12.2034 4.33333 16.1206C7.66667 20.0377 13.5 24.4067 13.9835 25.0094C14.4211 25.5549 15 26.3654 15.1667 26.6667L15.1752 26.6512C15.2964 26.4318 15.675 25.7463 16.3351 25.0094C16.875 24.4067 23.8333 18.2298 25.8333 16.1206C27.8333 14.0113 30 10.8476 30 7.533C30 3.16398 26.6667 0 22.5 0Z"
            fill={isFourColorDeck ? 'white' : '#C02F2F'}
        />
    </Icon>
);
