export class SignInWithProvider {
    authRepo;
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    execute(provider, options) {
        return this.authRepo.signIn(provider, options);
    }
}
