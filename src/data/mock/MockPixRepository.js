export class MockPixRepository {
    keys = new Map();
    favorites = new Map();
    transfers = new Map();
    limits = new Map();
    async listKeys(userId) {
        return this.keys.get(userId) ?? [];
    }
    async addKey(userId, type, value) {
        const list = this.keys.get(userId) ?? [];
        const id = 'mock_' + (Math.random() + '').slice(2);
        list.unshift({ id, userId, type, value: value || id, active: true, createdAt: Date.now() });
        this.keys.set(userId, list);
        return id;
    }
    async removeKey(_userId, keyId) {
        for (const [uid, list] of this.keys)
            this.keys.set(uid, list.filter((k) => k.id !== keyId));
    }
    async transferByKey(params) {
        const id = 'tx_' + (Math.random() + '').slice(2);
        const list = this.transfers.get(params.userId) ?? [];
        list.unshift({ id, userId: params.userId, toKey: params.toKey, toName: params.toNameHint, amount: params.amount, description: params.description, status: 'completed', method: 'key', createdAt: Date.now() });
        this.transfers.set(params.userId, list);
        return id;
    }
    async payQr(params) {
        // Simplified: interpret the qr as key|amount|desc
        const [toKey, amountStr, desc] = params.qr.split('|');
        const amount = Number(amountStr) || 0;
        return this.transferByKey({ userId: params.userId, toKey, amount, description: desc });
    }
    async createQrCharge(params) {
        const id = 'qr_' + (Math.random() + '').slice(2);
        const qr = `PIXQR:${encodeURIComponent(JSON.stringify({ v: 1, merchant: params.userId, chargeId: id, amount: params.amount ?? null, description: params.description ?? null }))}`;
        return { id, qr };
    }
    async listFavorites(userId) {
        return this.favorites.get(userId) ?? [];
    }
    async addFavorite(userId, alias, keyValue, name) {
        const id = 'fav_' + (Math.random() + '').slice(2);
        const list = this.favorites.get(userId) ?? [];
        list.unshift({ id, userId, alias, keyValue, name, createdAt: Date.now() });
        this.favorites.set(userId, list);
        return id;
    }
    async removeFavorite(_userId, favoriteId) {
        for (const [uid, list] of this.favorites)
            this.favorites.set(uid, list.filter((f) => f.id !== favoriteId));
    }
    async listTransfers(userId, limit = 20) {
        const list = this.transfers.get(userId) ?? [];
        return list.slice(0, limit);
    }
    async getLimits(userId) {
        return this.limits.get(userId) ?? { userId, dailyLimitCents: 500000, nightlyLimitCents: 100000, perTransferLimitCents: 300000, updatedAt: Date.now() };
    }
    async updateLimits(userId, partial) {
        const cur = await this.getLimits(userId);
        this.limits.set(userId, { ...cur, ...partial, userId, updatedAt: Date.now() });
    }
}
