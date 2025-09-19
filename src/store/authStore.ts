import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "../domain/entities/User";
import type { AuthRepository } from "../domain/repositories/AuthRepository";
import type { AuthProvider } from "../domain/entities/AuthProvider";

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { TOKENS } from "../core/di/container";
import { useDIStore } from "./diStore";

GoogleSignin.configure({
  iosClientId: '102802199932-3c8av88ho09numo7u87evflujm83v3sn.apps.googleusercontent.com',
});

type AuthState = {
  user: User | null | undefined; // undefined while initializing
  loading: boolean;
  signIn: (
    provider: AuthProvider,
    options?: { email?: string; password?: string }
  ) => Promise<void>;
  signUp: (options: { email: string; password: string }) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
};

let initialized = false;
let unsubscribe: (() => void) | undefined;

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: undefined,
    loading: true,
    async signIn(
      provider: AuthProvider,
      options?: { email?: string; password?: string }
    ) {
      const repo = useDIStore
        .getState()
        .di.resolve<AuthRepository>(TOKENS.AuthRepository);
      set({ loading: true });
      try {
        console.log("[Firebase]: GoogleSignin.hasPlayServices : Init");
        // await repo.signIn(provider, options);
        // const u = await repo.getCurrentUser();
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        console.log("[Firebase]: GoogleSignin.hasPlayServices : Response -> ", {
          response,
        });
        if(response.user) {
          // await repo.signIn("google", { email: response.user.email });
          // const u = await repo.getCurrentUser();
          set({ user: response.user });
          console.log("[Firebase]: GoogleSignin.hasPlayServices : Response User -> ", {
            user: response.user,
          });
        }
      } catch (e: any) {
        console.error("[Firebase]: GoogleSignin.hasPlayServices : Error -> ", {       
          message: e.message,
          code: e.code,
          error: e,
        });
      }
      finally {
        set({ loading: false });
      }
    },
    async signUp(options: { email: string; password: string }) {
      const repo = useDIStore
        .getState()
        .di.resolve<AuthRepository>(TOKENS.AuthRepository);
      set({ loading: true });
      try {
        await repo.signUp(options);
        const u = await repo.getCurrentUser();
        set({ user: u });
      } finally {
        set({ loading: false });
      }
    },
    async signInAnonymously() {
      const repo = useDIStore
        .getState()
        .di.resolve<AuthRepository>(TOKENS.AuthRepository);
      set({ loading: true });
      try {
        await repo.signIn("anonymous");
        const u = await repo.getCurrentUser();
        set({ user: u });
      } finally {
        set({ loading: false });
      }
    },
    async signOut() {
      const repo = useDIStore
        .getState()
        .di.resolve<AuthRepository>(TOKENS.AuthRepository);
      set({ loading: true });
      try {
        await repo.signOut();
        set({ user: null });
      } finally {
        set({ loading: false });
      }
    },
  }))
);

export async function initAuthStore() {
  if (initialized) return;
  initialized = true;
  const repo = useDIStore
    .getState()
    .di.resolve<AuthRepository>(TOKENS.AuthRepository);
  try {
    const u = await repo.getCurrentUser();
    useAuthStore.setState({ user: u });
  } finally {
    useAuthStore.setState({ loading: false });
    unsubscribe = repo.onAuthStateChanged((u: User | null) => {
      try {
        useAuthStore.setState({ user: u });
      } catch (error) {
        console.error("[authStore] Failed to handle auth state change:", error);
      }
    });
  }
}

export function teardownAuthStore() {
  if (unsubscribe) unsubscribe();
  unsubscribe = undefined;
  initialized = false;
}

// Convenience typed selector hook, Redux-like ergonomics
export function useAuth() {
  type S = ReturnType<typeof useAuthStore.getState>;
  const user = useAuthStore((s: S) => s.user);
  const loading = useAuthStore((s: S) => s.loading);
  const signIn = useAuthStore((s: S) => s.signIn);
  const signUp = useAuthStore((s: S) => s.signUp);
  const signInAnonymously = useAuthStore((s: S) => s.signInAnonymously);
  const signOut = useAuthStore((s: S) => s.signOut);
  return { user, loading, signIn, signUp, signInAnonymously, signOut } as const;
}
