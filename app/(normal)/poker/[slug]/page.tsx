'use client';

import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { LandscapeLayout } from '../../../../components/GamePage/Poker/LandscapeLayout';
import PortraitLayout from '../../../../components/GamePage/Poker/PortraitLayout';
import { GameShellWithErrorBoundary } from '../../../../components/GamePage/Shared/GameShell';
import useViewer from '../../../../components/hooks/useViewer';
import { Id } from '../../../../../../packages/convex/convex/_generated/dataModel';
import { Box } from '@chakra-ui/react';
import { playerAction } from '../../../../client';
import { Action, AffiliateReferral } from '../../../../client';
import { useQuery } from "convex/react";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { useUserStatus } from '../../../../components/hooks/useUserStatus';

const PokerGame = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const { isAuthenticated, user } = useViewer();
    const { isPlayer } = useUserStatus();
    const refId = searchParams?.get('ref');
    const gameId = params?.slug as string;

    const activeReferral = useQuery(api.referral.activeReferral, {
        referralId: user?.referralId as Id<'referral'>
    });

    useEffect(() => {
        if (isAuthenticated && refId) {
            playerAction({
                path: {
                    game_id: gameId,
                },
                body: {
                    action: Action.REGISTER_REFERRAL,
                    action_target: refId as Id<'users'>,
                },
            });
        }
    }, [refId, isAuthenticated, gameId]);

    useEffect(() => {
        if (isAuthenticated && activeReferral) {
            playerAction({
                path: {
                    game_id: gameId,
                },
                body: {
                    action: Action.REGISTER_AFFILIATE,
                    affiliate_referral: {
                        referral_id: activeReferral._id,
                        affiliate_id: activeReferral.affiliateUserId,
                        player_id: activeReferral.referredUserId,
                        affiliate_rate: activeReferral.rate,
                    } as AffiliateReferral
                },
            });
        }
    }, [isAuthenticated, activeReferral, gameId, isPlayer]);

    return (
        <Box bg="#0F1218" w="100%" h="100%">
            <GameShellWithErrorBoundary
                landscapeLayout={<LandscapeLayout />}
                portraitLayout={<PortraitLayout />}
            />
        </Box>
    );
};

export default PokerGame;
