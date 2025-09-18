export class SignOut {
    authRepo;
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    execute() {
        return this.authRepo.signOut();
    }
}
