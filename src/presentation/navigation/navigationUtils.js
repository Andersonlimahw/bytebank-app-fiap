// Reseta o navegador atual para uma única rota.
// Funciona tanto em Stack quanto em Tab, evitando erros de métodos inexistentes.
export function resetToRoute(navigation, routeName, params) {
    try {
        // @ts-ignore - reset existe no NavigationProp em runtime
        if (typeof navigation?.reset === 'function') {
            navigation.reset({ index: 0, routes: [{ name: routeName, params }] });
            return;
        }
    }
    catch { }
    // Fallback para navigate caso reset não exista por algum motivo
    try {
        if (typeof navigation?.navigate === 'function') {
            navigation.navigate(routeName, params);
        }
    }
    catch { }
}
export function goToLogin(navigation) {
    resetToRoute(navigation, 'Login');
}
