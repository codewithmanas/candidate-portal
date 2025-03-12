"use server";

import { supabase } from "@/lib/supabase";

interface formDataProps  {
    name: string,
    email: string,
    linkedin_url: string,
    resume_url: string,
    skill: string,
    experience: string,
    // extracted_text: string
  }

export async function storeDataToSupabase(formData: formDataProps ) {
try {
        const { data, error } = await supabase
        .from('resume_details')
        .insert(formData)
        .select()

        if(error) {
            throw new Error("store data failed");
        }

        return data;

    } catch (error) {
        console.log("error:", error);
        return null;
    }
}