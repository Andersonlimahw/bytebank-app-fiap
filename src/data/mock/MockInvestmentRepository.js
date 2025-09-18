function seed(userId) {
    // Values mirror contents/angular-project/src/assets/investments.json
    // Amounts converted to cents for consistency with transactions
    return [
        { id: 'i1', userId, type: 'Renda Fixa', amount: 36000_00 },
        { id: 'i2', userId, type: 'Renda Variável', amount: 14000_00 },
        { id: 'i3', userId, type: 'Fundos de investimento', amount: 18000_00 },
        { id: 'i4', userId, type: 'Tesouro Direto', amount: 12000_00 },
        { id: 'i5', userId, type: 'Previdência Privada', amount: 10000_00 },
        { id: 'i6', userId, type: 'Bolsa de Valores', amount: 10000_00 },
    ];
}
export class MockInvestmentRepository {
    byUser = new Map();
    ensure(userId) {
        if (!this.byUser.has(userId))
            this.byUser.set(userId, seed(userId));
        return this.byUser.get(userId);
    }
    async listByUser(userId) {
        return [...this.ensure(userId)];
    }
}
