'use client';

import { Box, ToastId, useToast } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef, useState } from 'react';

import { Hero } from '../../components/HomePage/Hero/Hero';
import useViewer from '../../components/hooks/useViewer';
import { api } from '../../../../packages/convex/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { CHAIN_INFO } from '../../../../packages/convex/convex/constants';
import { formatMicroDollars } from '../../components/utils/formatMoney';

const REFERRAL_WINDOW_MS = 300000;

export const OpacityCover = ({ 
  opacity, 
  blurAmount = 0 
}: { 
  opacity: number; 
  blurAmount?: number;
}) => {
    return (
        <Box
            w="100%"
            h="100%"
            bg={`rgba(0, 0, 0, ${opacity})`}
            position="absolute"
            top="0"
            left="0"
            right="0"
            backdropFilter={blurAmount > 0 ? `blur(${blurAmount}px)` : "none"}
            pointerEvents="none"
        />
    );
};

const StartPageContent: NextPage = () => {
    const searchParams = useSearchParams();
    const { user, isAuthenticated } = useViewer();
    const toast = useToast();
    const processReferral = useMutation(api.users.processReferral);
    const affiliateCode = typeof window !== 'undefined' ? localStorage.getItem('affiliate') : null;
    
    const affiliateUser = useQuery(
        api.users.getAffiliateUser, 
        affiliateCode ? { affiliateCode } : 'skip'
    );

    useEffect(() => {
        const affiliateCodeFromURL = searchParams?.get('affiliate');
        if (affiliateCodeFromURL) {
            localStorage.setItem('affiliate', affiliateCodeFromURL);
        }
    }, [searchParams]);

    useEffect(() => {
        if (isAuthenticated && user && affiliateCode && affiliateUser) {
            const isNewUser = user._creationTime && 
                (Date.now() - new Date(user._creationTime).getTime() < REFERRAL_WINDOW_MS);
            
            if (isNewUser && !user.referralId) {
                const processReferralAction = async () => {
                    try {
                        await processReferral({
                            userId: user._id,
                            affiliateCode: affiliateCode
                        });
                        
                        toast({
                            title: 'Referral Successfully Processed',
                            description: `You were referred by ${affiliateUser.username}`,
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                        
                        localStorage.removeItem('affiliate');
                    } catch (error: any) {
                        console.error('Error processing referral:', error);
                        
                        if (process.env.NODE_ENV === 'development') {
                            toast({
                                title: 'Referral Error',
                                description: error.message || 'Could not process referral',
                                status: 'error',
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                        
                        localStorage.removeItem('affiliate');
                    }
                };
                
                processReferralAction();
            }
        }
    }, [isAuthenticated, user, processReferral, toast, affiliateCode, affiliateUser]);

    return (
        <Box
            backgroundImage={`url('/home_bg4.webp')`}
            backgroundSize="cover"
            backgroundPosition="bottom"
            h="100vh"
            overflowY="auto"
        >
            <OpacityCover opacity={0.4} blurAmount={2} />
            <Hero />
        </Box>
    );
};

const StartPage: NextPage = () => {
    return (
        <Suspense fallback={
            <Box
                backgroundImage={`url('/home_bg4.webp')`}
                backgroundSize="cover"
                backgroundPosition="bottom"
                h="100vh"
                overflowY="auto"
            >
                <OpacityCover opacity={0.4} blurAmount={2} />
                {/* You could add a loading indicator here if desired */}
            </Box>
        }>
            <StartPageContent />
        </Suspense>
    );
};

export default StartPage;
