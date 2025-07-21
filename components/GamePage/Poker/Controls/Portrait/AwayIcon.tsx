import { Icon, IconProps } from '@chakra-ui/react';

export const AwayIcon = ({
    width = '19',
    height = '22',
    ...props
}: IconProps) => (
    <Icon viewBox="0 0 19 22" height={height} width={width} {...props}>
        <rect x="2.5" y="3.5" width="3.5" height="15" rx="1" />
        <rect x="13" y="3.5" width="3.5" height="15" rx="1" />
    </Icon>
);
