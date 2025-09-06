export type InvestmentCategory =
  | 'Renda Fixa'
  | 'Renda Variável'
  | 'Fundos de investimento'
  | 'Tesouro Direto'
  | 'Previdência Privada'
  | 'Bolsa de Valores';

export type Investment = {
  id: string;
  userId: string;
  type: InvestmentCategory;
  amount: number; // cents
};

