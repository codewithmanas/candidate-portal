"use server";

import { cleanDataIntoNormalText } from "@/utils/cleanDataIntoNormalText";
import { generateEmbeddingUsingGemini } from "@/utils/generateEmbeddingUsingGemini";
import { generateResponseUsingGemini } from "@/utils/generateResponseUsingGemini";
import { queryPineconeStore } from "@/utils/queryPineconeStore";
import { splitDataIntoChunks } from "@/utils/splitDataIntoChunks";
import { storeEmbeddingsInPinecone } from "@/utils/storeEmbeddingsInPinecone";
import PdfParse from "pdf-parse";


export async function generateEmbeddings(resumeFile: File, docId: string) {

try {
                  // Read the resumeFile as an ArrayBuffer and convert to Buffer
              const buffer = await resumeFile.arrayBuffer();
          
              const fileBuffer = Buffer.from(buffer);
          
              // Parse PDF text
              const parsedData = await PdfParse(fileBuffer);
    
                        // Clean Data
                        const cleanData = cleanDataIntoNormalText(parsedData.text);
    
                        // Split Data into chunks
                        const chunks = await splitDataIntoChunks(cleanData, 100, 30);
                    
                        // Generate Embeddings
                        const embeddings =  await generateEmbeddingUsingGemini(chunks);
                        
                        if(!embeddings) {
                          throw new Error("Error generating embeddings using gemini");
                        }
                    
                    
                        // Store to Pinecone Vector Store
                        const vectorstoresuccess = await storeEmbeddingsInPinecone(embeddings, docId)
                    
                        if (!vectorstoresuccess) {
                          throw new Error("Error storing embeddings in Pinecone");
                        }

                        const queryText = `
                                Analyze the candidate profile and provide:
                            1. Candidate overall score (0-100)
                            2. Technical score (0-100)
                            3. Experience score (0-100)
                            4. Communication score (0-100)
                            5. JobFit score (0-100)
                            6. Summary
                            7. Skill Assessment
                            8. Experience Evaluation
                            9. Recommendations
                            `

                            const pineconeResult = await queryPineconeStore(queryText, docId);
                        
                        
                            if (pineconeResult?.matches.length === 0) {
                              console.log("No data found on pinecone query");
                              // throw new Error("No data found on pinecone query");
                            }
                        
                            const contextText = pineconeResult?.matches.length === 0 ? "" : pineconeResult?.matches
                              .map((match) => match.metadata?.text)
                              .filter(Boolean)
                              .join("\n");


                        const generatedResponse = await generateResponseUsingGemini(contextText as string);

                        if (!generatedResponse) {
                          throw new Error("Error generating response using gemini");
                        }

                        return generatedResponse.response.text();

            } catch (error) {
                console.log("Error Generating Embeddings...", error);
                return false;

            }

}
