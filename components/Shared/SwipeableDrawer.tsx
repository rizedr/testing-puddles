import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Spacer,
    Text,
    VStack,
} from '@chakra-ui/react';

import { motion, useDragControls, useMotionValue } from 'framer-motion';
import React from 'react';

export const SwipeableDrawer = ({
    isOpen,
    onClose,
    title,
    body,
    primaryButton,
    secondaryButton,
    blockScrollOnMount = false,
    variant,
    height = 'auto',
    isLoading = false,
    maxHeight = '70vh',
}: {
    title: string;
    body: React.ReactNode;
    primaryButton?: React.ReactNode;
    secondaryButton?: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    blockScrollOnMount?: boolean;
    variant?: string;
    height?: string;
    isLoading?: boolean;
    maxHeight?: string;
}) => {
    const btnRef = React.useRef<HTMLButtonElement>(null);
    const controls = useDragControls();
    const y = useMotionValue(0);

    const handleDragEnd = (event: any, info: any) => {
        if (!isLoading && info.offset.y > 100) {
            onClose();
        } else {
            y.set(0);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    const drawerVariants = {
        hidden: { y: '100%' },
        visible: {
            y: 0,
            transition: {
                type: 'tween',
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.4,
            },
        },
        exit: {
            y: '100%',
            transition: {
                type: 'tween',
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.3,
            },
        },
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="bottom"
            onClose={handleClose}
            finalFocusRef={btnRef as any}
            blockScrollOnMount={blockScrollOnMount}
            variant={variant}
        >
            <DrawerOverlay />
            <DrawerContent
                as={motion.div}
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                drag={isLoading ? false : 'y'}
                dragControls={controls}
                onDragEnd={handleDragEnd}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                style={{ y }}
                maxW="100%"
                borderTopRadius="32px"
                height={height}
                maxHeight={maxHeight}
                bg="brand.modalGray"
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                display="flex"
                flexDirection="column"
                minH="60vh"
            >
                <DrawerHeader
                    onPointerDown={(e) => !isLoading && controls.start(e)}
                    style={{ touchAction: 'none', position: 'relative' }}
                    cursor={isLoading ? 'default' : 'grab'}
                    borderTop="1px solid rgba(255,255,255,0.25)"
                    borderTopRadius="32px"
                    // borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                >
                    <HStack justify="center">
                        <VStack align="center" justify="center">
                            <Button
                                h="0.5rem"
                                w="3.5rem"
                                borderRadius="full"
                                bg="brand.modalGray"
                            />
                            <Text variant="modalHeader">{title}</Text>
                        </VStack>
                        <Button
                            onClick={handleClose}
                            position="absolute"
                            top="1rem"
                            right="1rem"
                            variant="ghost"
                            color="#BDBDBD"
                            _hover={{
                                bg: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.25rem',
                                color: 'white',
                            }}
                            size="md"
                            borderRadius="0.25rem"
                        >
                            X
                        </Button>
                    </HStack>
                </DrawerHeader>
                <DrawerBody>
                    <Box overflowY="auto">{body}</Box>
                </DrawerBody>
                {primaryButton || secondaryButton ? (
                    <HStack
                        h="100%"
                        spacing="16px"
                        py="1.5rem"
                        px="2rem"
                        borderTop="1px solid rgba(255, 255, 255, 0.1)"
                    >
                        <Spacer />
                        {secondaryButton}
                        {primaryButton}
                    </HStack>
                ) : null}
            </DrawerContent>
        </Drawer>
    );
};

export default SwipeableDrawer;
