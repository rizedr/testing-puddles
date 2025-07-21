import { notFound, redirect, unauthorized } from 'next/navigation';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import { OpacityCover } from '../page';
import Admin from './Admin';

// Add this export to force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return redirect('/sign-in?redirect=/admin');
    }

    const token = await getToken({ template: 'convex' });
    if (!token) {
      console.error('[AdminPage] Failed to get Convex token');
      return redirect('/sign-in?redirect=/admin');
    }

    // Server-side admin access validation via Convex-protected function
    // - Server-rendered admin route protection
    // - Token-based approach for authentication
    // The combination of Clerk authentication and the Convex backend check provides 
    // two layers of validation that happen entirely server-side before any admin content is rendered.

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    try {
      await convex.query(api.users.checkAdminAccess, {});
    } catch (adminCheckError) {
      // Log any unauthorized access attempt with the user ID
      // In the case of unsuncessful  access attempt, we want the user to experience a default 404 page
      // experience as opposed to URL redirect to 404 or 403 page for route obfuscation.
      console.error(`[AdminPage] Unauthorized access attempt by user: ${userId}`, adminCheckError);
      notFound();
    }

    return (
      <Box
        backgroundImage={`url('/home_bg4.webp')`}
        backgroundSize="cover"
        backgroundPosition="top"
        minH="100vh"
        w="100%"
        position="relative"
        overflowY="auto"
        sx={{
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <OpacityCover opacity={0.4} blurAmount={2} />
        <Box position="relative" zIndex="1" pb="6rem">
          <VStack spacing={6} align="start" p={6} maxW="1400px" mx="auto">
            <Text color="white">
              Your admin account has been successfully verified.
            </Text>
            <Admin />
          </VStack>
        </Box>
      </Box>
    );
  } catch (error) {
    console.error('[AdminPage] Unexpected error:', error);
    notFound();
  }
}
