import { Button, Icon } from '@chakra-ui/react';
import LedgerTable from './LedgerTable';
import { DownloadIcon } from '@chakra-ui/icons';
import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import { useGameAllPlayers } from '../../hooks/useGamePlayers';
import { useQueries } from '@tanstack/react-query';
import { formatMicroDollarsWithCommas } from '../../utils/formatMoney';
import { GinzaSurface } from '../GinzaModal';
import { useConvex } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import useGameId from '../../hooks/useGameID';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';

interface LedgerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DownloadLedgerButton = () => {
    const gameId = useGameId();
    const { players } = useGameAllPlayers(gameId);
    const playerIds = players.map((player) => player.player_id);
    const convex = useConvex();
    const usersQueries = useQueries({
        queries: playerIds?.map((userId) => ({
            queryKey: ['user', userId],
            queryFn: () =>
                convex.query(api.tasks.getUserByUserId, {
                    userId: userId as Id<"users">,
                }),
        })),
    });

    const downloadCSV = () => {
        const headers = ['Player', 'Buy-In', 'Cashout', 'Stack', 'PnL'];
        const rows = players.map((player, idx) => [
            usersQueries[idx]?.data?.username,
            convertCurrencyToDisplay(BigInt(player.totalBuyIn)),
            convertCurrencyToDisplay(BigInt(player.totalCashout)),
            formatMicroDollarsWithCommas(player.currentStack),
            convertCurrencyToDisplay(BigInt(player.playerPnl)),
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.map((field) => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'ledger_' + gameId + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button
            variant="walletButton"
            onClick={downloadCSV}
            rightIcon={<Icon as={DownloadIcon} />}
        >
            Download Ledger
        </Button>
    );
};

export const LedgerModal: React.FC<LedgerModalProps> = ({
    isOpen,
    onClose,
}: LedgerModalProps) => {
    return (
        <GinzaSurface
            isOpen={isOpen}
            onClose={onClose}
            title="Session Ledger"
            content={<LedgerTable />}
            primaryButton={<DownloadLedgerButton />}
        />
    );
};

export default LedgerModal;
