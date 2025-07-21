import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';

export const CardBack = (props: ImageProps) => (
    <Image
        src="/Cardback.webp" // Updated path to the image in the public directory
        alt="Card Back"
        {...props}
        userSelect="none"
        draggable={false}
    />
);

export default CardBack;
