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
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { formatMicroDollars } from '../../../components/utils/formatMoney';
import { api } from '../../../../../packages/convex/convex/_generated/api';

const AdminTransactionSummary: React.FC = () => {
  const depositsData = useQuery(api.tasks.getDirectDepositsData);
  const withdrawalsData = useQuery(api.tasks.getDirectWithdrawalsData);
  
  const [currentYear, setCurrentYear] = useState<string | null>(null);

  const yearlyData = useMemo(() => {
    if (!depositsData || !withdrawalsData) return null;
    
    const yearGroups: Record<string, Record<string, { deposits: number; withdrawals: number }>> = {};
    const years: string[] = [];
    
    Object.entries(depositsData.monthlyBreakdown).forEach(([monthKey, amount]) => {
      const year = monthKey.split('-')[0];
      if (!yearGroups[year]) {
        yearGroups[year] = {};
        years.push(year);
      }
      if (!yearGroups[year][monthKey]) {
        yearGroups[year][monthKey] = { deposits: 0, withdrawals: 0 };
      }
      yearGroups[year][monthKey].deposits = Number(amount);
    });
    
    Object.entries(withdrawalsData.monthlyBreakdown).forEach(([monthKey, amount]) => {
      const year = monthKey.split('-')[0];
      if (!yearGroups[year]) {
        yearGroups[year] = {};
        years.push(year);
      }
      if (!yearGroups[year][monthKey]) {
        yearGroups[year][monthKey] = { deposits: 0, withdrawals: 0 };
      }
      yearGroups[year][monthKey].withdrawals = Number(amount);
    });
    
    years.sort((a, b) => parseInt(b) - parseInt(a));
    return { yearGroups, years };
  }, [depositsData, withdrawalsData]);
  
  useMemo(() => {
    if (yearlyData && yearlyData.years.length > 0 && !currentYear) {
      setCurrentYear(yearlyData.years[0]);
    }
  }, [yearlyData, currentYear]);
  
  if (!depositsData || !withdrawalsData) {
    return (
      <VStack w="100%" spacing="2rem" align="start">
        <Box w="100%" alignItems="start">
          <Heading size="md" mb="1rem" color="white">Transaction Summary</Heading>
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
              <Text color="whiteAlpha.600">Loading transaction data...</Text>
            </VStack>
          </Box>
        </Box>
      </VStack>
    );
  }

  const currentYearData = yearlyData ? yearlyData.yearGroups[currentYear || ''] || {} : {};
  const sortedMonths = Object.entries(currentYearData)
    .sort((a, b) => b[0].localeCompare(a[0]));

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const hasData = yearlyData && yearlyData.years.length > 0;

  return (
    <VStack w="100%" spacing="2rem" align="start">
      {/* Overall Summary */}
      <Box w="100%" alignItems="start">
        <Heading size="md" mb="1rem" color="white">Transaction Summary</Heading>
        <Box
          w="100%"
          p="1.5rem"
          bg="brand.gray60"
          borderRadius="16px"
          border="0.1rem solid"
          borderColor="purple.400"
        >
          <StatGroup w="100%" mb={4}>
            <Stat>
              <StatLabel color="whiteAlpha.700">Total Deposits</StatLabel>
              <StatNumber color="green.400" fontSize="2xl">
                ${formatMicroDollars(Number(depositsData.total))}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="whiteAlpha.700">Total Withdrawals</StatLabel>
              <StatNumber color="red.400" fontSize="2xl">
                ${formatMicroDollars(Number(withdrawalsData.total))}
              </StatNumber>
            </Stat>
          </StatGroup>
        </Box>
      </Box>

      {/* Deposits Overview */}
      <Box w="100%" alignItems="start">
        <Heading size="md" mb="1rem" color="white">Deposits Overview</Heading>
        <Box
          w="100%"
          p="1.5rem"
          bg="brand.gray60"
          borderRadius="16px"
          border="0.1rem solid"
          borderColor="green.400"
        >
          {hasData ? (
            <>
              <HStack mb={4} justify="center">
                <ButtonGroup isAttached variant="outline" size="sm">
                  {yearlyData.years.map(year => (
                    <Button
                      key={year}
                      onClick={() => setCurrentYear(year)}
                      bg={currentYear === year ? "green.500" : "transparent"}
                      color={currentYear === year ? "white" : "whiteAlpha.700"}
                      _hover={{ bg: currentYear === year ? "green.600" : "whiteAlpha.200" }}
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
                      <Th color="green.100" fontWeight="bold">Month</Th>
                      <Th color="green.100" fontWeight="bold" isNumeric>Deposits</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedMonths.length > 0 ? (
                      sortedMonths.map(([month, data]) => (
                        <Tr key={month}>
                          <Td color="gray.300">{formatMonth(month)}</Td>
                          <Td color="green.400" fontWeight="bold" isNumeric>
                            ${formatMicroDollars(data.deposits)}
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={2} textAlign="center" py={4} color="whiteAlpha.600">
                          No deposit data for {currentYear}
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </>
          ) : (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600" mb={2}>
                No deposit data available yet.
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Withdrawals Overview */}
      <Box w="100%" alignItems="start">
        <Heading size="md" mb="1rem" color="white">Withdrawals Overview</Heading>
        <Box
          w="100%"
          p="1.5rem"
          bg="brand.gray60"
          borderRadius="16px"
          border="0.1rem solid"
          borderColor="red.400"
        >
          {hasData ? (
            <>
              <HStack mb={4} justify="center">
                <ButtonGroup isAttached variant="outline" size="sm">
                  {yearlyData.years.map(year => (
                    <Button
                      key={year}
                      onClick={() => setCurrentYear(year)}
                      bg={currentYear === year ? "red.500" : "transparent"}
                      color={currentYear === year ? "white" : "whiteAlpha.700"}
                      _hover={{ bg: currentYear === year ? "red.600" : "whiteAlpha.200" }}
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
                      <Th color="red.100" fontWeight="bold">Month</Th>
                      <Th color="red.100" fontWeight="bold" isNumeric>Withdrawals</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedMonths.length > 0 ? (
                      sortedMonths.map(([month, data]) => (
                        <Tr key={month}>
                          <Td color="gray.300">{formatMonth(month)}</Td>
                          <Td color="red.400" fontWeight="bold" isNumeric>
                            ${formatMicroDollars(data.withdrawals)}
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={2} textAlign="center" py={4} color="whiteAlpha.600">
                          No withdrawal data for {currentYear}
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </>
          ) : (
            <Box textAlign="center" py={8}>
              <Text color="whiteAlpha.600" mb={2}>
                No withdrawal data available yet.
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </VStack>
  );
};

export default AdminTransactionSummary; 
