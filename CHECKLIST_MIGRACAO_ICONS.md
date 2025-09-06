# Checklist de Migração de Ícones

Objetivo: migrar os ícones usados de `contents/figma/icons` para `public/assets/images/icons`, copiando somente os arquivos referenciados no código e atualizando os imports.

## Passos de Migração

- [x] Mapear referências atuais: buscar por `contents/figma/icons` no código com `rg -n "contents/figma/icons"`.
- [x] Criar pasta destino: `public/assets/images/icons`.
- [x] Copiar apenas ícones usados para a pasta destino.
- [x] Atualizar imports/requires no código para `public/assets/images/icons`.
- [ ] Validar telas impactadas (Home, Dashboard, Onboarding) renderizando os ícones.
- [ ] Substituir gradualmente novas referências remanescentes por módulo/tela (vide seção “Próximos Ícones”).
- [ ] Remover ícones não usados de `contents/figma/icons` quando a migração estiver 100% concluída.
- [ ] Documentar a convenção: novos ícones devem ir em `public/assets/images/icons`.

### Ferramenta de Migração

- [x] Adicionar script de migração incremental: `scripts/migrate-icons.js`.
- [ ] Executar para copiar apenas ícones referenciados diretamente em `contents/figma/icons`:
  - `npm run migrate:icons` (usa o padrão de busca no código)
  - `npm run migrate:icons -- --dry` (mostra o que seria copiado)

## Status Atual (migrado)

- [x] `Avatar.png`
- [x] `Gráfico pizza.png`
- [x] `Ícone Pix.png`
- [x] `Ícone cartões.png`
- [x] `Ícone empréstimo.png`
- [x] `Ícone Saque.png`
- [x] `Ícone seguros.png`
- [x] `Ícone doações.png`

Arquivos acima já foram copiados para `public/assets/images/icons` e suas referências foram atualizadas.

## Próximos Ícones (exemplos)

Use esta lista para acompanhar os próximos itens a migrar conforme forem sendo usados no app. Adicione/remova itens conforme necessidades do projeto.

- [ ] `Logo.png|Logo.svg`
- [ ] `Instagram.svg|Whatsapp.svg|Youtube.svg`
- [ ] `ícone menu.svg`
- [ ] Outras variantes (ex: `*-1.png`, `*-2.png`) apenas se forem efetivamente referenciadas.

## Como Migrar Incrementalmente

- [ ] Escolher um módulo/tela (ex.: Login, Dashboard, Home).
- [ ] Rodar `rg -n "contents/figma/icons" src/<modulo>` para listar arquivos usados (ou utilizar `npm run migrate:icons`).
- [ ] Copiar somente os ícones citados para `public/assets/images/icons`.
- [ ] Atualizar os `require(...)`/`import` no módulo selecionado.
- [ ] Executar o app e validar a renderização dos ícones e tamanhos.
- [ ] Repetir para o próximo módulo/tela.

## Boas Práticas

- [ ] Evitar adicionar ícones não utilizados na pasta destino.
- [ ] Manter nomes de arquivos consistentes e sem duplicatas.
- [ ] Se possível, preferir SVGs em contextos suportados (no React Native, via libs específicas) para escalabilidade.
- [ ] Centralizar a resolução de caminhos de ícones em um único arquivo (ex.: `src/assets/icons.ts`) caso o projeto cresça.
