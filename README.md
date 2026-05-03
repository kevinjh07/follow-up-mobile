# Follow-Up Mobile

Aplicativo mobile para o sistema Follow-Up de gestão de clínicas médicas. Consome a API REST do Follow-Up para gerenciar leads, cadências de contato via WhatsApp e operações multi-clínicas.

---

## Visão Geral

O app permite que atendentes e administradores gerenciem leads cadastrados por clínica e acompanhem o envio automático de mensagens WhatsApp seguindo a cadência de 4 etapas:

| Atendimento    | Status        | Prazo | Anexo        |
| -------------- | ------------- | ----- | ------------ |
| Atendimento 02 | `OUTREACH`    | 24 h  | Não          |
| Atendimento 03 | `TESTIMONIAL` | 48 h  | Sim (imagem) |
| Atendimento 04 | `CLOSURE`     | 72 h  | Não          |
| Finalizado     | `FINALIZED`   | —     | —            |

---

## Stack

| Camada        | Tecnologia                              |
| ------------- | --------------------------------------- |
| Framework     | Expo SDK 54 + React Native 0.81         |
| Linguagem     | TypeScript                              |
| Navegação     | React Navigation v7 (Stack + Tabs + Drawer) |
| UI            | React Native Paper v5 (Material Design 3) |
| Estado Servidor | TanStack Query v5 (cache + fetch)    |
| Estado Global | Zustand                                 |
| Formulários   | React Hook Form + Zod                    |
| HTTP          | Axios + interceptors                     |
| Armazenamento | Expo Secure Store (tokens)               |
| Gráficos      | React Native Gifted Charts               |

---

## Pré-requisitos

- **Node.js** 24.14.1 (LTS)
- **npm** >= 10
- **Expo CLI** (instalado globalmente ou via npx)
- **Android Studio** (para emulador Android) OU **Xcode** (para iOS Simulator - apenas Mac)
- **Git**

### Android
- Android Studio com SDK 33+
- Emulador configurado ou dispositivo físico com USB Debugging

### iOS (apenas macOS)
- Xcode 15+
- CocoaPods (`sudo gem install cocoapods`)

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/kevinjh07/follow-up-mobile.git
cd follow-up-mobile

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` gerado:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ENV=development
```

> **Nota**: Para dispositivos físicos ou emuladores externos, use o IP da máquina onde a API está rodando (ex: `http://192.168.1.100:3000`) em vez de `localhost`.

---

## Execução

### Desenvolvimento

```bash
# Inicia o Metro Bundler (Expo)
npm start

# Android (emulador ou dispositivo conectado)
npm run android

# iOS (apenas macOS)
npm run ios

# Web (para testes rápidos no navegador)
npm run web
```

### Configuração do Ambiente

1. **API do Follow-Up**: O app consome a API do projeto `follow-up-mac`. Certifique-se de que a API está rodando em `http://localhost:3000` (ou configure `EXPO_PUBLIC_API_URL` no `.env`).

2. **Usuários de teste** (criados pelo seed da API):

| Perfil    | E-mail                      | Senha           |
| --------- | --------------------------- | --------------- |
| Admin     | `admin@followupmac.com`     | `Admin@123`     |
| Atendente | `atendente@followupmac.com` | `Atendente@123` |
| Ops       | `ops@followupmac.com`       | `Ops@123`       |

---

## Scripts Disponíveis

```bash
npm start          # Metro Bundler (Expo)
npm run android    # Android emulator/device
npm run ios        # iOS simulator (Mac only)
npm run web        # Modo web para testes rápidos
npm run lint       # ESLint (verificação)
npm run lint:fix   # ESLint com correção automática
npm run format     # Prettier (formatação)
npm run typecheck  # TypeScript --noEmit (verificação de tipos)
```

**Antes de qualquer commit, execute:**

```bash
npm run lint && npm run typecheck
```

---

## Estrutura do Projeto

```
src/
  app/        — entry point, providers, estilos globais
  core/
    services/ — API clients (auth, clinics, leads, etc.)
    types/    — interfaces e modelos TypeScript
    utils/    — funções auxiliares
    stores/   — Zustand stores (auth, tema, etc.)
  features/   — módulos por domínio (cada feature tem screens/, api/, hooks/)
  shared/     — componentes reutilizáveis, hooks, constantes
  navigation/ — configuração de rotas (Stack, Tabs, Drawer)
```

### Convenções de Nomenclatura

| Tipo        | Padrão                                          |
| ----------- | ------------------------------------------------ |
| Screens     | `PascalCaseScreen.tsx` → `LeadListScreen.tsx`   |
| Components  | `PascalCase.tsx` → `ConfirmDialog.tsx`            |
| Hooks       | `camelCase` + prefixo `use` → `usePermissions.ts` |
| Stores      | `camelCase` + sufixo `Store` → `authStore.ts`    |
| API clients | `camelCase` → `leads.api.ts`                     |

---

## Testes

- **Framework**: Jest + Testing Library React Native
- **Padrão**: `*.spec.{ts,tsx}` junto ao código fonte
- **Cobertura mínima**: 95% (branches, functions, lines, statements)

```bash
# Executar todos os testes
npm test

# Executar com watch (desenvolvimento)
npm test -- --watch

# Verificar cobertura
npm test -- --coverage
```

### TDD — Desenvolvimento Orientado a Testes

Para **todas as novas features**, siga o ciclo **Red → Green → Refactor**:

1. **Escreva o teste primeiro** (`*.spec.ts`/`*.spec.tsx`) para a unidade/módulo/tela.
2. **Implemente o código mínimo** para fazer o teste passar (**Green**).
3. **Refatore** mantendo o teste verde, aplicando as convenções de código.

---

## Regras de Código

- **Funções**: 4-20 linhas. Divida se for maior.
- **Arquivos**: menos de 500 linhas. Divida por responsabilidade.
- **Nomes**: específicos e únicos. Evite `data`, `handler`, `Manager`.
- **Tipos**: explícitos. Sem `any`, sem `Dict`.
- **Sem duplicação**: extraia lógica compartilhada em funções/módulos.
- **Early returns**: evite ifs aninhados. Máximo 2 níveis de indentação.
- **Path aliases**: sempre use `@core/`, `@features/`, `@shared/`, `@navigation/` (nunca caminhos relativos `../../../`).

### Estado

| Camada                | Tecnologia          | Quando usar                              |
| --------------------- | ------------------- | ---------------------------------------- |
| Estado do Servidor    | TanStack Query      | Toda chamada API (cache, refresh)        |
| Estado Global Cliente | Zustand             | Auth, tema, dados estáveis               |
| Estado Local de Tela  | useState/useReducer | UI local (modal, input text)            |

**Proibido**: `useEffect` para fetch de dados → use `useQuery`.

---

## Contribuição

Veja o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para instruções detalhadas sobre como contribuir com o projeto.

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
