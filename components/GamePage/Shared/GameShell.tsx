import React, { ReactNode } from 'react';
import { Button, Box, Text } from '@chakra-ui/react';
import SoundManager from '../../SoundManager';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    errorMessage: string;
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {}

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <Box
                    textAlign="center"
                    p={4}
                    height="100vh"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text fontSize="xl" mb={4}>
                        Oops! Something went wrong.
                    </Text>
                    <Text fontSize="md" mb={4} color="red.500">
                        Error: {this.state.errorMessage}
                    </Text>
                    <Button
                        variant="primary"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export const GameShellWithErrorBoundary = ({
    landscapeLayout,
    portraitLayout,
}: {
    landscapeLayout: ReactNode;
    portraitLayout: ReactNode;
}) => {
    return (
        <ErrorBoundary>
            <Box w="100%" h="100%" display="block">
                <Box
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                    h="100%"
                >
                    <Box
                        m="auto"
                        position="relative"
                        h={{ base: '100%', lg: '100%', xl: '100%' }}
                        w={{ base: 'auto', lg: '100%', xl: '100%' }}
                        fontSize={{ lg: 'md', xl: 'md' }}
                        aspectRatio={{ base: '9/19', lg: '14/9', xl: '16/9' }}
                    >
                        <Box
                            display={{ base: 'block', lg: 'none', xl: 'none' }}
                            h="100%"
                            w="100%"
                        >
                            {portraitLayout}
                        </Box>
                        <Box
                            display={{ base: 'none', lg: 'flex', xl: 'flex' }}
                            w="100%"
                            h="100%"
                        >
                            {landscapeLayout}
                        </Box>
                    </Box>
                    <SoundManager />
                </Box>
            </Box>
        </ErrorBoundary>
    );
};
