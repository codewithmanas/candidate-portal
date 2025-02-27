import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume") as File;

    if (!resumeFile) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

    console.log("resumeFile: ", resumeFile);

    // Convert to Buffer
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("resume")
      .upload(`uploads/${resumeFile.name}`, fileBuffer, { contentType: "application/pdf" });

    if (error) throw new Error(error.message);

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${data.path}`;

    // Parse PDF Text
    const parsedData = await pdfParse(fileBuffer);

    console.log("ParsedData: ", parsedData);

    return NextResponse.json({
      message: "Resume uploaded and parsed!",
      fileUrl,
      extractedText: parsedData.text,
    });

  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ message: "Failed to parse", error: error }, { status: 500 });
  }
}


// Notes
// We can also use "pdf-lib" to parse pdf files
// import { PDFDocument, rgb } from 'pdf-lib'