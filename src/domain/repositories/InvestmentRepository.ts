import type { Investment } from '../entities/Investment';

export interface InvestmentRepository {
  listByUser(userId: string): Promise<Investment[]>;
}

