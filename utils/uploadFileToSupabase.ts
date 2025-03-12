"use server";

import { supabase } from "@/lib/supabase";
import { v4 as uuidv4} from "uuid";

export async function uploadFileToSupabase(file: File) {
try {

    // console.log("File to upload :", file);

    // Define file path in Supabase Storage
    // const filePath = "upload/";
    const filePath = "public/" + uuidv4() + file?.name;
    
    // Upload file to supabase
      const { data, error } = await supabase.storage
        .from("resume")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if(data) {
            console.log("fileData", data);
        } else {
            throw new Error(`Supabase upload failed: ${error.message}`);

        }


        // if (error) {
        //     throw new Error(`Supabase upload failed: ${error.message}`);
        // }

        // Generate a public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
            .from("resume")
            .getPublicUrl(filePath);

        return { resumeUrl: publicUrlData.publicUrl }  // Send public URL back


    } catch (error) {
        console.log("error:", error);
        return null;
    }
}
