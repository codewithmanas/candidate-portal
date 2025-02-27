import { supabase } from "@/lib/supabase";

export async function storeDataToSupabase(formData) {
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