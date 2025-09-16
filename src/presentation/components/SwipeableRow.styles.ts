import { StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const swipeableRowStyles = StyleSheet.create({
  wrapper: { width: '100%', overflow: 'hidden' },
  actions: { position: 'absolute', right: 0, top: 0, bottom: 0, flexDirection: 'row' },
  actionBtn: { width: 72, alignItems: 'center', justifyContent: 'center' },
});
