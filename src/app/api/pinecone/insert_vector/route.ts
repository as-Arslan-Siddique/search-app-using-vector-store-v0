import { v4 as uuidv4 } from 'uuid'; // Import UUID library for generating unique IDs
import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string, // Store the API key in environment variables
});

const indexName = process.env.PINECONE_INDEX_NAME || 'quickstart'; // Ensure the index matches your Pinecone configuration

export async function POST(req: NextRequest) {
  // Ensure the Pinecone index exists, create it if it doesn't
  async function ensureIndexExists() {
    try {
      const indexExists = await pc.describeIndex(indexName);

      // Create index if it doesn't exist
      if (!indexExists) {
        await pc.createIndex({
          name: indexName,
          dimension: 1536, // Adjust this to match your embedding dimension size
          metric: 'cosine', // 'dot' or 'euclidean' can also be used
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

  try {
    await ensureIndexExists();

    // FIXED: Changed 'vector' to 'content' to match the data sent from the client
    const { title, vector, metadata } = await req.json();

    // Validate required fields
    if (!vector || !metadata) {
      console.warn('Missing required fields:', { title, vector, metadata });
      return NextResponse.json(
        { error: 'Content and metadata are required' },
        { status: 400 }
      );
    }

    // Generate a new ID
    const messageId = uuidv4();

    const index = pc.Index(indexName);

    // FIXED: Await the asynchronous getEmbedding function
    const embedding = await getEmbedding(vector);

    // FIXED: Prepare the upsert vectors correctly
    const upsertVectors = [
      {
        id: messageId,          // The unique ID for this vector
        values: embedding,      // The vector data (array of floats)
        metadata: {
          title: title,
          ...metadata,
        }, // Metadata associated with the vector
      },
    ];

    // FIXED: The upsert method expects an object with a 'vectors' key
    await index.upsert(upsertVectors);

    // Since upsert does not return a response, we assume success if no error is thrown
    return NextResponse.json(
      { message: 'Vector upserted successfully', id: messageId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during the upsert process:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upsert vector' },
      { status: 500 }
    );
  }
}

// The getEmbedding function remains the same
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
