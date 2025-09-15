import React from 'react';
import { Image, Text, View, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { theme } from '../theme/theme';

type AvatarProps = {
  username?: string;
  source?: ImageSourcePropType;
  size?: number;
  showName?: boolean;
  onPress?: () => void;
  style?: any;
};

export const Avatar: React.FC<AvatarProps> = ({
  username,
  source = require('../../../public/assets/images/icons/Avatar.png'),
  size = 40,
  showName = false,
  onPress,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container onPress={onPress} accessibilityRole={onPress ? 'button' : undefined} style={[styles.container, style]}>
      <Image source={source} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} />
      {showName ? (
        <Text style={styles.username} numberOfLines={1}>
          {username || 'Usuário'}
        </Text>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: theme.colors.muted, borderWidth: StyleSheet.hairlineWidth, borderColor: '#00000010' },
  username: { marginLeft: 8, fontSize: 16, fontWeight: '600', color: theme.colors.text },
});

