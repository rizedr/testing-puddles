export type PlayerPosition =
    | 'topRight'
    | 'upperRight'
    | 'right'
    | 'bottomRight'
    | 'bottomLeft'
    | 'bottom'
    | 'left'
    | 'upperLeft'
    | 'topLeft';

export const positions: Record<number, PlayerPosition> = {
    0: 'topRight',
    1: 'upperRight',
    2: 'right',
    3: 'bottomRight',
    4: 'bottom',
    5: 'bottomLeft',
    6: 'left',
    7: 'upperLeft',
    8: 'topLeft',
};

export const getPosition = (playerPosition: number): PlayerPosition => {
    return positions[playerPosition] || 'bottom';
};
