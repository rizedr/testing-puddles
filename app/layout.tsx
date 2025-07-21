import { Metadata, Viewport } from 'next';
import { AppShell } from '../components/AppShell';
import { nunitoSans, robotoMono } from '../tools/fonts';
// import { SpeedInsights } from '@vercel/speed-insights/next';
// import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
    title: 'Ginza Gaming',
    description: 'Ginza Gaming',
    applicationName: 'Ginza Gaming',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Ginza Gaming',
        startupImage: [
            {
                url: '/avatar.png',
                media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/avatar.png',
                media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/avatar.png',
                media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/avatar.png',
                media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
            },
            {
                url: '/avatar.png',
                media: '(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/avatar.png',
                media: '(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
            },
            {
                url: '/avatar.png',
                media: '(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
            },
        ],
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: '/icons/PWAicon.png',
        apple: '/icons/PWAicon.png',
        shortcut: '/icons/PWAicon.png',
        other: [
            {
                rel: 'mask-icon',
                url: '/icons/safari-pinned-tab.svg',
                color: '#5bbad5',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'Ginza Gaming',
        description: 'Ginza Gaming',
        images: ['https://ginzagaming.com/icons/PWAicon.png'],
    },
    openGraph: {
        type: 'website',
        title: 'Ginza Gaming',
        description: 'Ginza Gaming',
        siteName: 'Ginza Gaming',
        url: 'https://ginzagaming.com',
        images: ['https://ginzagaming.com/PokerCats.jpg'],
    },
};

export const viewport: Viewport = {
    // width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${robotoMono.className} ${nunitoSans.className}`}
            suppressHydrationWarning
        >
            <body>
                <AppShell>{children}</AppShell>
                {/* <SpeedInsights />
                <Analytics /> */}
            </body>
        </html>
    );
}
