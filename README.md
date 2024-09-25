```md
# Next.js Pinecone & OpenAI Search App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

This app allows you to add data to your Pinecone vector store and then search through that data using OpenAI embeddings. It provides a simple interface to input data and perform vector search, making it perfect for any use case requiring semantic search or intelligent data retrieval.

## Getting Started

### Prerequisites

1. [Pinecone API Key](https://www.pinecone.io/)
2. [OpenAI API Key](https://platform.openai.com/signup)

### Installation Instructions

1. Clone the repository:

   ```bash
   git clone git@github.com:as-Arslan-Siddique/search-app-using-vector-store-v0.git
   ```

2. Navigate into the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Create a `.env.local` file in the root of the project and add your API keys:

   ```bash
   OPENAI_API_KEY=your-openai-api-key
   PINECONE_API_KEY=your-pinecone-api-key
   PINECONE_INDEX_NAME=your-pinecone-index-name
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Features

- **Add Data**: Use the **Add** section of the app to add new entries to your Pinecone vector store. Each entry is embedded using OpenAI's API before being stored.
- **Search Data**: Use the homepage to perform vector searches across the data stored in Pinecone. Simply enter your search query, and the app will return relevant results using semantic search.

## How to Edit

You can start editing the app by modifying `app/page.tsx`. Any changes you make will be reflected live, thanks to Next.js’ hot reloading feature.

This project also uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family provided by Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) for additional resources and contributions.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), which is created by the same team behind Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deploying your app.
