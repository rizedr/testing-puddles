import { Icon, IconProps } from '@chakra-ui/react';

interface ShareIconProps extends IconProps {
    height?: string;
    width?: string;
}

export const ShareIcon = ({
    height = '17',
    width = '15',
    ...props
}: ShareIconProps) => {
    return (
        <Icon width={width} height={height} viewBox="0 0 17 15" {...props}>
            <path
                d="M16.5 7.05523L10.2778 0.833008V4.38856C4.05556 5.27745 1.38889 9.7219 0.5 14.1663C2.72222 11.0552 5.83333 9.63301 10.2778 9.63301V13.2775L16.5 7.05523Z"
                fill="#E8E8E8"
            />
        </Icon>
    );
};
