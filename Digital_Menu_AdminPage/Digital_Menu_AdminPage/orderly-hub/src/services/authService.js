import { supabase } from "../lib/supabaseClient";

export const loginAdmin = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const logoutAdmin = async () => {
  return await supabase.auth.signOut();
};

export const getAdminUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};