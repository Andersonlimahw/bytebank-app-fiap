import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDI } from '../../store/diStore';
import { TOKENS } from '../../core/di/container';
import type { Investment } from '../../domain/entities/Investment';
import type { InvestmentRepository } from '../../domain/repositories/InvestmentRepository';
import { useAuth } from '../../store/authStore';
import { GetInvestments } from '../../application/usecases/GetInvestments';

export function useInvestmentsViewModel() {
  const di = useDI();
  const repo = useMemo(() => di.resolve<InvestmentRepository>(TOKENS.InvestmentRepository), [di]);
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getInvestmentsUC = useMemo(() => new GetInvestments(repo), [repo]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const list = await getInvestmentsUC.execute(user.id);
    setInvestments(list);
    setLoading(false);
  }, [getInvestmentsUC, user]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await refresh();
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const total = useMemo(() => investments.reduce((sum, i) => sum + i.amount, 0), [investments]);
  const rendaFixa = useMemo(() => investments.find((i) => i.type === 'Renda Fixa')?.amount ?? 0, [investments]);
  const rendaVariavel = useMemo(() => investments.find((i) => i.type === 'Renda Variável')?.amount ?? 0, [investments]);
  const donutData = useMemo(
    () => [
      { name: 'Fundos de investimento', value: investments.find((i) => i.type === 'Fundos de investimento')?.amount ?? 0 },
      { name: 'Tesouro Direto', value: investments.find((i) => i.type === 'Tesouro Direto')?.amount ?? 0 },
      { name: 'Previdência Privada', value: investments.find((i) => i.type === 'Previdência Privada')?.amount ?? 0 },
      { name: 'Bolsa de Valores', value: investments.find((i) => i.type === 'Bolsa de Valores')?.amount ?? 0 },
    ],
    [investments]
  );

  return { loading, investments, total, rendaFixa, rendaVariavel, donutData, refresh };
}
