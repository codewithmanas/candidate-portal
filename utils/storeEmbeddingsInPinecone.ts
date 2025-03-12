import { pineconeClient } from "@/lib/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";


interface VectorType {
  id: string;
  values: number[];
  metadata: {
      text: string;
  };
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace === null) throw new Error("No Namespace value provided.");
  
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
  }

const storeEmbeddingsInPinecone = async (vectors: VectorType[],
    websiteId: string,
    indexName = "candidate-portal",
    host = "https://candidate-portal-lptt09o.svc.aped-4627-b74a.pinecone.io") => {
    const index = pineconeClient.Index(indexName, host);

  
    try {
      // Step 1: Check if the namespace already exists
      const namespaceAlreadyExists = await namespaceExists(index, websiteId);
  
      if (namespaceAlreadyExists) {
        console.log(`Namespace ${websiteId} already exists. Skipping insertion.`);
        return true;
      } else {
        console.log(
          `Namespace ${websiteId} does not exist. Creating namespace...`
        );


  
        // Step 2: If no data exists, insert new embeddings
        const result = await index.namespace(websiteId).upsert(vectors);
        console.log("result: ", result);
        return true;
      }
    } catch (error) {
      console.log("Error storing embeddings in Pinecone:", error);
      return false;
    }
}

export {storeEmbeddingsInPinecone}