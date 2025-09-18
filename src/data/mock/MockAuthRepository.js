const demoUser = {
    id: 'demo-user-1',
    name: 'Demo User',
    email: 'demo@bytebank.app',
    photoUrl: undefined,
};
export class MockAuthRepository {
    user = demoUser; // start logged-in for convenience
    async getCurrentUser() {
        return this.user;
    }
    onAuthStateChanged(cb) {
        // Mock: no live events; just return noop and keep last state
        cb(this.user);
        return () => { };
    }
    async signIn(provider, options) {
        if (provider === 'anonymous') {
            this.user = { id: 'anon-' + Date.now().toString(36), name: 'Anonymous' };
            return this.user;
        }
        if (provider === 'password') {
            const name = options?.email?.split('@')[0] || 'User';
            this.user = { id: 'pwd-' + Date.now().toString(36), name, email: options?.email };
            return this.user;
        }
        // For other providers, just emulate a successful login
        this.user = { id: provider + '-' + Date.now().toString(36), name: provider.toUpperCase() + ' User' };
        return this.user;
    }
    async signOut() {
        this.user = null;
    }
    async signUp(options) {
        const name = options.email.split('@')[0] || 'User';
        this.user = { id: 'new-' + Date.now().toString(36), name, email: options.email };
        return this.user;
    }
}
