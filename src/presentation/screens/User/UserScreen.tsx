import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Constants from 'expo-constants';
import { useTheme, useThemeActions } from '../../theme/theme';
import { BrandSelector } from '../../components/BrandSelector';
import { makeUserStyles } from './UserScreen.styles';
import { Avatar } from '../../components/Avatar';
import { useAuth } from '../../../store/authStore';
import { useI18n } from '../../i18n/I18nProvider';

export const UserScreen: React.FC<any> = () => {
  const { user } = useAuth();
  const { t, lang, setLang } = useI18n();
  const version = Constants?.expoConfig?.version || Constants?.manifest?.version || '1.0.0';
  const theme = useTheme();
  const { toggleMode } = useThemeActions();
  const styles = useMemo(() => makeUserStyles(theme), [theme]);

  const accountNumber = useMemo(() => {
    const id = user?.id || '000000';
    const numeric = id.replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
    return `${numeric.slice(0, 4)}-${numeric.slice(4)}`;
  }, [user?.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('user.myAccount')}</Text>
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
        <Text style={styles.sectionTitle}>{t('user.info')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('user.userId')}</Text>
            <Text style={styles.value} numberOfLines={1}>{user?.id ?? '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>{t('user.account')}</Text>
            <Text style={styles.value}>{accountNumber}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>{t('user.appVersion')}</Text>
            <Text style={styles.value}>{version}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('user.help')}</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('mailto:suporte@bytebank.app')}>
            <Text style={styles.label}>{t('user.supportContact')}</Text>
            <Text style={styles.link}>{t('user.sendEmail')}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://bytebank.app/ajuda')}>
            <Text style={styles.label}>{t('user.helpCenter')}</Text>
            <Text style={styles.link}>{t('user.open')}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://bytebank.app/privacidade')}>
            <Text style={styles.label}>{t('user.privacy')}</Text>
            <Text style={styles.link}>{t('user.view')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Tema</Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.link}>{theme.mode === 'light' ? 'Claro' : 'Escuro'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Marca</Text>
            <BrandSelector />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('user.language')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setLang('pt')}>
              <Text style={[styles.link, { fontWeight: lang === 'pt' ? '700' : '400' }]}>Português (BR)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => setLang('en')}>
              <Text style={[styles.link, { fontWeight: lang === 'en' ? '700' : '400' }]}>English</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>{theme.logoText} • v{version}</Text>
      </View>
    </ScrollView>
  );
};
