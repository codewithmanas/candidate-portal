
import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export const generateEmbeddingUsingGemini = async (textArray: string[]) => {



        // Step 2: Generate embeddings for each chunk
        const model = genAI.getGenerativeModel({ model: "embedding-001" });

        const embeddings = await Promise.all(
            textArray.map(async (chunk, index) => {

            const cleanedText =  chunk
            .replace(/\n+/g, " ") // Remove excessive newlines
            .replace(/\s+/g, " ") // Normalize spaces
            .trim()
          

            const response = await model.embedContent({
                content: { role: "user", parts: [{ text: cleanedText }] }, // Correct structure
              });


            return {
              id: `chunks-${index}`, // Unique ID for each chunk
              values: Array.from(response.embedding.values), // Embedding array, // Ensure it's an array
              metadata: { text: cleanedText }, // Store original chunk text
            };
          })
        );

        return embeddings;
}



