import { GoogleGenerativeAI } from "@google/generative-ai";

if(!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export const generateEmbeddingUsingGemini = async (queryTextArray: string[]) => {


        // Generate embeddings for each chunk
        const model = genAI.getGenerativeModel({ model: "embedding-001" });

        const embeddings = await Promise.all(
            queryTextArray.map(async (chunk, index) => {

            const cleanedText =  chunk
            .replace(/\n+/g, " ") // Remove excessive newlines
            .replace(/\s+/g, " ") // Normalize spaces
            .trim()
          

            const response = await model.embedContent({
                content: { role: "user", parts: [{ text: cleanedText }] }, // Correct structure
              });

            // console.log("Embedding response:", response);

            return {
              id: `chunks-${index}`, // Unique ID for each chunk
              values: Array.from(response.embedding.values), // Embedding array, // Ensure it's an array
              metadata: { text: cleanedText }, // Store original chunk text
            };
          })
        );

        return embeddings;
}



