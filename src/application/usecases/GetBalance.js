export class GetBalance {
    txRepo;
    constructor(txRepo) {
        this.txRepo = txRepo;
    }
    execute(userId) {
        return this.txRepo.getBalance(userId);
    }
}
