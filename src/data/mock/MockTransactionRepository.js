function seed(userId) {
    const now = new Date();
    return [
        { id: 't1', userId, description: 'Salary', type: 'credit', amount: 500000, createdAt: new Date(now.getFullYear(), now.getMonth(), 1).getTime() },
        { id: 't2', userId, description: 'Groceries', type: 'debit', amount: 8500, createdAt: new Date(now.getFullYear(), now.getMonth(), 3).getTime() },
        { id: 't3', userId, description: 'Coffee', type: 'debit', amount: 450, createdAt: new Date(now.getFullYear(), now.getMonth(), 4).getTime() },
        { id: 't4', userId, description: 'Transfer In', type: 'credit', amount: 12000, createdAt: new Date(now.getFullYear(), now.getMonth(), 6).getTime() },
    ];
}
export class MockTransactionRepository {
    byUser = new Map();
    listeners = new Map();
    ensure(userId) {
        if (!this.byUser.has(userId))
            this.byUser.set(userId, seed(userId));
        return this.byUser.get(userId);
    }
    emit(userId) {
        const set = this.listeners.get(userId);
        if (!set)
            return;
        const txs = [...this.ensure(userId)].sort((a, b) => b.createdAt - a.createdAt);
        set.forEach((cb) => cb(txs));
    }
    async listRecent(userId, limit = 10) {
        const txs = [...this.ensure(userId)].sort((a, b) => b.createdAt - a.createdAt);
        return txs.slice(0, limit);
    }
    async add(tx) {
        const id = 'tx-' + Math.random().toString(36).slice(2);
        const full = { ...tx, id, createdAt: Date.now() };
        const arr = this.ensure(tx.userId);
        arr.unshift(full);
        this.byUser.set(tx.userId, arr);
        this.emit(tx.userId);
        return id;
    }
    async getBalance(userId) {
        const tx = this.ensure(userId);
        return tx.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0);
    }
    async update(id, updates) {
        for (const [userId, list] of this.byUser.entries()) {
            const idx = list.findIndex((t) => t.id === id);
            if (idx >= 0) {
                const current = list[idx];
                const updated = { ...current, ...updates };
                list[idx] = updated;
                this.byUser.set(userId, list);
                this.emit(userId);
                return;
            }
        }
    }
    async remove(id) {
        for (const [userId, list] of this.byUser.entries()) {
            const next = list.filter((t) => t.id !== id);
            if (next.length !== list.length) {
                this.byUser.set(userId, next);
                this.emit(userId);
                return;
            }
        }
    }
    subscribeRecent(userId, limit = 10, cb) {
        const set = this.listeners.get(userId) ?? new Set();
        this.listeners.set(userId, set);
        set.add(cb);
        // fire immediately
        const txs = [...this.ensure(userId)].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
        cb(txs);
        return () => {
            const s = this.listeners.get(userId);
            if (!s)
                return;
            s.delete(cb);
            if (s.size === 0)
                this.listeners.delete(userId);
        };
    }
}
