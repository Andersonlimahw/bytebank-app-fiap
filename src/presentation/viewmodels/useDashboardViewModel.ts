import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDI } from '@app/store/diStore';
import { TOKENS } from '../../core/di/container';
import type { Transaction, TransactionType } from '../../domain/entities/Transaction';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { useAuth } from '@app/store/authStore';
import { GetRecentTransactions } from '../../application/usecases/GetRecentTransactions';
import { GetBalance } from '../../application/usecases/GetBalance';

export function useDashboardViewModel() {
  const di = useDI();
  const txRepo = useMemo(() => di.resolve<TransactionRepository>(TOKENS.TransactionRepository), [di]);
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const getRecentUC = useMemo(() => new GetRecentTransactions(txRepo), [txRepo]);
  const getBalanceUC = useMemo(() => new GetBalance(txRepo), [txRepo]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [txs, bal] = await Promise.all([
      getRecentUC.execute(user.id, 5),
      getBalanceUC.execute(user.id),
    ]);
    setTransactions(txs);
    setBalance(bal);
    setLoading(false);
  }, [getRecentUC, getBalanceUC, user]);

  const addDemoTx = useCallback(
    async (type: TransactionType) => {
      if (!user) return;
      const cents = Math.floor(Math.random() * 5000) + 500; // between 5.00 and 55.00
      const description = type === 'credit' ? 'Crédito demo' : 'Débito demo';
      await txRepo.add({ userId: user.id, type, amount: cents, description } as any);
      await refresh();
    },
    [txRepo, user, refresh]
  );

  const addDemoCredit = useCallback(() => addDemoTx('credit'), [addDemoTx]);
  const addDemoDebit = useCallback(() => addDemoTx('debit'), [addDemoTx]);

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

  return { user, loading, transactions, balance, refresh, addDemoCredit, addDemoDebit };
}
