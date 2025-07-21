"use client";

import { useState, useEffect } from "react";
import { useConvex } from "convex/react";
import { auditUserBalance, logAuditResults } from "../../../utils/auditUserBalance";
import { convertCurrencyToDisplay } from "../../../components/utils/convertCurrency";
import { 
  Button, 
  Card, 
  CardHeader, 
  Input,
  Heading,
  CardBody,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Text,
  SimpleGrid,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";


export default function AuditUser() {
  const [userId, setUserId] = useState("");
  const [auditResult, setAuditResult] = useState<Awaited<ReturnType<typeof auditUserBalance>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const convex = useConvex();

  // Add event listener to handle audit requests from WithdrawalsUnderReview
  useEffect(() => {
    const handleRunAudit = (event: CustomEvent) => {
      const { userId } = event.detail;
      if (userId) {
        setUserId(userId);
        // Automatically trigger the audit
        handleAuditWithUserId(userId);
      }
    };
    
    window.addEventListener('runAuditUser', handleRunAudit as EventListener);
    
    return () => {
      window.removeEventListener('runAuditUser', handleRunAudit as EventListener);
    };
  }, []);
  
  // Extract the audit logic to be able to call it directly with a userId
  const handleAuditWithUserId = async (id: string) => {
    if (!id.trim()) {
      setError("Please enter a user ID");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await auditUserBalance(convex, id);
      await logAuditResults(result);
      setAuditResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during audit");
      setAuditResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAuditWithUserId(userId);
  };

  return (
    <Box 
      id="user-audit-section" 
      bg="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182" 
      border="0.1rem solid"
      borderColor="purple.400"
      p={6} 
      borderRadius="16px" 
      boxShadow="lg"
    >
      <Heading size="md" mb="1rem" color="white">Account Balance Audit Tool</Heading>
      <Text 
        fontSize="sm" 
        color="gray.400" 
        textAlign="left"
      >
        Determines if the user's current balance is valid given
      </Text>
      <Text 
        fontSize="sm" 
        color="gray.400" 
        textAlign="left"
      >
        account PNL, rewards, deposits, and withdrawals.
      </Text>

      <Card 
        bg="transparent" 
        color="white"
        borderRadius="16px"
      >
        <CardBody>
          <form onSubmit={handleAudit}>
            <Flex gap={4} alignItems="flex-end">
              <FormControl flex="1">
                <FormLabel htmlFor="userId" fontSize="sm" fontWeight="medium">
                  User ID
                </FormLabel>
                <Input
                  id="userId"
                  bg="gray.900"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID"
                />
              </FormControl>
              <Button 
                type="submit" 
                isDisabled={loading}
                bg="blue.500"
                _hover={{ bg: "blue.600" }}
              >
                {loading ? <Spinner size="sm" color="white" /> : <ChevronRightIcon color="white" />}
              </Button>
            </Flex>
          </form>
        </CardBody>
      </Card>

      {error && (
        <Box mt={6} bg="red.100" color="red.800" p={4} borderRadius="md">
          {error}
        </Box>
      )}

      {auditResult && (
        <Card mt={6} bg="rgb(15, 15, 15, 0.9)" color="rgb(255, 255, 255, 0.75)" border="0.1px solid" borderColor="rgb(255, 255, 255, 0.25)">
          <CardHeader>
            <Heading size="sm" color={auditResult.result === "PASSED" ? "green.400" : "red.400"}>
              {auditResult.result}
            </Heading>
            <Text align="left" fontSize="md" fontWeight="bold" color="white" mt={1}>
              {auditResult.username}
            </Text>
            {auditResult.result === "FAILED" && (
              <Text fontSize="sm" textAlign="left" mt={2}>
                {Number(auditResult.discrepancy) < 0 
                  ? `Current user balance below expectation by $${convertCurrencyToDisplay(BigInt(Math.abs(Number(auditResult.discrepancy))))}`
                  : `Current user balance exceeds expectation by $${convertCurrencyToDisplay(BigInt(Math.abs(Number(auditResult.discrepancy))))}`}
              </Text>
            )}
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={2} spacing={2}>

            <Divider gridColumn="1 / -1" />

              <Text fontWeight="medium" fontSize="sm" textAlign="left">Deposits</Text>
              <Text fontSize="sm" textAlign="right" color="green.400">
                {convertCurrencyToDisplay(auditResult.details.totalDeposits)}
              </Text>

              <Text fontWeight="medium" fontSize="sm" textAlign="left">Withdrawals</Text>
              <Text fontSize="sm" textAlign="right" color="red.400">
                {convertCurrencyToDisplay(auditResult.details.totalWithdrawals)}
              </Text>

              <Text fontWeight="medium" fontSize="sm" textAlign="left">Poker PNL</Text>
              <Text fontSize="sm" textAlign="right" color={Number(auditResult.details.totalPnl) < 0 ? "red.400" : "green.400"}>
                {convertCurrencyToDisplay(auditResult.details.totalPnl)}
              </Text>
              
              <Text fontWeight="medium" fontSize="sm" textAlign="left">Rewards (Host)</Text>
              <Text fontSize="sm" textAlign="right" color="green.400">
                {convertCurrencyToDisplay(auditResult.details.hostRewards)}
              </Text>
              
              <Text fontWeight="medium" fontSize="sm" textAlign="left">Rewards (Affiliate)</Text>
              <Text fontSize="sm" textAlign="right" color="green.400">
                {convertCurrencyToDisplay(auditResult.details.affiliateRewards)}
              </Text>

              <Divider gridColumn="1 / -1" />


              <Text fontWeight="medium" fontSize="sm" textAlign="left">Expected Balance:</Text>
              <Text fontSize="sm" textAlign="right">
                {convertCurrencyToDisplay(auditResult.expectedBalance)}
              </Text>

              <Text fontWeight="medium" fontSize="sm" textAlign="left">Current Balance:</Text>
              <Text fontSize="sm" textAlign="right">
                {convertCurrencyToDisplay(auditResult.currentBalance)}
              </Text>
              
              <Divider gridColumn="1 / -1" />

              <Text fontWeight="medium" fontSize="sm" textAlign="left">Discrepancy:</Text>
              <Text textAlign="right" fontWeight="bold" fontSize="sm">
                <Box as="span" color={Number(auditResult.discrepancy) === 0 ? "green.400" : "red.400"} display="inline">
                  {convertCurrencyToDisplay(auditResult.discrepancy)}
                </Box>
              </Text>

            </SimpleGrid>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}
