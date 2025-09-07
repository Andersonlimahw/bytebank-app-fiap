import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDI } from '@app/store/diStore';
import { TOKENS } from '../../core/di/container';
import type { Transaction } from '../../domain/entities/Transaction';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { useAuth } from '@app/store/authStore';

export function useExtractViewModel() {
  const di = useDI();
  const repo = useMemo(() => di.resolve<TransactionRepository>(TOKENS.TransactionRepository), [di]);
  const { user } = useAuth();

  const [all, setAll] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const list = await repo.listRecent(user.id, 100);
    setAll(list);
    setLoading(false);
  }, [repo, user]);

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

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFiltered(all);
      return;
    }
    const result = all.filter((t) => {
      const amountStr = (t.amount / 100).toFixed(2);
      const date = new Date(t.createdAt);
      const dateStr = date.toLocaleDateString('pt-BR');
      const monthStr = date.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
      return (
        t.type.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        amountStr.includes(term) ||
        dateStr.includes(term) ||
        monthStr.includes(term)
      );
    });
    setFiltered(result);
  }, [all, search]);

  return { loading, transactions: filtered, search, setSearch, refresh };
}
