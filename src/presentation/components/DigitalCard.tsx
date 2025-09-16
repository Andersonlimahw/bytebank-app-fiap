import React, { useMemo } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import type { DigitalCard } from '../../domain/entities/Card';
import { useTheme } from '../theme/theme';
import { makeDigitalCardStyles } from './DigitalCard.styles';
import { BrandLogo } from './BrandLogo';

type Props = {
  card: Pick<DigitalCard, 'holderName' | 'number' | 'cvv' | 'expiry' | 'brand' | 'nickname'>;
  style?: ViewStyle;
};

export function maskNumber(num: string) {
  const digits = (num || '').replace(/\D/g, '');
  const groups = digits.match(/.{1,4}/g) || [];
  return groups
    .map((g, i) => (i < groups.length - 1 ? g.replace(/\d/g, '•') : g))
    .join(' ');
}

export function deriveBrandFromNumber(num?: string): DigitalCard['brand'] | undefined {
  const digits = (num || '').replace(/\D/g, '');
  if (!digits) return undefined;
  // Basic BIN checks — not exhaustive, good enough for display purposes
  if (/^4\d{12,18}$/.test(digits)) return 'visa';
  if (/^(5[1-5]\d{14}|2(2[2-9]\d{2}|[3-6]\d{3}|7[01]\d{2}|720\d)\d{12})$/.test(digits)) return 'mastercard';
  if (/^3[47]\d{13}$/.test(digits)) return 'amex';
  // Very rough heuristics for Elo/Hipercard (real BINs vary a lot)
  if (/^(4011|4312|4389|4514|4576|5041|5067|5090|6277|6362|650|651|652)/.test(digits)) return 'elo';
  if (/^(606282|3841)/.test(digits)) return 'hipercard';
  return undefined;
}

export const CardVisualView: React.FC<Props> = ({ card, style }) => {
  const theme = useTheme();
  const styles = useMemo(() => makeDigitalCardStyles(theme), [theme]);
  // Prefer explicit brand; otherwise try to infer from number
  const resolvedBrand = useMemo(() => card.brand || deriveBrandFromNumber(card.number) || 'other', [card.brand, card.number]);

  const backgroundStyle = useMemo(() => {
    const base: ViewStyle = { backgroundColor: theme.colors.card };
    switch (resolvedBrand) {
      case 'bytebank':
        return { ...base, backgroundColor: '#0f172a' } as ViewStyle;
      case 'nubank':
        return { ...base, backgroundColor: '#6D28D9' } as ViewStyle;
      case 'oyapal':
        return { ...base, backgroundColor: '#0EA5E9' } as ViewStyle;
      case 'visa':
        return { ...base, backgroundColor: '#0A4595' } as ViewStyle;
      case 'mastercard':
        return { ...base, backgroundColor: '#111827' } as ViewStyle;
      case 'amex':
        return { ...base, backgroundColor: '#0E7C86' } as ViewStyle;
      case 'elo':
        return { ...base, backgroundColor: '#1F2937' } as ViewStyle;
      case 'hipercard':
        return { ...base, backgroundColor: '#7F1D1D' } as ViewStyle;
      default:
        return base;
    }
  }, [resolvedBrand, theme]);

  const brandText = useMemo(() => {
    if (resolvedBrand === 'bytebank') return 'BYTEBANK';
    if (resolvedBrand === 'nubank') return 'NuBank';
    if (resolvedBrand === 'oyapal') return 'OyaPay';
    if (resolvedBrand === 'visa') return 'VISA';
    if (resolvedBrand === 'mastercard') return 'Mastercard';
    if (resolvedBrand === 'amex') return 'AMERICAN EXPRESS';
    if (resolvedBrand === 'elo') return 'Elo';
    if (resolvedBrand === 'hipercard') return 'Hipercard';
    return card.nickname || 'Card';
  }, [resolvedBrand, card.nickname]);

  return (
    <View style={[styles.container, backgroundStyle, style]}
      accessible accessibilityRole="image" accessibilityLabel={`${brandText} ${card.nickname || ''}`.trim()}>
      <View style={[styles.cornerGlow, { top: -40, left: -40, backgroundColor: 'rgba(255,255,255,0.2)' }]} />
      <View style={[styles.cornerGlow, { bottom: -60, right: -60, backgroundColor: 'rgba(255,255,255,0.15)' }]} />

      <View style={styles.row}>
        <View style={styles.chip} />
        <View style={{ alignItems: 'flex-end' }}>
          {/* Prefer compact logo when available; fallback to text */}
          <BrandLogo size={28} style={{ tintColor: '#fff' }} />
          {!!card.nickname && <Text style={styles.nickname}>{card.nickname}</Text>}
        </View>
      </View>

      <View>
        <Text style={styles.number}>{maskNumber(card.number)}</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>CARD HOLDER</Text>
          <Text style={styles.value}>{(card.holderName || '').toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.label}>VALID THRU</Text>
          <Text style={styles.value}>{card.expiry}</Text>
        </View>
        <View>
          <Text style={styles.label}>CVV</Text>
          <Text style={styles.value}>{(card.cvv || '').replace(/\d/g, '•')}</Text>
        </View>
      </View>
    </View>
  );
};

export const CardVisual = React.memo(CardVisualView);
