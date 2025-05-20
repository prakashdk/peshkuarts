import { create } from "zustand";
import { supabase } from "../config/supabaseClient";

type UserState = {
  user: any | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
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
}));
