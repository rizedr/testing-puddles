'use client';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

import { theme } from '../styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { AuthModalProvider } from './Shared/AuthModalContext';

const queryClient = new QueryClient();

const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <ClerkProvider
                    publishableKey={
                        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
                    }
                >
                    <ConvexProviderWithClerk
                        client={convexClient}
                        useAuth={useAuth}
                    >
                        <AuthModalProvider>
                            {children}
                        </AuthModalProvider>
                    </ConvexProviderWithClerk>
                </ClerkProvider>
            </ChakraProvider>
        </QueryClientProvider>
    );
};

export default AppShell;
