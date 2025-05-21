import { create } from "zustand";
import { supabase } from "../config/supabaseClient";
import type {
  AuthTokenResponse,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

type UserState = {
  user: any | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithPassword: (
    credential: SignInWithPasswordCredentials
  ) => Promise<AuthTokenResponse>;
};

export const useUser = create<UserState>((set) => ({
  user: null,
  loading: true,
  fetchUser: async () => {
    set({ loading: true });

    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      set({ user: data.user, loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },
  signInWithPassword: async (credentials: SignInWithPasswordCredentials) => {
    const response = await supabase.auth.signInWithPassword(credentials);

    const { user } = response?.data ?? {};

    if (user) {
      set({ user, loading: false });
    }

    return response;
  },
}));
