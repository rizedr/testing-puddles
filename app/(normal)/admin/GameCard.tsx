// 'use client';

// import {
//     Box,
//     Flex,
//     Text,
//     IconButton,
//     Tooltip,
//     Badge,
//     HStack,
//     VStack,
//     useToast
// } from '@chakra-ui/react';
// import { CopyIcon, ViewIcon } from '@chakra-ui/icons';
// import Link from 'next/link';

// interface GameCardProps {
//     game: any;
// }

// const GameCard = ({ game }: GameCardProps) => {
//     const toast = useToast();

//     const truncateId = (id: string) => {
//         if (!id) return '';
//         return `${id.slice(0, 4)}...${id.slice(-4)}`;
//     };
    
//     const copyToClipboard = (text: string) => {
//         navigator.clipboard.writeText(text);
//         toast({
//             title: "Copied to clipboard",
//             status: "success",
//             duration: 2000,
//             isClosable: true,
//             position: "bottom-right",
//         });
//     };

//     const formatDate = (timestamp: number) => {
//         if (!timestamp) return 'N/A';
//         const date = new Date(timestamp);
//         return date.toLocaleDateString('en-US', { 
//             month: '2-digit', 
//             day: '2-digit', 
//             year: '2-digit' 
//         }) + ' ' + date.toLocaleTimeString('en-US', {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//         });
//     };

//     const getGameType = (gameType: bigint) => {
//         return gameType === 0n ? "POKER" : "ROULETTE";
//     };

//     const getVisibility = (visibility: bigint) => {
//         return visibility === 0n ? "PUBLIC" : "PRIVATE";
//     };

//     const getGameMode = (gameData: any) => {
//         if (!gameData?.game_settings?.game_mode && gameData?.game_settings?.game_mode !== 0) return "N/A";
//         switch (gameData.game_settings.game_mode) {
//             case 0:
//                 return "NLH";
//             case 1:
//                 return "PLO";
//             default:
//                 return gameData.game_settings.game_mode;
//         }
//     };

//     return (
//         <Box
//             bg="brand.gray60"
//             borderRadius="12px"
//             border="1px solid"
//             borderColor="purple.400"
//             p={4}
//             mb={4}
//             w="100%"
//             transition="transform 0.2s"
//             _hover={{ transform: "translateY(-2px)" }}
//         >
//             <Flex justify="space-between">
//                 <VStack align="start" spacing={2} flex={1}>
//                     <HStack>
//                         <Text fontWeight="bold" color="white">ID:</Text>
//                         <Text color="gray.300">{truncateId(game._id)}</Text>
//                         <Tooltip label="Copy full ID">
//                             <IconButton
//                                 aria-label="Copy ID"
//                                 icon={<CopyIcon color="white" />}
//                                 size="xs"
//                                 variant="solid"
//                                 bg="purple.500"
//                                 _hover={{ bg: "purple.600" }}
//                                 onClick={() => copyToClipboard(game._id)}
//                             />
//                         </Tooltip>
//                     </HStack>
                    
//                     <HStack>
//                         <Text fontWeight="bold" color="white">Type:</Text>
//                         <Badge colorScheme={game.gameType === 0n ? "green" : "blue"}>
//                             {getGameType(game.gameType)}
//                         </Badge>
//                     </HStack>
                    
//                     <HStack>
//                         <Text fontWeight="bold" color="white">Mode:</Text>
//                         <Text color="white">{getGameMode(game.gameData)}</Text>
//                     </HStack>
                    
//                     <HStack>
//                         <Text fontWeight="bold" color="white">Host:</Text>
//                         {game.gameData?.game_host === "ADMIN" ? (
//                             <Text color="yellow.300">SYSTEM</Text>
//                         ) : (
//                             <Text color="white">{truncateId(game.gameData?.game_host || "")}</Text>
//                         )}
//                     </HStack>
                    
//                     <HStack>
//                         <Text fontWeight="bold" color="white">Visibility:</Text>
//                         <Badge colorScheme={game.visibility === 0n ? "green" : "purple"}>
//                             {getVisibility(game.visibility)}
//                         </Badge>
//                     </HStack>
                    
//                     <HStack>
//                         <Text fontWeight="bold" color="white">Last Update:</Text>
//                         <Text color="gray.300">{formatDate(game.updatedAt)}</Text>
//                     </HStack>
//                 </VStack>
                
//                 <Tooltip label="View Game">
//                     <Link href={`/game/${game._id}`} target="_blank" passHref>
//                         <IconButton
//                             as="span"
//                             aria-label="View Game"
//                             icon={<ViewIcon color="white" />}
//                             size="md"
//                             variant="solid"
//                             bg="blue.500"
//                             _hover={{ bg: "blue.600" }}
//                         />
//                     </Link>
//                 </Tooltip>
//             </Flex>
//         </Box>
//     );
// };

// export default GameCard; 