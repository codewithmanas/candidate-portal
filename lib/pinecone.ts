import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set');
}

const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY    
});

// const index = pineconeClient.index(PINECONE_INDEX_NAME);

export { pineconeClient };
