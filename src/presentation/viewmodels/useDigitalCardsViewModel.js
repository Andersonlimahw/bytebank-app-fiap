import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDI } from '../../store/diStore';
import { TOKENS } from '../../core/di/container';
import { useAuth } from '../../store/authStore';
export function useDigitalCardsViewModel() {
    const di = useDI();
    const repo = useMemo(() => di.resolve(TOKENS.CardRepository), [di]);
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const refresh = useCallback(async () => {
        if (!user)
            return;
        setLoading(true);
        const list = await repo.listByUser(user.id);
        setCards(list);
        setLoading(false);
    }, [repo, user]);
    const addCard = useCallback(async (input) => {
        const id = await repo.add(input);
        await refresh();
        return id;
    }, [repo, refresh]);
    const updateCard = useCallback(async (id, updates) => {
        await repo.update(id, updates);
        await refresh();
    }, [repo, refresh]);
    const removeCard = useCallback(async (id) => {
        await repo.remove(id);
        await refresh();
    }, [repo, refresh]);
    useEffect(() => {
        if (!user)
            return;
        setLoading(true);
        const unsub = repo.subscribe?.(user.id, (list) => {
            setCards(list);
            setLoading(false);
        });
        if (!unsub) {
            // fallback if repo does not support subscribe
            refresh();
        }
        return () => unsub?.();
    }, [repo, user, refresh]);
    return { cards, loading, refresh, addCard, updateCard, removeCard, user };
}
