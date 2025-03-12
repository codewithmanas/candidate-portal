// export const splitDataIntoChunks = (text: string, chunkSize: number = 300): string[] => {
//     const words = text.split(" ");
//     const chunks: string[] = [];
  
//     for (let i = 0; i < words.length; i += chunkSize) {
//       chunks.push(words.slice(i, i + chunkSize).join(" "));
//     }
  
//     return chunks;
// }

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const splitDataIntoChunks = async (data: string, chunkSize: number, chunkOverlap: number) => {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });

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
  
    // const output = await splitter.createDocuments([data]);
    // const output = await splitter.splitDocuments(data);
    const output = await splitter.splitText(data + queryText);
  
    return output;
  };