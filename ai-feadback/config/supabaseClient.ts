// ai-feedback/config/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
//npm install @supabase/supabase-jsを実行してからimportすること


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
