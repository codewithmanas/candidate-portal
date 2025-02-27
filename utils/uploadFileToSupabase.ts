import { supabase } from "@/lib/supabase";
import { v4 as uuidv4} from "uuid";

export async function uploadFileToSupabase(file) {
try {

    // Define file path in Supabase Storage
    const filePath = "public/" + uuidv4() + file?.name;
    
    // Upload file to supabase
      const { error } = await supabase.storage
        .from("resume")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })


        if (error) {
            throw new Error(`Supabase upload failed: ${error}`);
        }

        // Generate a public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
            .from("uploads")
            .getPublicUrl(filePath);

        return { resumeUrl: publicUrlData.publicUrl }  // Send public URL back


    } catch (error) {
        console.log("error:", error);
        return null;
    }
}
