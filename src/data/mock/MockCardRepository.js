function seed(userId) {
    const now = Date.now();
    return [
        {
            id: 'c1',
            userId,
            holderName: 'BYTE USER',
            number: '4111111111111111',
            cvv: '123',
            expiry: '12/27',
            brand: 'bytebank',
            nickname: 'Byte Digital',
            createdAt: now - 1000 * 60 * 60 * 24 * 60,
        },
        {
            id: 'c2',
            userId,
            holderName: 'BYTE USER',
            number: '5555444433331111',
            cvv: '999',
            expiry: '08/29',
            brand: 'nubank',
            nickname: 'Nu',
            createdAt: now - 1000 * 60 * 60 * 24 * 30,
        },
    ];
}
export class MockCardRepository {
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
        const items = [...this.ensure(userId)].sort((a, b) => b.createdAt - a.createdAt);
        set.forEach((cb) => cb(items));
    }
    async listByUser(userId) {
        return [...this.ensure(userId)].sort((a, b) => b.createdAt - a.createdAt);
    }
    async add(card) {
        const id = 'card-' + Math.random().toString(36).slice(2);
        const full = { ...card, id, createdAt: Date.now() };
        const arr = this.ensure(card.userId);
        arr.unshift(full);
        this.byUser.set(card.userId, arr);
        this.emit(card.userId);
        return id;
    }
    async update(id, updates) {
        for (const [userId, list] of this.byUser.entries()) {
            const idx = list.findIndex((c) => c.id === id);
            if (idx >= 0) {
                list[idx] = { ...list[idx], ...updates, updatedAt: Date.now() };
                this.byUser.set(userId, list);
                this.emit(userId);
                return;
            }
        }
    }
    async remove(id) {
        for (const [userId, list] of this.byUser.entries()) {
            const next = list.filter((c) => c.id !== id);
            if (next.length !== list.length) {
                this.byUser.set(userId, next);
                this.emit(userId);
                return;
            }
        }
    }
    subscribe(userId, cb) {
        const set = this.listeners.get(userId) ?? new Set();
        this.listeners.set(userId, set);
        set.add(cb);
        cb([...this.ensure(userId)].sort((a, b) => b.createdAt - a.createdAt));
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
