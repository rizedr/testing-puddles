import TopUpAmountStep from './TopUpAmountStep';
import { TopUpExceededStep } from './TopUpExceededStep';
import { formatMicroDollarsWithCommas } from '../../utils/formatMoney';
import useGameData from '../../hooks/useGameData';
import { Player } from '../../../client';
import { GinzaSurface } from '../GinzaModal';
import useViewer from '../../hooks/useViewer';
import { AlreadyPendingTopUp } from './AlreadyPendingTopUp';

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
    const { userId } = useViewer();
    const { gameSettings, players, topUps } = useGameData();
    const topUp = topUps.find((topUp) => topUp.player_id === userId);

    const maxBuyIn = gameSettings?.max_buy_in;
    const currPlayer = players.find((p: Player) => p?.player_id === userId);
    const currStackSize = currPlayer?.amount || 0;
    const maxTopUp = parseFloat(
        (Math.max(0, maxBuyIn - currStackSize) / 1e6).toFixed(2),
    );
    const isLimitExceeded = currStackSize >= maxBuyIn;
    const isPendingTopUp = topUp !== undefined;
    let modalContent;
    if (isLimitExceeded) {
        modalContent = <TopUpExceededStep />;
    } else if (isPendingTopUp) {
        modalContent = <AlreadyPendingTopUp />;
    } else {
        modalContent = (
            <TopUpAmountStep maxTopUp={maxTopUp} onClose={onClose} />
        );
    }

    return (
        <GinzaSurface
            isOpen={isOpen}
            onClose={onClose}
            title="Top Up"
            content={modalContent}
        />
    );
};

export default TopUpModal;
