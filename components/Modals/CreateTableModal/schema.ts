import { object, number, boolean, mixed } from 'yup';
import { GameMode } from '../../../client/types.gen';

export const SHOWDOWN_OPTIONS = [
    { label: 'Fast (6s)', value: 6 },
    { label: 'Normal (9s)', value: 9 },
    { label: 'Slow (12s)', value: 12 },
] as const;

export const TURN_TIME_OPTIONS = [
    { label: '15s', value: 15 },
    { label: '20s', value: 20 },
    { label: '25s', value: 25 },
    { label: '30s', value: 30 },
    { label: '35s', value: 35 },
    { label: '40s', value: 40 },
    { label: '45s', value: 45 },
] as const;

export const EXTRA_TIMER_OPTIONS = [
    { label: '10s', value: 10 },
    { label: '20s', value: 20 },
    { label: '30s', value: 30 },
] as const;

export const STAKE_LEVELS: { label: string; value: StakeLevel }[] = [
    { label: 'Micro', value: 'micro' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
];

export const MIN_BUY_IN = 10;
export const MAX_BUY_IN = 500;
export const NO_MAX_MAXIMUM = 10000;

export type StakeLevel = 'micro' | 'low' | 'medium' | 'high';

export interface Blind {
    sb: number;
    bb: number;
}

export const STAKE_SETTINGS: Record<StakeLevel, Blind[]> = {
    micro: [
        { sb: 0.01, bb: 0.02 },
        { sb: 0.02, bb: 0.04 },
        { sb: 0.05, bb: 0.1 },
        { sb: 0.1, bb: 0.2 },
        { sb: 0.25, bb: 0.5 },
        { sb: 0.3, bb: 0.6 },
        { sb: 0.5, bb: 1 },
        { sb: 0.8, bb: 1.6 },
        { sb: 1, bb: 2 },
        { sb: 1.2, bb: 2.4 },
    ],
    low: [
        { sb: 1, bb: 2 },
        { sb: 2, bb: 4 },
        { sb: 2.5, bb: 5 },
        { sb: 3, bb: 6 },
        { sb: 5, bb: 10 },
        { sb: 7, bb: 14 },
        { sb: 8, bb: 16 },
        { sb: 9, bb: 18 },
        { sb: 10, bb: 20 },
        { sb: 15, bb: 30 },
    ],
    medium: [
        { sb: 10, bb: 20 },
        { sb: 15, bb: 30 },
        { sb: 25, bb: 50 },
        { sb: 30, bb: 60 },
        { sb: 50, bb: 100 },
        { sb: 75, bb: 150 },
        { sb: 100, bb: 200 },
        { sb: 125, bb: 250 },
        { sb: 150, bb: 300 },
        { sb: 190, bb: 380 },
    ],
    high: [
        { sb: 100, bb: 200 },
        { sb: 125, bb: 250 },
        { sb: 150, bb: 300 },
        { sb: 200, bb: 400 },
        { sb: 300, bb: 600 },
        { sb: 500, bb: 1000 },
        { sb: 600, bb: 1200 },
        { sb: 700, bb: 1400 },
        { sb: 800, bb: 1600 },
        { sb: 1000, bb: 2000 },
    ],
};

export interface CreateTableFormValues {
    stakeLevel: StakeLevel;
    blindIndex: number;
    minBuyIn: number;
    maxBuyIn: number;
    noMaxBuyIn: boolean;
    rabbitHunting: boolean;
    showdownTimer: 6 | 9 | 12;
    turnTime: 15 | 20 | 25 | 30 | 35 | 40 | 45;
    extraTime: 10 | 20 | 30;
    ante: number;
    bombPotBB: number;
    bombPotFrequency: number;
}

export const createTableSchema = object<CreateTableFormValues>({
    stakeLevel: mixed<StakeLevel>()
        .oneOf(['micro', 'low', 'medium', 'high'])
        .required(),
    blindIndex: number()
        .min(0)
        .test('max-blinds', 'Invalid blind index', (value, ctx) => {
            const stakeLevel = ctx.parent.stakeLevel as StakeLevel;
            return (
                value !== undefined &&
                value <= STAKE_SETTINGS[stakeLevel].length - 1
            );
        })
        .required(),
    minBuyIn: number()
        .min(MIN_BUY_IN)
        .max(MAX_BUY_IN)
        .test('min-lte-max', 'Min buy-in must be <= max buy-in', function(value) {
            const { maxBuyIn } = this.parent;
            if (typeof value !== 'number' || typeof maxBuyIn !== 'number') return true;
            return value <= maxBuyIn;
        })
        .required(),
    maxBuyIn: number()
        .when('noMaxBuyIn', {
            is: true,
            then: () => number().equals([NO_MAX_MAXIMUM]),
            otherwise: () => number()
                .min(MIN_BUY_IN)
                .max(MAX_BUY_IN)
                .test('max-gte-min', 'Max buy-in must be >= min buy-in', function(value) {
                    const { minBuyIn } = this.parent;
                    if (typeof value !== 'number' || typeof minBuyIn !== 'number') return true;
                    return value >= minBuyIn;
                }),
        })
        .required(),
    noMaxBuyIn: boolean().required(),
    rabbitHunting: boolean().required(),
    showdownTimer: number().oneOf([6, 9, 12]).required(),
    turnTime: number().oneOf([15, 20, 25, 30, 35, 40, 45]).required(),
    extraTime: number().oneOf([10, 20, 30]).required(),
    ante: number().min(0).max(2).required(),
    bombPotBB: number()
        .min(0)
        .test('bomb-pot-validation', 'Requires both ante and frequency to activate bomb pots', function(value) {
            const { bombPotFrequency } = this.parent;
            const bbValue = value ?? 0;
            const freqValue = bombPotFrequency ?? 0;
            if ((bbValue === 0 && freqValue === 0) || (bbValue > 0 && freqValue > 0)) {
                return true;
            }
            return false;
        })
        .required(),
    bombPotFrequency: number()
        .min(0)
        .test('bomb-pot-validation', 'Requires both ante and frequency to activate bomb pots', function(value) {
            const { bombPotBB } = this.parent;
            const freqValue = value ?? 0;
            const bbValue = bombPotBB ?? 0;
            if ((freqValue === 0 && bbValue === 0) || (freqValue > 0 && bbValue > 0)) {
                return true;
            }
            return false;
        })
        .required(),
});

export const defaultValues: CreateTableFormValues = {
    stakeLevel: 'micro',
    blindIndex: 0,
    minBuyIn: 35,
    maxBuyIn: MAX_BUY_IN,
    noMaxBuyIn: false,
    rabbitHunting: true,
    showdownTimer: 6,
    turnTime: 20,
    extraTime: 10,
    ante: 0,
    bombPotBB: 0,
    bombPotFrequency: 0,
};
