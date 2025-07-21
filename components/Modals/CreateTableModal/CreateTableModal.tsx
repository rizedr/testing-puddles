import { Button } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { GameOptions } from './GameOptions';
import { GameMode } from '../../../client/types.gen';
import { useRouter } from 'next/navigation';
import { GinzaSurface } from '../GinzaModal';
import {
    STAKE_SETTINGS,
    CreateTableFormValues,
    defaultValues,
    createTableSchema,
} from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { toMicroDollars } from '../../utils/formatMoney';
import { useMutation } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';

interface CreateTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameMode: GameMode;
}

export const CreateTableModal = ({
    isOpen,
    onClose,
    gameMode,
}: CreateTableModalProps) => {
    const methods = useForm<CreateTableFormValues>({
        resolver: yupResolver(createTableSchema) as any,
        defaultValues: {
            ...defaultValues,
        },
    });
    const router = useRouter();
    const createGameMutation = useMutation(api.tasks.createGame);

    if (!isOpen) return null;

    const handleCreateTable = async (data: CreateTableFormValues) => {
        const {
            stakeLevel,
            blindIndex,
            minBuyIn,
            maxBuyIn,
            rabbitHunting,
            showdownTimer,
            turnTime,
            extraTime,
            ante,
            bombPotBB,
            bombPotFrequency,
        } = data;
        const { sb: smallBlind, bb: bigBlind } =
            STAKE_SETTINGS[stakeLevel][blindIndex];
        try {
            const gameId = await createGameMutation({
                gameSettings: {
                    rabbit_hunt: rabbitHunting,
                    showdown_time: showdownTimer,
                    turn_time: turnTime,
                    extra_time: extraTime,
                    small_blind_value: toMicroDollars(smallBlind),
                    big_blind_value: toMicroDollars(bigBlind),
                    min_buy_in: toMicroDollars(minBuyIn * bigBlind),
                    max_buy_in: toMicroDollars(maxBuyIn * bigBlind),
                    ante_value: toMicroDollars(ante * bigBlind),
                    game_mode: gameMode,
                    bomb_pot_bb: bombPotBB,
                    bomb_pot_frequency: bombPotFrequency,
                },
            });
            router.push(`/poker/${gameId}`);
        } catch (err) {
            console.error('Failed to create game:', err);
        }
    };

    return (
        <FormProvider {...methods}>
            <GinzaSurface
                isOpen={isOpen}
                onClose={onClose}
                title={`Create ${GameMode[gameMode]} Table`}
                content={<GameOptions />}
                primaryButton={
                    <Button
                        variant="walletButton"
                        onClick={methods.handleSubmit(handleCreateTable)}
                    >
                        Create Table
                    </Button>
                    // <Button variant="walletButton" disabled>
                    //     Maintenance
                    // </Button>
                }
                secondaryButton={
                    <Button variant="secondaryTest" onClick={onClose}>
                        Cancel
                    </Button>
                }
            />
        </FormProvider>
    );
};
