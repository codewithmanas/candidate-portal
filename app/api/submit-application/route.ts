import { cleanDataIntoNormalText } from "@/utils/cleanDataIntoNormalText";
import { generateEmbeddingUsingGemini } from "@/utils/generateEmbeddingUsingGemini";
import { splitDataIntoChunks } from "@/utils/splitDataIntoChunks";
import { storeDataToSupabase } from "@/utils/storeDataToSupabase";
import { storeEmbeddingsInPinecone } from "@/utils/storeEmbeddingsInPinecone";
import { uploadFileToSupabase } from "@/utils/uploadFileToSupabase";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";


export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();

    // Extract JSON data from formData
    const name = (formData.get("name") as string);
    const email = (formData.get("email") as string);
    const linkedinUrl = (formData.get("linkedinUrl") as string);
    const skills = (formData.get("skills") as string);
    const experience = (formData.get("experience") as string);

    // Extract file
    const resumeFile = formData.get("resume") as File; // This will be a File object

    // Validate required fields
    if (
      !name ||
      !email ||
      !linkedinUrl ||
      !skills ||
      !experience ||
      !resumeFile
    ) {
      throw new Error("Missing required fields");
    }

    const response = await uploadFileToSupabase(resumeFile);

    if(!response?.resumeUrl) {
        throw new Error("file upload failed");
    }

    // Read the resumeFile as an ArrayBuffer and convert to Buffer
    const buffer = await resumeFile.arrayBuffer();

    const fileBuffer = Buffer.from(buffer);

    // Parse PDF text
    const parsedData = await pdfParse(fileBuffer);

    
    const formDataToStore = {
      name: name,
      email: email,
      linkedin_url: linkedinUrl,
      resume_url: response?.resumeUrl,
      skill: skills,
      experience: experience,
      extracted_text: parsedData.text
    }


    const result = await storeDataToSupabase(formDataToStore);

    if(!result) {
      throw new Error("Failed to store to database");
    }

    // Clean Data
    const cleanData = cleanDataIntoNormalText(parsedData.text);

    // Split Data into chunks
    const chunks = await splitDataIntoChunks(cleanData, 100, 30);

    // Generate Embeddings
    const embeddings =  await generateEmbeddingUsingGemini(chunks);


    // Store to Pinecone Vector Store
    const vectorstoresuccess = await storeEmbeddingsInPinecone(embeddings, result[0].id)

    if (!vectorstoresuccess) {
      throw new Error("Error storing embeddings in Pinecone");
    }


    return NextResponse.json({
      success: true,
      message: "Application received",
      error: null,
      data: { id: result[0].id },
    },
    { status: 201}
  );

} catch (error) {
    console.error("Error processing application:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process application",
        error: error,
        data: null,
      },
      { status: 500 }
    );
  }
}



// Steps
// 1. Get formDatas from frontend
// 2. Upload resume to storage like s3, supabase storage, firebase or cloudinary
// 3. parse the pdf
// 4. store data to database
// 5. 