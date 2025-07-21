import { Grid, GridItem } from '@chakra-ui/react';
import { LandscapeSideMenu } from '../../components/LandscapeSideMenu';
import PortraitHomeTabs from '../../components/HomePage/Portrait/PortraitHomeTabs';
import { FetchAuthWrapper } from '../../components/Navigation';
import { BalanceCard } from '../../components/HomePage/Hero/Shared/BalanceCard';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <FetchAuthWrapper>
            {/* Landscape Layout */}
            <Grid
                h="100vh"
                w="100vw"
                templateAreas={{
                    base: `"header"
                           "main"
                           "footer"`,
                    lg: `"header header"
                         "sidebar main"`,
                }}
                templateRows={{
                    base: 'auto 1fr auto',
                    lg: 'auto 1fr',
                }}
                templateColumns={{
                    base: '1fr',
                    lg: 'auto 1fr',
                }}
                display={{ base: 'none', lg: 'grid' }}
            >
                <GridItem area="header" zIndex={5}>
                    <BalanceCard />
                </GridItem>
                <GridItem
                    area="sidebar"
                    display={{ base: 'none', lg: 'block' }}
                >
                    <LandscapeSideMenu />
                </GridItem>
                <GridItem area="main" overflowY="hidden">
                    {children}
                </GridItem>
            </Grid>

            {/* Portrait Layout */}
            <Grid
                h="100dvh"
                w="100vw"
                templateAreas={`"header"
                               "main"
                               "footer"`}
                templateRows="auto 1fr auto"
                display={{ base: 'grid', lg: 'none' }}
            >
                <GridItem area="header" zIndex={5}>
                    <BalanceCard />
                </GridItem>
                <GridItem area="main" overflow="auto" overflowX="hidden">
                    {children}
                </GridItem>
                <GridItem area="footer" zIndex={5}>
                    <PortraitHomeTabs />
                </GridItem>
            </Grid>
        </FetchAuthWrapper>
    );
}
