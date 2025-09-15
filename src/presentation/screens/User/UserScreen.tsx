import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Constants from 'expo-constants';
import { userStyles as styles } from './UserScreen.styles';
import { Avatar } from '../../components/Avatar';
import { useAuth } from '../../../store/authStore';

export const UserScreen: React.FC<any> = () => {
  const { user } = useAuth();
  const version = Constants?.expoConfig?.version || Constants?.manifest?.version || '1.0.0';

  const accountNumber = useMemo(() => {
    const id = user?.id || '000000';
    const numeric = id.replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
    return `${numeric.slice(0, 4)}-${numeric.slice(4)}`;
  }, [user?.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Conta</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <Avatar username={user?.name} size={56} />
            <View style={styles.nameBlock}>
              <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.sub}>{user?.email || 'Sem e-mail'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>ID do usuário</Text>
            <Text style={styles.value} numberOfLines={1}>{user?.id ?? '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Conta</Text>
            <Text style={styles.value}>{accountNumber}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Versão do app</Text>
            <Text style={styles.value}>{version}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ajuda</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('mailto:suporte@bytebank.app')}>
            <Text style={styles.label}>Contato do suporte</Text>
            <Text style={styles.link}>Enviar e-mail</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://bytebank.app/ajuda')}>
            <Text style={styles.label}>Central de ajuda</Text>
            <Text style={styles.link}>Abrir</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://bytebank.app/privacidade')}>
            <Text style={styles.label}>Privacidade e segurança</Text>
            <Text style={styles.link}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>ByteBank • v{version}</Text>
      </View>
    </ScrollView>
  );
};

