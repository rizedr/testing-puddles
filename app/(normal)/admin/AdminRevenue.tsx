'use client';

import { useState, useMemo } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Heading, 
  Divider, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  ButtonGroup,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { formatMicroDollars } from '../../../components/utils/formatMoney';
import { api } from '../../../../../packages/convex/convex/_generated/api';

const AdminRevenue: React.FC = () => {
  const revenueData = useQuery(api.tasks.getAdminRevenue);
  const rollupRevenue = useMutation(api.tasks.rollupPlatformRevenue);
  const refreshRevenue = useMutation(api.tasks.refreshAllGameRevenue);
  const deleteAllRevenueRows = useMutation(api.tasks.deleteAllRevenueRows);
  const toast = useToast();
  
  // Group data by year and track current year
  const [currentYear, setCurrentYear] = useState<string | null>(null);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRollingUp, setIsRollingUp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for selected month to view games
  const [selectedMonthForGames, setSelectedMonthForGames] = useState<string | null>(null);
  
  // Query for games with revenue for selected month
  const gamesWithRevenue = useQuery(
    api.tasks.getGamesWithRevenueForMonth,
    selectedMonthForGames 
      ? {
          year: parseInt(selectedMonthForGames.split('-')[0]),
          month: parseInt(selectedMonthForGames.split('-')[1])
        }
      : "skip"
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshRevenue({});
      toast({
        title: "Revenue refreshed",
        description: "All game revenue has been recalculated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh revenue data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRollup = async () => {
    setIsRollingUp(true);
    try {
      await rollupRevenue({});
      toast({
        title: "Rollup complete",
        description: "Platform revenue has been rolled up.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Rollup failed",
        description: "Failed to roll up platform revenue",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRollingUp(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await deleteAllRevenueRows({});
      toast({
        title: "All revenue rows deleted",
        description: "All platform revenue data has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete all revenue rows",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const yearlyData = useMemo(() => {
    if (!revenueData) return null;
    
    const yearGroups: Record<string, Record<string, number>> = {};
    const years: string[] = [];
    
    // Group months by year
    Object.entries(revenueData.monthlyBreakdown).forEach(([monthKey, amount]) => {
      const year = monthKey.split('-')[0];
      
      if (!yearGroups[year]) {
        yearGroups[year] = {};
        years.push(year);
      }
      
      yearGroups[year][monthKey] = Number(amount);
    });
    
    // Sort years in descending order (newest first)
    years.sort((a, b) => parseInt(b) - parseInt(a));
    
    return { yearGroups, years };
  }, [revenueData]);
  
  // Initialize currentYear with the most recent year when data loads
  useMemo(() => {
    if (yearlyData && yearlyData.years.length > 0 && !currentYear) {
      setCurrentYear(yearlyData.years[0]);
    }
  }, [yearlyData, currentYear]);
  
  if (!revenueData) {
    return (
      <Box w="100%" alignItems="start" mb="2rem">
        <Heading size="md" mb="1rem" color="white">Revenue Overview</Heading>
        <Box
          w="100%"
          p="1.5rem"
          bg="brand.gray60"
          borderRadius="16px"
          border="0.1rem solid"
          borderColor="purple.400"
        >
          <VStack align="center" justify="center" h="200px">
            <Spinner color="purple.300" size="xl" />
            <Text color="whiteAlpha.600">Loading revenue data...</Text>
          </VStack>
        </Box>
      </Box>
    );
  }

  // Get current year's data and sort months (newest first) - handle empty data
  const currentYearData = yearlyData ? yearlyData.yearGroups[currentYear || ''] || {} : {};
  const sortedMonths = Object.entries(currentYearData)
    .sort((a, b) => b[0].localeCompare(a[0]));

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculate solvency status
  // const surplusValue = Number(revenueData.surplusBalance);
  // const liabilitiesValue = Number(revenueData.liabilitiesAmount);
  // const isSolvent = liabilitiesValue <= surplusValue;

  // Handle case where no revenue data exists yet
  const hasRevenueData = yearlyData && yearlyData.years.length > 0;

  return (
    <Box w="100%" alignItems="start" mb="2rem">
      <Heading size="md" mb="1rem" color="white">Revenue Overview</Heading>
      <Box
        w="100%"
        p="1.5rem"
        bg="brand.gray60"
        borderRadius="16px"
        border="0.1rem solid"
        borderColor="purple.400"
      >
        <Flex direction="column" w="100%">
          <StatGroup w="100%" mb={4}>
            <Stat>
              <StatLabel color="whiteAlpha.700">Platform Revenue</StatLabel>
              <StatNumber color="green.400" fontSize="xl">
                ${formatMicroDollars(Number(revenueData.total))}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="whiteAlpha.700">Game Surplus</StatLabel>
              <StatNumber color="blue.400" fontSize="xl">
                ${formatMicroDollars(Number(revenueData.surplusBalance))}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="whiteAlpha.700">Total Liabilities</StatLabel>
              <StatNumber color="purple.400" fontSize="2xl">
                {/* ${formatMicroDollars(Number(revenueData.liabilitiesAmount))} */}
              </StatNumber>
            </Stat>
          </StatGroup>
          
          <Divider borderColor="whiteAlpha.300" mb={4} />
          
          {/* Refresh and Roll Up Controls - Outside container */}
          <Flex mb={4} justify="space-between" align="center" w="100%">
            <HStack>
              <Button
                onClick={handleRefresh}
                isLoading={isRefreshing}
                loadingText="Refreshing..."
                size="sm"
                fontSize="xs"
                bg="purple.700"
                color="white"
                _hover={{ bg: "purple.800" }}
                _active={{ bg: "purple.900" }}
              >
                1. Refresh
              </Button>
              <Button
                onClick={handleRollup}
                isLoading={isRollingUp}
                loadingText="Rolling Up..."
                size="sm"
                fontSize="xs"
                bg="purple.700"
                color="white"
                _hover={{ bg: "purple.800" }}
                _active={{ bg: "purple.900" }}
              >
                2. Roll Up
              </Button>
            </HStack>
            <Button
              onClick={handleDeleteAll}
              isLoading={isDeleting}
              loadingText="Deleting..."
              size="sm"
              fontSize="xs"
              bg="red.600"
              color="white"
              _hover={{ bg: "red.700" }}
              _active={{ bg: "red.800" }}
            >
              Delete All
            </Button>
          </Flex>
          
          {hasRevenueData ? (
            <>
              {/* Year pagination controls */}
              <HStack mb={4} justify="center">
                <ButtonGroup isAttached variant="outline" size="sm">
                  {yearlyData.years.map(year => (
                    <Button
                      key={year}
                      onClick={() => setCurrentYear(year)}
                      bg={currentYear === year ? "purple.500" : "transparent"}
                      color={currentYear === year ? "white" : "whiteAlpha.700"}
                      _hover={{ bg: currentYear === year ? "purple.600" : "whiteAlpha.200" }}
                      borderColor="whiteAlpha.300"
                    >
                      {year}
                    </Button>
                  ))}
                </ButtonGroup>
              </HStack>
              
              <Box w="100%" overflowX="auto">
                <Table variant="unstyled" size="sm" color="white">
                  <Thead>
                    <Tr>
                      <Th color="purple.100" fontWeight="bold">Month</Th>
                      <Th color="purple.100" fontWeight="bold" isNumeric>Revenue</Th>
                      <Th color="purple.100" fontWeight="bold" textAlign="center">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedMonths.length > 0 ? (
                      sortedMonths.map(([month, amount]) => (
                        <Tr key={month}>
                          <Td color="gray.300">{formatMonth(month)}</Td>
                          <Td color="green.400" fontWeight="bold" isNumeric>${formatMicroDollars(Number(amount))}</Td>
                          <Td textAlign="center">
                            <Button
                              size="xs"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => setSelectedMonthForGames(selectedMonthForGames === month ? null : month)}
                              isActive={selectedMonthForGames === month}
                            >
                              View Games
                            </Button>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={3} textAlign="center" py={4} color="whiteAlpha.600">
                          No revenue data for {currentYear}
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>

              {/* Games with Revenue Section */}
              {selectedMonthForGames && (
                <Box mt={6}>
                  <Divider borderColor="whiteAlpha.300" mb={4} />
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="sm" color="white">
                      Games with Revenue - {formatMonth(selectedMonthForGames)}
                    </Heading>
                    <Button
                      size="sm"
                      variant="ghost"
                      color="whiteAlpha.700"
                      onClick={() => setSelectedMonthForGames(null)}
                      _hover={{ bg: "whiteAlpha.100", color: "whiteAlpha.900" }}
                    >
                      Close
                    </Button>
                  </Flex>
                  
                  {gamesWithRevenue ? (
                    <Box
                      maxH="400px"
                      overflowY="auto"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                      borderRadius="md"
                      bg="rgba(0, 0, 0, 0.3)"
                    >
                      {gamesWithRevenue.length > 0 ? (
                        <Table variant="unstyled" size="sm" color="white">
                          <Thead position="sticky" top={0} bg="brand.gray60" zIndex={1}>
                            <Tr>
                              <Th color="purple.100" fontWeight="bold">Game ID</Th>
                              <Th color="purple.100" fontWeight="bold" isNumeric>Revenue</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {gamesWithRevenue.map((game) => (
                              <Tr key={game.gameId} _hover={{ bg: "whiteAlpha.100" }}>
                                <Td color="gray.300" fontFamily="mono" fontSize="xs">
                                  {game.gameId}
                                  {!game.gameExists && (
                                    <Text as="span" color="red.400" fontSize="xs" ml={2}>
                                      (deleted)
                                    </Text>
                                  )}
                                </Td>
                                <Td color="green.400" fontWeight="bold" isNumeric>
                                  ${formatMicroDollars(Number(game.revenue))}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Box p={4} textAlign="center">
                          <Text color="whiteAlpha.600">
                            No games with revenue found for {formatMonth(selectedMonthForGames)}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Spinner color="purple.300" size="sm" />
                      <Text color="whiteAlpha.600" ml={2} display="inline">
                        Loading games...
                      </Text>
                    </Box>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600" mb={2}>
                No revenue data available yet.
              </Text>
              <Text color="whiteAlpha.500" fontSize="sm">
                Use the refresh button above to generate revenue data.
              </Text>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default AdminRevenue; 
