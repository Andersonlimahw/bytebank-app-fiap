export class GetInvestments {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(userId) {
        return this.repo.listByUser(userId);
    }
}
