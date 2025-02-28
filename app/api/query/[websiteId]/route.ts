import { supabase } from "@/lib/supabase";
import { generateResponseUsingGemini } from "@/utils/generateResponseUsingGemini";
import { queryPineconeStore } from "@/utils/queryPineconeStore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
    try {
        const websiteId = (await params).websiteId;

        const { queryText } = await req.json();

        console.log("queryText : ", queryText);

        // Fetch Data from DB by websiteId
        const { data: candidateData, error } = await supabase
            .from("resume_details")
            .select("*")
            .eq("id", websiteId)
            .single();

        if (error) {
            console.error("Error fetching data:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to fetch data",
                    error: error,
                    data: null,
                },
                { status: 500 }
            );
        }

        if (!candidateData) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Website not found",
                    error: null,
                    data: null,
                },
                { status: 404 }
            );
        }

        // console.log("candidateData: ", candidateData);


        const result = await queryPineconeStore(queryText, websiteId);

        if (result.matches.length === 0) {
            return NextResponse.json({ error: "No data found" });
          }
        
          const contextText = result.matches
            .map((match) => match.metadata?.text)
            .filter(Boolean)
            .join("\n");

        
        // console.log("contextText: ", contextText);

        const response = await generateResponseUsingGemini(contextText, queryText, candidateData);

        if (!response) {
          return NextResponse.json({ error: "Error generating response" }); 
        
        }
      
        console.log("response: ", response.response.text());




        
            return NextResponse.json({
                success: true,
                message: "Website created successfully",
                error: null,
                data: { id: websiteId, response: response.response.text() },
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


{
    
}
