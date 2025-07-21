import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Ginza Gaming',
        short_name: 'Ginza',
        description: 'Ginza Gaming',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icons/PWAicon.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
        ],
        screenshots: [
            {
                src: '/home_bg.png',
                sizes: '1920x1080',
                type: 'image/png',
                form_factor: 'narrow',
            },
            {
                src: '/home_bg.png',
                sizes: '1920x1080',
                type: 'image/png',
                form_factor: 'wide',
            },
        ],
    };
}
