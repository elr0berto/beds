'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  
  // Revalidate all paths to clear any cached auth state
  revalidatePath('/', 'layout');
  
  redirect('/auth/login');
}

export async function loginAction(username: string, password: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email: username + "@beds.app.user",
    password,
  });
  
  if (error) {
    throw error;
  }
  
  // Revalidate all paths to pick up new auth state
  revalidatePath('/', 'layout');
  
  redirect('/');
}