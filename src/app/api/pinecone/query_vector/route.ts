// Import necessary modules and types
import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string, // Your Pinecone API key
});

const indexName = process.env.PINECONE_INDEX_NAME || 'quickstart'; // Your Pinecone index name

// API endpoint to handle the POST request
export async function POST(req: NextRequest) {

  // Ensure the Pinecone index exists, create it if it doesn't
async function ensureIndexExists() {
  try {
    
    const indexExists = await pc.describeIndex(indexName);
    

    if (!indexExists) {
      
      await pc.createIndex({
        name: indexName,
        dimension: 1536, // Match your embedding dimension size
        metric: 'cosine', // Metric can be 'cosine', 'dotproduct', or 'euclidean'
        spec: {
          serverless: { cloud: 'aws', region: 'us-east-1' },
        },
      });
      
    }
  } catch (error: any) {
    console.error(`Error ensuring index exists: ${error.message}`);
    throw new Error(`Error ensuring index exists: ${error.message}`);
  }
}

// Function to get embedding of the text using OpenAI API
async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002', // Choose your model
        input: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from OpenAI:', errorText);
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();
    return data.data[0].embedding; // Correctly access the embedding array
  } catch (error: any) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

  try {
    
    await ensureIndexExists();

    
    const { message_content, top_k } = await req.json();
    const topK = top_k || 5; // Default to 5 if not provided

    // Validate required fields
    if (!message_content) {
      console.warn('Missing required field: message_content');
      return NextResponse.json(
        { error: 'message_content is required' },
        { status: 400 }
      );
    }

    // Get the embedding of the user's message
    
    const embedding = await getEmbedding(message_content);

    const index = pc.Index(indexName);

    // Query Pinecone with the embedding
    const queryRequest = {
      vector: embedding,
      topK: topK,
      includeMetadata: true,
    } as any;

    const queryResponse = await index.query(queryRequest);

    const matches = queryResponse.matches || [];

    // Extract metadata from the matches
    const retrievedData = matches.map((match) => match.metadata);

    // Return the retrieved data
    return NextResponse.json({ retrievedData }, { status: 200 });
  } catch (error: any) {
    console.error('Error during the query process:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to query vector' },
      { status: 500 }
    );
  }
}
