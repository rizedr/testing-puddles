'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { client } from '../client/sdk.gen';
import { useMutation } from 'convex/react';
import { api } from '../../../packages/convex/convex/_generated/api';

export const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }

    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
        return 'https://api.ginzagaming.com';
    }
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
        const branchNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID;
        return `https://ginza-ginza-pr-${branchNumber}.up.railway.app`;
    }
    return 'http://localhost:8000';
};

export function FetchAuthWrapper({ children }: { children: React.ReactNode }) {
    const { getToken, isLoaded, isSignedIn, userId, sessionId } = useAuth();
    const { user } = useUser();
    const genUserForTesting = useMutation(api.users.genUserForTesting);

    if (isLoaded && isSignedIn && userId && sessionId) {
        const getAuth = async () => {
            const token = await getToken();
            return token;
        };
        client.setConfig({
            auth: getAuth,
            security: [
                {
                    in: 'header',
                    name: 'Authorization',
                    scheme: 'bearer',
                    type: 'http',
                },
            ],
            baseUrl: getBaseUrl(),
        });
        if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
            genUserForTesting({
                username: user?.username || 'test',
                imageUrl: user?.imageUrl || 'test',
                externalId: user?.id || 'test',
            });
        }
    } else {
        client.setConfig({
            baseUrl: getBaseUrl(),
        });
    }
    return <>{children}</>;
}
