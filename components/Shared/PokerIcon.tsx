import { Icon, IconProps } from '@chakra-ui/react';

interface PokerIconProps extends IconProps {
    height?: string;
    width?: string;
}

export const PokerIcon = ({
    height = '1.18rem',
    width = '1.18rem',
    ...props
}: PokerIconProps) => (
    <Icon viewBox="0 0 46.9 46.9" height={height} width={width} {...props}>
        <defs>
            <style>{`
                .cls-1 { fill: none; strokeWidth: 4px; }
                .cls-1, .cls-2, .cls-3 { stroke: #13161c; strokeMiterlimit: 10; }
                .cls-2 { strokeWidth: 1.5px; }
                .cls-2, .cls-4, .cls-3 { fill: #13161c; }
                .cls-5 { fill: #e8e8e8; }
            `}</style>
        </defs>
        <circle className="cls-5" cx="23.5" cy="23.5" r="23.5" />
        <g id="dots">
            <circle className="cls-2" cx="18.6" cy="3.5" r="1.2" />
            <circle className="cls-2" cx="38.7" cy="9.8" r="1.2" />
            <circle className="cls-2" cx="43.5" cy="28.3" r="1.2" />
            <circle className="cls-2" cx="28.5" cy="43.7" r="1.2" />
            <circle className="cls-2" cx="8.5" cy="37.9" r="1.2" />
            <circle className="cls-2" cx="3.1" cy="19.9" r="1.2" />
            <g id="Rects">
                <path
                    className="cls-3"
                    d="M28.2,1.9s-1.2,4-1,4.2,1.1.3,2.6.9c1.6.6,2.3,1.2,2.6,1.2s2.2-3.7,2.2-3.7c0,0-1.2-.8-2.9-1.6-1.9-.8-3.5-1-3.5-1h0Z"
                />
                <path
                    className="cls-3"
                    d="M43.3,14.2s-3.7,1.4-3.8,1.7.5,1.1.9,2.6c.5,1.6.4,2.6.6,2.8.2.2,4.2-.5,4.2-.5,0,0,0-1.5-.5-3.3-.5-2-1.4-3.3-1.4-3.3h0Z"
                />
                <path
                    className="cls-3"
                    d="M41.8,35.7s-3.3-2.5-3.5-2.4-.7,1-1.8,2.2c-1.1,1.3-2,1.7-2,2s2.7,3.3,2.7,3.3c0,0,1.2-.8,2.5-2.2,1.4-1.5,2.1-2.9,2.1-2.9h0Z"
                />
                <path
                    className="cls-3"
                    d="M18.8,44.8s1.1-3.8,1-4.1-1.1-.3-2.7-.8c-1.6-.6-2.3-1.2-2.6-1.2s-2.1,3.7-2.1,3.7c0,0,1.2.8,2.9,1.5,1.9.8,3.5.9,3.5.9h0Z"
                />
                <path
                    className="cls-3"
                    d="M3.6,33s3.7-1.5,3.8-1.8-.5-1.1-.9-2.6c-.5-1.6-.4-2.5-.7-2.8-.2-.1-4.2.6-4.2.6,0,0,.1,1.5.6,3.3.5,2,1.4,3.3,1.4,3.3h0Z"
                />
                <path
                    className="cls-3"
                    d="M5,11.4s3.3,2.5,3.5,2.4.7-1,1.8-2.2c1.1-1.3,2-1.7,2-2s-2.7-3.3-2.7-3.3c0,0-1.2.8-2.5,2.2-1.4,1.5-2.1,2.9-2.1,2.9h0Z"
                />
            </g>
        </g>
        <circle id="circle" className="cls-1" cx="23.5" cy="23.5" r="15.5" />
        <polygon
            className="cls-4"
            points="23.5 12.9 25.9 20.4 33.8 20.4 27.4 25.1 29.9 32.6 23.5 27.9 17 32.6 19.5 25.1 13.1 20.4 21 20.4 23.5 12.9"
        />
    </Icon>
);
