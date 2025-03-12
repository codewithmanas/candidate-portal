import { NextRequest, NextResponse } from "next/server";
import { queryPineconeStore } from "@/utils/queryPineconeStore";
import { generateResponseUsingGemini } from "@/utils/generateResponseUsingGemini";
import { getStudentDataById } from "@/utils/getStudentDataById";

export const maxDuration = 60;


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {

    const { websiteId } = await params;
    const { queryText } = await req.json();

    if(!websiteId) {
      throw new Error("Missing websiteId");
    }

    if(!queryText) {
        throw new Error("Missing queryText");
    }


    // console.time("Sequential Execution");

    // Fetch Supabase and Pinecone data in parallel
    // const [candidateData, pineconeResult] = await Promise.all([
    //     getStudentDataById(websiteId),
    //     queryPineconeStore(queryText, websiteId)
    // ])

    // console.timeLog("Sequential Execution", "first");
    // console.timeLog("Sequential Execution", "second");
    // console.timeEnd("Sequential Execution");


    // Fetch Data from DB by websiteId
    const candidateData =  await getStudentDataById(websiteId);

    if(!candidateData) {
        return NextResponse.json(
            {
            success: false,
            message: "Student Details not found",
            error: null,
            data: null,
            },
            { status: 404 }
        );
    }
    
    const pineconeResult = await queryPineconeStore(queryText, websiteId);


    if (pineconeResult?.matches.length === 0) {
      return NextResponse.json({ error: "No data found" });
    }

    const contextText = pineconeResult?.matches
      .map((match) => match.metadata?.text)
      .filter(Boolean)
      .join("\n");


    const response = await generateResponseUsingGemini(
      contextText!,
    );

    if (!response) {
      return NextResponse.json({ error: "Error generating response" });
    }

    console.log("response: ", response.response.text());

    return NextResponse.json(
      {
        success: true,
        message: "Website created successfully",
        error: null,
        data: { id: websiteId, response: response.response.text() },
      },
      { status: 201 }
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

{
}
