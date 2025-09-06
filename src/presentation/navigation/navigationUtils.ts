import type { NavigationProp } from '@react-navigation/native';

// Reseta o navegador atual para uma única rota.
// Funciona tanto em Stack quanto em Tab, evitando erros de métodos inexistentes.
export function resetToRoute(navigation: NavigationProp<any>, routeName: string, params?: Record<string, any>) {
  try {
    // @ts-ignore - reset existe no NavigationProp em runtime
    if (typeof (navigation as any)?.reset === 'function') {
      (navigation as any).reset({ index: 0, routes: [{ name: routeName, params }] });
      return;
    }
  } catch {}
  // Fallback para navigate caso reset não exista por algum motivo
  try {
    if (typeof (navigation as any)?.navigate === 'function') {
      (navigation as any).navigate(routeName as never, params as never);
    }
  } catch {}
}

export function goToLogin(navigation: NavigationProp<any>) {
  resetToRoute(navigation, 'Login');
}

