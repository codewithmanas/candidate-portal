import { supabase } from "@/lib/supabase";

export async function getStudentDataById(id: string) {
try {
        const { data, error } = await supabase
        .from('resume_details')
        .select()
        .eq('id', id);

        if(error) {
            throw new Error("store data failed");
        }

        return data[0];

    } catch (error) {
        console.log("error:", error);
        return null;
    }
}