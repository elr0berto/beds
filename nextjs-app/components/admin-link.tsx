"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cog } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin } from "@/lib/roles";
import type { User } from "@supabase/supabase-js";

export function AdminLink() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't render anything while loading or if no user
  if (isLoading || !user) {
    return null;
  }

  const userIsAdmin = isAdmin(user);

  return userIsAdmin ? (
    <Link
      href="/admin/beds"
      aria-label="Admin beds"
      data-testid="admin-beds-link"
      className="hover:opacity-80 transition-opacity"
    >
      <Cog className="w-5 h-5" />
    </Link>
  ) : (
    <span
      aria-label="Admin beds (disabled)"
      data-testid="admin-beds-link"
      className="opacity-50 cursor-not-allowed"
    >
      <Cog className="w-5 h-5" />
    </span>
  );
}