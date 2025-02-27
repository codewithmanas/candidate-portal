// export const splitDataIntoChunks = (text: string, chunkSize: number = 300): string[] => {
//     const words = text.split(" ");
//     const chunks: string[] = [];
  
//     for (let i = 0; i < words.length; i += chunkSize) {
//       chunks.push(words.slice(i, i + chunkSize).join(" "));
//     }
  
//     return chunks;
// }

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const splitDataIntoChunks = async (data, chunkSize, chunkOverlap) => {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });
  
    // const output = await splitter.createDocuments([data]);
    // const output = await splitter.splitDocuments(data);
    const output = await splitter.splitText(data);
  
    return output;
  };