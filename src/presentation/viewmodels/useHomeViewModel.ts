import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDI } from '../providers/AppProviders';
import { TOKENS } from '../../core/di/container';
import type { Transaction } from '../../domain/entities/Transaction';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { useAuthViewModel } from './useAuthViewModel';

export function useHomeViewModel() {
  const di = useDI();
  const txRepo = useMemo(() => di.resolve<TransactionRepository>(TOKENS.TransactionRepository), [di]);
  const { user } = useAuthViewModel();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [txs, bal] = await Promise.all([
      txRepo.listRecent(user.id, 10),
      txRepo.getBalance(user.id)
    ]);
    setTransactions(txs);
    setBalance(bal);
    setLoading(false);
  }, [txRepo, user]);

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

  return { loading, transactions, balance, refresh };
}
