# Playtime Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

1. Install yarn and nvm.

On mac, assuming you use bash

```bash
brew install yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

2. Use the right version of node: `nvm use`.

3. Install packages with yarn: `yarn install`.

## Getting Started

First, run the development server:

```bash
yarn dev
```

This will automatically proxy to prod based on the config in `core/OpenAPI.ts`

If you want to connect to the local server, change core/OPENAPI.ts OpenAPI.base to the url of the backend server `http://localhost:[BACKEND_PORT_NUMBER]`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/{ROUTE}](http://localhost:3000/api/{route}). This endpoint can be edited in `pages/api/{route}.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in `pages/api` are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## API

See https://api.ccpgaming.com/docs.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

> > > > > > > frontend/main
