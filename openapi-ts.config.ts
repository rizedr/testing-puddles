import { defaultPlugins, defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: {
        path: 'http://127.0.0.1:8000/openapi.json',
        exclude: ['/debug'],
    },
    output: './client',
    client: '@hey-api/client-fetch',
    experimentalParser: true,
    plugins: [
        ...defaultPlugins,
        {
            throwOnError: true,
            name: '@hey-api/sdk',
        },
        {
            enums: 'typescript',
            name: '@hey-api/typescript',
        },
    ],
    logs: {
        level: 'silent',
    },
});
