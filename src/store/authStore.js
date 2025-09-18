import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TOKENS } from '../core/di/container';
import { useDIStore } from './diStore';
let initialized = false;
let unsubscribe;
export const useAuthStore = create()(devtools((set) => ({
    user: undefined,
    loading: true,
    async signIn(provider, options) {
        const repo = useDIStore.getState().di.resolve(TOKENS.AuthRepository);
        set({ loading: true });
        try {
            await repo.signIn(provider, options);
            const u = await repo.getCurrentUser();
            set({ user: u });
        }
        finally {
            set({ loading: false });
        }
    },
    async signUp(options) {
        const repo = useDIStore.getState().di.resolve(TOKENS.AuthRepository);
        set({ loading: true });
        try {
            await repo.signUp(options);
            const u = await repo.getCurrentUser();
            set({ user: u });
        }
        finally {
            set({ loading: false });
        }
    },
    async signInAnonymously() {
        const repo = useDIStore.getState().di.resolve(TOKENS.AuthRepository);
        set({ loading: true });
        try {
            await repo.signIn('anonymous');
            const u = await repo.getCurrentUser();
            set({ user: u });
        }
        finally {
            set({ loading: false });
        }
    },
    async signOut() {
        const repo = useDIStore.getState().di.resolve(TOKENS.AuthRepository);
        set({ loading: true });
        try {
            await repo.signOut();
            set({ user: null });
        }
        finally {
            set({ loading: false });
        }
    },
})));
export async function initAuthStore() {
    if (initialized)
        return;
    initialized = true;
    const repo = useDIStore.getState().di.resolve(TOKENS.AuthRepository);
    try {
        const u = await repo.getCurrentUser();
        useAuthStore.setState({ user: u });
    }
    finally {
        useAuthStore.setState({ loading: false });
        unsubscribe = repo.onAuthStateChanged((u) => useAuthStore.setState({ user: u }));
    }
}
export function teardownAuthStore() {
    if (unsubscribe)
        unsubscribe();
    unsubscribe = undefined;
    initialized = false;
}
// Convenience typed selector hook, Redux-like ergonomics
export function useAuth() {
    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);
    const signIn = useAuthStore((s) => s.signIn);
    const signUp = useAuthStore((s) => s.signUp);
    const signInAnonymously = useAuthStore((s) => s.signInAnonymously);
    const signOut = useAuthStore((s) => s.signOut);
    return { user, loading, signIn, signUp, signInAnonymously, signOut };
}
