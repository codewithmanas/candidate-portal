import { pineconeClient } from "@/lib/pinecone";
import { generateEmbeddingUsingGemini } from "./generateEmbeddingUsingGemini";

if(!process.env.PINECONE_INDEX_NAME) {
    throw new Error("PINECONE_INDEX_NAME is not set");
}

const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME);


export async function queryPineconeStore(queryText: string, websiteId: string) {

    try {
      const queryEmbedding = await generateEmbeddingUsingGemini([queryText]);
  
      const response = await pineconeIndex.namespace(websiteId).query({
        vector: queryEmbedding[0].values,
        topK: 5,
        includeMetadata: true,
      });
  
      // Ensure embedding matches the correct vector dimension (e.g., 768)
      if (queryEmbedding[0].values.length !== 768) {
        throw new Error(
          `Invalid embedding dimension: ${queryEmbedding[0].values.length}`
        );
      }
  
      return response;
      
    } catch (error) {
      console.log(error);
      return null;
    }

}