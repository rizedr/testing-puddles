import { useAction, useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { AddressesResponse, AssetsResponse, Blockchains } from "../../../../../packages/convex/convex/vaultody.types";
import { useEffect, useState } from "react";
import { Box, Grid, HStack, Text, useToast, VStack } from "@chakra-ui/react";
import { CHAIN_INFO, getSupportedChains } from "../../../../../packages/convex/convex/constants";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";

const Vaults = () => {

    const getBalancesInStorage = useAction(api.vaultody.getBalancesInStorage);
    const getAddressInBlockchainByBlockchain = useAction(api.vaultody.getAddressInBlockchainByBlockchain);

    const [balances, setBalances] = useState<AssetsResponse['data']['item']['assets']>([]);
    const [addresses, setAddresses] = useState<{ blockchain: Blockchains, address: string }[]>([]);

    const toast = useToast();

    useEffect(() => {
        getBalancesInStorage().then((balances) => {
            setBalances(balances);
        });

        getAddressInBlockchainByBlockchain().then((addresses) => {
            setAddresses(addresses);
        });
    }, []);


    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        toast({
            title: 'Address copied to clipboard',
            status: 'success',
        });
    };

    return (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="2rem">
                {/* {balances.map((balance) => (
                    <Text fontSize="lg" mb="1rem" color="white">{balance.blockchain} - <Text as="span" color="blue.300">{balance.symbol}</Text> - <Text as="span" color="purple.300">{balance.assetData.totalAmount}</Text> - <Text as="span" color="green.300">{addresses.find((address) => address.blockchain === balance.blockchain)?.address}</Text></Text>
                ))} */}

                {getSupportedChains(process.env.NEXT_PUBLIC_IS_TESTNET === 'true', true).map((chain) => {
                    const address = addresses.find((address) => address.blockchain === chain.blockchain);
                    return (
                    <VStack key={chain.blockchain} align="start" mb="2rem">
                        <HStack alignItems="center" gap="1rem">
                            <Text fontSize="xl" color="white">{CHAIN_INFO[chain.id].name}</Text>
                            <Image src={CHAIN_INFO[chain.id].icon} alt={CHAIN_INFO[chain.id].name} width={40} height={40} />
                        </HStack>
                        {
                            balances.filter((balance) => balance.blockchain === chain.blockchain).map((balance) => (
                                <Text fontSize="lg" mb="1rem" color="white">{balance.symbol} - { Intl.NumberFormat('en-US', {  maximumFractionDigits: ['ETH', 'SOL'].includes(balance.symbol) ? 10 : 2 }).format(parseFloat(balance.assetData.totalAmount))}</Text>
                            ))
                        }
                        {address && (
                           <HStack
                           p="4"
                           bg="whiteAlpha.200"
                           borderRadius="xl"
                           justify="space-between"
                       >
                           <Text color="white" fontSize="sm" userSelect="text">
                               {address?.address}
                           </Text>
                           <Box
                               as={FaCopy}
                               onClick={() => copyAddress(address.address)}
                               color="white"
                               fontSize="20px"
                               cursor="pointer"
                               _hover={{ color: 'purple.300' }}
                           />
                       </HStack>
                        )}
                    </VStack>
                )})}
        </Grid>
    );
};

export default Vaults;