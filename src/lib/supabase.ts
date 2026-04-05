import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithEmail = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// Auto-create client on contact
export const autoCreateClient = async (
  email: string,
  name: string,
  message?: string
) => {
  try {
    // First, sign in or create user
    const { data: authData, error: authError } =
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      });

    if (authError) throw authError;

    // Create or update client profile
    const { data, error } = await supabase.from("clients").upsert(
      {
        email,
        name,
        first_message: message,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    );

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
