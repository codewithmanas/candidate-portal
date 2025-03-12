import { supabase } from "@/lib/supabase";

export async function getStudentDataById(id: string) {
  try {
    const { data, error } = await supabase
      .from("resume_details")
      .select("*")
      .eq("id", id)
      .single(); // This will return a single object, without it data will return an array

    if (error) {
      throw new Error(`${error.code}: ${error.message}`);
    }

    return data;

  } catch (error) {

    console.log("Failed to get student data by id: ", error);
    return null;
  }
}
