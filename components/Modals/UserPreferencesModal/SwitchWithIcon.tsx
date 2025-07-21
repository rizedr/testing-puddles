import React from 'react';
import { Switch, useColorModeValue, Box } from '@chakra-ui/react';

interface SwitchWithIconProps {
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  isDisabled?: boolean;
}

export const SwitchWithIcon: React.FC<SwitchWithIconProps> = ({
  isChecked,
  onChange,
  id,
  isDisabled,
}) => {
  // Chakra's default blue for switches
  // const blue = useColorModeValue('blue.500', 'blue.300');
  // const gray = useColorModeValue('gray.500', 'gray.300');
  return (
    <Box position="relative" display="inline-block">
      <Switch
        id={id}
        isChecked={isChecked}
        onChange={onChange}
        isDisabled={isDisabled}
        size="lg"
        sx={{
          // Make room for the icon
          '.chakra-switch__thumb': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      />
      {/* Removed icon overlay */}
    </Box>
  );
}; 