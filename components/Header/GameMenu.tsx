import { Menu, MenuButton, IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import DynamicMenuList from './DynamicMenuList';

export const GameMenu = () => {
    return (
        <Menu closeOnSelect variant="gameMenu">
            <DynamicMenuList />
            <MenuButton
                style={{ width: '40px', height: '40px' }}
                as={IconButton}
                aria-label="Menu-Button"
                variant="hamburgerMenuButton"
                icon={
                    <HamburgerIcon color="brand.accentWhite" boxSize="20px" />
                }
                borderRadius="8px"
                backgroundColor="brand.gray65"
                border="1px solid"
                borderColor="brand.accentWhite"
                padding="0"
                _hover={{
                    backgroundColor: 'brand.darkBlueGray',
                    borderColor: 'brand.white80',
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                    '& > svg': { color: 'brand.white80' },
                }}
            />
        </Menu>
    );
};
