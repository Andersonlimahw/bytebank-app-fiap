export class Container {
    registry = new Map();
    set(token, value) {
        this.registry.set(token, value);
    }
    get(token) {
        if (!this.registry.has(token)) {
            throw new Error(`DI: token not registered: ${String(token)}`);
        }
        return this.registry.get(token);
    }
}
export const TOKENS = {
    AuthRepository: Symbol('AuthRepository'),
    TransactionRepository: Symbol('TransactionRepository'),
    InvestmentRepository: Symbol('InvestmentRepository'),
    PixRepository: Symbol('PixRepository'),
    CardRepository: Symbol('CardRepository'),
};
export function createDI(container) {
    return {
        resolve(token) {
            return container.get(token);
        },
    };
}
