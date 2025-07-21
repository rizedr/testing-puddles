/** @type {import('next').NextConfig} */
const path = require('path');
const dotenv = require('dotenv');

const nextConfig = {
    // trailingSlash: true,
    reactStrictMode: true,
    experimental: {
        // optimizeCss: true, // Enable CSS optimization
        // forceSwcTransforms: true, // Force SWC transforms
        reactCompiler: true,
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone',
    modularizeImports: {
        '@mui/icons-material/?(((\\w*)?/?)*)': {
            transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}',
        },
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    outputFileTracingRoot: path.join(__dirname, '../../'),
};
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
let config = nextConfig;

module.exports = config;
