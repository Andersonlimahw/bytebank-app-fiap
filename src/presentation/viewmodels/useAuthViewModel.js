import { useAuth } from '../../store/authStore';
// Backwards-compatible viewmodel wrapper over Zustand store
export function useAuthViewModel() {
    const { user, loading, signIn, signUp, signOut } = useAuth();
    return {
        initializing: loading,
        user,
        signIn: (provider, options) => signIn(provider, options),
        signOut,
        signUp,
    };
}
