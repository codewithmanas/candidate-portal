import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY;


if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
