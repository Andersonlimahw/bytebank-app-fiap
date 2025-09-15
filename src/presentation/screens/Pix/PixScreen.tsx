import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Alert, Share } from 'react-native';
import { pixStyles as styles } from './PixScreen.styles';
import { usePixViewModel } from '../../viewmodels/usePixViewModel';
import { formatCurrency } from '../../../utils/format';

type Section = 'send' | 'payqr' | 'receive' | 'keys' | 'favorites' | 'history' | 'limits';

export const PixScreen: React.FC<any> = () => {
  const {
    loading,
    error,
    keys,
    favorites,
    transfers,
    limits,
    sendByKey,
    payQr,
    createQr,
    addKey,
    removeKey,
    addFav,
    removeFav,
    updateLimits,
    refresh,
  } = usePixViewModel();

  const [section, setSection] = useState<Section>('send');
  const [send, setSend] = useState({ key: '', amount: '', desc: '' });
  const [qrInput, setQrInput] = useState('');
  const [receive, setReceive] = useState({ amount: '', desc: '', generated: '' });
  const [newFav, setNewFav] = useState({ alias: '', key: '', name: '' });
  const [newKey, setNewKey] = useState<{ type: 'email' | 'phone' | 'cpf' | 'random'; value?: string }>({ type: 'random' });
  const [limitsEdit, setLimitsEdit] = useState<{ daily?: string; nightly?: string; per?: string }>({});

  const loadingText = useMemo(() => (loading ? 'Carregando...' : ''), [loading]);

  const handleSend = async () => {
    const amountCents = Math.round(parseFloat((send.amount || '0').replace(',', '.')) * 100);
    if (!send.key || !amountCents) return Alert.alert('Dados inválidos', 'Informe chave e valor.');
    try {
      await sendByKey(send.key.trim(), amountCents, send.desc || undefined);
      setSend({ key: '', amount: '', desc: '' });
      Alert.alert('PIX enviado', 'Transferência realizada com sucesso.');
    } catch (e: any) {
      Alert.alert('Erro no PIX', e?.message || 'Não foi possível enviar o PIX.');
    }
  };

  const handlePayQr = async () => {
    if (!qrInput) return Alert.alert('Informe o QR', 'Cole o conteúdo do QR.');
    try {
      await payQr(qrInput.trim());
      setQrInput('');
      Alert.alert('PIX pago', 'Pagamento do QR realizado.');
    } catch (e: any) {
      Alert.alert('Erro no pagamento', e?.message || 'Não foi possível pagar o QR.');
    }
  };

  const handleGenerateQr = async () => {
    const amountCents = receive.amount ? Math.round(parseFloat(receive.amount.replace(',', '.')) * 100) : undefined;
    const { qr } = await createQr(amountCents, receive.desc || undefined);
    setReceive((s) => ({ ...s, generated: qr }));
  };

  const applyLimits = async () => {
    const daily = limitsEdit.daily ? Math.round(parseFloat(limitsEdit.daily.replace(',', '.')) * 100) : undefined;
    const nightly = limitsEdit.nightly ? Math.round(parseFloat(limitsEdit.nightly.replace(',', '.')) * 100) : undefined;
    const per = limitsEdit.per ? Math.round(parseFloat(limitsEdit.per.replace(',', '.')) * 100) : undefined;
    try {
      await updateLimits({
        dailyLimitCents: daily,
        nightlyLimitCents: nightly,
        perTransferLimitCents: per,
      });
      setLimitsEdit({});
      Alert.alert('Limites atualizados');
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Não foi possível atualizar os limites');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Ações PIX</Text>
      <TouchableOpacity onPress={refresh} style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
        <Text style={styles.meta}>Atualizar</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
        {(
          [
            ['send', 'Transferir'],
            ['payqr', 'Pagar QR'],
            ['receive', 'Receber'],
            ['keys', 'Minhas chaves'],
            ['favorites', 'Favoritos'],
            ['history', 'Extrato PIX'],
            ['limits', 'Limites'],
          ] as [Section, string][]
        ).map(([id, label], idx) => (
          <TouchableOpacity key={id} style={[styles.action, idx > 0 && styles.actionGap, section === id && { borderWidth: 2, borderColor: '#4F46E5' }]}
            onPress={() => setSection(id)} accessibilityRole="button" accessibilityLabel={label}>
            <Text style={styles.actionLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {!!error && (
        <View style={[styles.card, { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }]}>
          <Text style={{ color: '#991B1B' }}>{error}</Text>
        </View>
      )}

      {section === 'send' && (
        <View style={styles.card}>
          <Text style={{ fontWeight: '600' }}>Transferir via chave</Text>
          <TextInput placeholder="Chave (e-mail, telefone, CPF/CNPJ ou aleatória)" value={send.key} onChangeText={(t) => setSend((s) => ({ ...s, key: t }))} style={styles.input} autoCapitalize="none" />
          <TextInput placeholder="Valor (ex: 25,90)" value={send.amount} onChangeText={(t) => setSend((s) => ({ ...s, amount: t }))} style={styles.input} keyboardType="decimal-pad" />
          <TextInput placeholder="Descrição (opcional)" value={send.desc} onChangeText={(t) => setSend((s) => ({ ...s, desc: t }))} style={styles.input} />
          <TouchableOpacity style={styles.btn} onPress={handleSend} accessibilityRole="button"><Text style={styles.btnText}>Enviar PIX</Text></TouchableOpacity>
          {!!loadingText && <Text style={styles.meta}>{loadingText}</Text>}
        </View>
      )}

      {section === 'payqr' && (
        <View style={styles.card}>
          <Text style={{ fontWeight: '600' }}>Pagar QR</Text>
          <Text style={styles.meta}>Cole aqui o conteúdo do QR (payload)</Text>
          <TextInput placeholder="PIXQR:... ou chave|valor|descrição" value={qrInput} onChangeText={setQrInput} style={[styles.input, { height: 100 }]} multiline />
          <TouchableOpacity style={styles.btn} onPress={handlePayQr} accessibilityRole="button"><Text style={styles.btnText}>Pagar</Text></TouchableOpacity>
          {!!loadingText && <Text style={styles.meta}>{loadingText}</Text>}
        </View>
      )}

      {section === 'receive' && (
        <View style={styles.card}>
          <Text style={{ fontWeight: '600' }}>Receber via QR</Text>
          <TextInput placeholder="Valor (opcional)" value={receive.amount} onChangeText={(t) => setReceive((s) => ({ ...s, amount: t }))} style={styles.input} keyboardType="decimal-pad" />
          <TextInput placeholder="Descrição (opcional)" value={receive.desc} onChangeText={(t) => setReceive((s) => ({ ...s, desc: t }))} style={styles.input} />
          <TouchableOpacity style={styles.btn} onPress={handleGenerateQr} accessibilityRole="button"><Text style={styles.btnText}>Gerar QR</Text></TouchableOpacity>
          {!!receive.generated && (
            <View style={styles.qrBox}>
              <Text selectable>Payload gerado:</Text>
              <Text selectable>{receive.generated}</Text>
              <TouchableOpacity style={[styles.btn, { marginTop: 12 }]} onPress={async () => {
                try { await Share.share({ message: receive.generated }); } catch {}
              }}>
                <Text style={styles.btnText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {section === 'keys' && (
        <View style={styles.card}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Minhas chaves</Text>
          <View>
            {(keys || []).map((k) => (
              <View key={k.id} style={styles.listItem}>
                <Text>{k.type.toUpperCase()} • {k.value}</Text>
                <View style={[styles.row, { marginTop: 6 }]}> 
              <TouchableOpacity style={styles.smallBtn} onPress={async () => { try { await removeKey(k.id); } catch (e: any) { Alert.alert('Erro', e?.message || 'Falha ao remover chave'); } }}><Text style={styles.smallBtnText}>Remover</Text></TouchableOpacity>
                </View>
              </View>
            ))}
            {(!keys || keys.length === 0) && <Text style={styles.meta}>Nenhuma chave ainda</Text>}
          </View>
          <Text style={{ fontWeight: '600', marginTop: 12 }}>Adicionar chave</Text>
          <View style={[styles.row, { marginTop: 8, flexWrap: 'wrap' }]}> 
            {(['email','phone','cpf','random'] as const).map((t) => (
              <TouchableOpacity key={t} style={[styles.smallBtn, { marginRight: 8, marginBottom: 8 }]} onPress={async () => { try { await addKey(t); } catch (e: any) { Alert.alert('Erro ao adicionar chave', e?.message || 'Não foi possível adicionar a chave'); } }}>
                <Text style={styles.smallBtnText}>+ {t.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {section === 'favorites' && (
        <View style={styles.card}>
          <Text style={{ fontWeight: '600' }}>Favoritos</Text>
          <View style={{ marginTop: 8 }}>
            {(favorites || []).map((f) => (
              <View key={f.id} style={styles.listItem}>
                <Text>{f.alias} • {f.keyValue}</Text>
                <View style={[styles.row, { marginTop: 6 }]}> 
                  <TouchableOpacity style={styles.smallBtn} onPress={async () => { try { await removeFav(f.id); } catch (e: any) { Alert.alert('Erro', e?.message || 'Falha ao remover favorito'); } }}><Text style={styles.smallBtnText}>Remover</Text></TouchableOpacity>
                </View>
              </View>
            ))}
            {(!favorites || favorites.length === 0) && <Text style={styles.meta}>Nenhum favorito ainda</Text>}
          </View>
          <Text style={{ fontWeight: '600', marginTop: 12 }}>Adicionar favorito</Text>
          <TextInput placeholder="Apelido" value={newFav.alias} onChangeText={(t) => setNewFav((s) => ({ ...s, alias: t }))} style={styles.input} />
          <TextInput placeholder="Chave PIX" value={newFav.key} onChangeText={(t) => setNewFav((s) => ({ ...s, key: t }))} style={styles.input} autoCapitalize="none" />
          <TextInput placeholder="Nome (opcional)" value={newFav.name} onChangeText={(t) => setNewFav((s) => ({ ...s, name: t }))} style={styles.input} />
          <TouchableOpacity style={styles.btn} onPress={async () => { if (!newFav.alias || !newFav.key) return; try { await addFav(newFav.alias, newFav.key, newFav.name || undefined); setNewFav({ alias: '', key: '', name: '' }); } catch (e: any) { Alert.alert('Erro', e?.message || 'Falha ao adicionar favorito'); } }}>
            <Text style={styles.btnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}

      {section === 'history' && (
        <View style={styles.card}>
          <Text style={{ fontWeight: '600' }}>Extrato PIX</Text>
          <FlatList
            data={transfers}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>{item.method === 'qr' ? 'Via QR' : 'Via chave'} • {formatCurrency(item.amount)} • {item.status}</Text>
                <Text style={styles.meta}>{item.description || item.toKey}</Text>
              </View>
            )}
          />
          {!!loadingText && <Text style={styles.meta}>{loadingText}</Text>}
        </View>
      )}

      {section === 'limits' && (
        <View style={styles.card}>
          <Text style={{ fontWeight: '600' }}>Limites PIX</Text>
          <Text style={{ marginTop: 6 }}>Diário atual: {limits ? formatCurrency(limits.dailyLimitCents) : '-'}</Text>
          <Text>Noite atual: {limits ? formatCurrency(limits.nightlyLimitCents) : '-'}</Text>
          <Text>Por transferência: {limits ? formatCurrency(limits.perTransferLimitCents) : '-'}</Text>
          <TextInput placeholder="Novo limite diário (R$)" value={limitsEdit.daily} onChangeText={(t) => setLimitsEdit((s) => ({ ...s, daily: t }))} style={styles.input} keyboardType="decimal-pad" />
          <TextInput placeholder="Novo limite noturno (R$)" value={limitsEdit.nightly} onChangeText={(t) => setLimitsEdit((s) => ({ ...s, nightly: t }))} style={styles.input} keyboardType="decimal-pad" />
          <TextInput placeholder="Novo limite por transferência (R$)" value={limitsEdit.per} onChangeText={(t) => setLimitsEdit((s) => ({ ...s, per: t }))} style={styles.input} keyboardType="decimal-pad" />
          <TouchableOpacity style={styles.btn} onPress={applyLimits}><Text style={styles.btnText}>Atualizar limites</Text></TouchableOpacity>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};
