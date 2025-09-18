export class GetRecentTransactions {
    txRepo;
    constructor(txRepo) {
        this.txRepo = txRepo;
    }
    execute(userId, limit = 10) {
        return this.txRepo.listRecent(userId, limit);
    }
}
