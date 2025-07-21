import { useQuery } from "convex/react";
import { useRef, useEffect } from "react";
import { api } from "../../../../packages/convex/convex/_generated/api";
import { formatMicroDollars } from "../utils/formatMoney";
import { useToast } from "@chakra-ui/react";

const useDepositToast = () => {
    const toast = useToast();
    const latestDeposit = useQuery(
        api.deposits.getLatestDeposit
    );

    const prevDepositRef = useRef<any>(null);
    const isInitializedRef = useRef(false);

    // Initialize the ref with the current deposit to prevent showing toast on refresh
    useEffect(() => {
        if (latestDeposit && !isInitializedRef.current) {
            prevDepositRef.current = latestDeposit;
            isInitializedRef.current = true;
        }
    }, [latestDeposit]);

    useEffect(() => {
        if (latestDeposit && latestDeposit.timestamp && isInitializedRef.current) {
            const isNewDeposit = prevDepositRef.current === null || 
                prevDepositRef.current.transactionHash !== latestDeposit.transactionHash;
            
            if (isNewDeposit) {
                const now = Date.now();
                const timeSinceLastDeposit = now - latestDeposit.timestamp;

                const formattedAmount = formatMicroDollars(Number(latestDeposit.amount));
                if (timeSinceLastDeposit < 1000 * 60) {
                    toast.closeAll();
                    toast({
                        title: 'Deposit completed',
                        description: `Your ${formattedAmount} USDC deposit has been credited to your account.`,
                        status: 'success',
                        isClosable: true,
                    });
                }
            }
            
            prevDepositRef.current = latestDeposit;
        }
    }, [latestDeposit, toast]);
};

export default useDepositToast;