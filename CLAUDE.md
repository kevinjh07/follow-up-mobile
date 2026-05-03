# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## Visão Geral do Projeto

**Follow-Up Mobile** — aplicativo React Native + Expo para gestão de clínicas e cadências de contato. Consome a API REST do Follow-Up (`follow-up-mac` repo).

**Stack crítica:**

- Expo SDK 54 + React Native 0.81
- React Navigation v7 (Stack + Bottom Tabs + Drawer)
- React Native Paper v5 (UI — sempre preferir componentes Paper)
- Zustand (estado global: auth, clinic)
- TanStack Query v5 (estado servidor — sempre usar para API)
- React Hook Form + Zod (formulários)
- Axios com interceptors (Bearer token)
- Expo Secure Store (tokens criptografados)
- React Native Gifted Charts (gráficos)

---

## Estilo de código

- Funções: 4-20 linhas. Divida se for maior.
- Arquivos: menos de 500 linhas. Divida por responsabilidade.
- Uma coisa por função, uma responsabilidade por módulo (SRP).
- Nomes: específicos e únicos. Evite data, handler, Manager.
  Prefira nomes que retornem menos de 5 hits no codebase.
- Tipos: explícitos. Sem any, sem Dict, sem funções sem tipagem.
- Sem duplicação de código. Extraia lógica compartilhada em uma função/módulo.
- Early returns em vez de ifs aninhados. Máximo 2 níveis de indentação.

## Regras Gerais ao Gerar Código

### 1. Path Aliases (obrigatório)

Sempre use aliases. Nunca caminhos relativos (`../../../`).

```typescript
// Correto
import { api } from '@core/services/api';
import { useAuthStore } from '@core/stores/authStore';
import { Button } from '@shared/components';

// Errado
import { api } from '../../../core/services/api';
```

| Alias           | Caminho            |
| --------------- | ------------------ |
| `@app/*`        | `src/app/*`        |
| `@core/*`       | `src/core/*`       |
| `@features/*`   | `src/features/*`   |
| `@shared/*`     | `src/shared/*`     |
| `@navigation/*` | `src/navigation/*` |

### 2. Estado do Servidor = TanStack Query

Nunca use `useEffect` + `fetch`. Sempre use `useQuery` / `useMutation`.

```typescript
// Correto
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['leads'],
  queryFn: fetchLeads,
});

// Errado
useEffect(() => {
  fetch('/api/leads').then(...); // PROIBIDO
}, []);
```

### 3. Componentes UI = React Native Paper

Sempre que possível, use componentes do React Native Paper. Evite criar componentes base do zero.

```typescript
// Correto
import { Button, TextInput, Card, List, Dialog } from 'react-native-paper';

// Errado
import { Button, TextInput } from 'react-native'; // só se absolutamente necessário
```

### 4. Formulários = RHF + Zod

Todo formulário usa React Hook Form + Zod para validação.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

const { control, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### 5. Estilos

- Use `StyleSheet.create()` na própria tela/componente
- Temas globais em `src/core/theme.ts`
- Evite `StyleSheet.absoluteFill` a menos que necessário
- Dark mode planejado no tema — evite hardcoded colors

---

## Boas Práticas Gerais de Programação

### Legibilidade e Manutenibilidade

- **Funções pequenas**: 4-20 linhas. Se crescer, divida em subfunções.
- **Arquivos enxutos**: Menos de 500 linhas. Separe por responsabilidade.
- **SRP**: Uma coisa por função, um módulo por responsabilidade.
- **Nomes descritivos**: Sem `data`, `handler`, `Manager`. Prefira nomes que retornem <5 hits no codebase.
- **Tipagem estrita**: Tipos explícitos. Sem `any`, sem `Dict`, sem funções sem tipagem.
- **DRY**: Sem duplicação de código. Extraia lógica compartilhada em funções/módulos reutilizáveis.
- **Early returns**: Evite ifs aninhados. Máximo 2 níveis de indentação.
- **Composição sobre herança**: Prefira composição de componentes e hooks customizados.

### Organização de Código

- **Imports ordenados**: (1) React / externas, (2) aliases `@core/`, `@shared/`, (3) locais relativos (evitar).
- **Separação de concerns**: Lógica de negócio em hooks, apresentação em componentes, API em `services/`.
- **barrel exports**: Use `index.ts` em pastas para exportar módulos públicos.

---

## Arquitetura e Estrutura React Native

### 1. Separação de Responsabilidades (Container/Presentational)

```typescript
// Screen (container) - orquestra lógica e estado
export function LeadListScreen() {
  const { data, isLoading } = useLeadsQuery();
  return <LeadListView leads={data} isLoading={isLoading} />;
}

// Componente (presentational) - apenas UI
function LeadListView({ leads, isLoading }: LeadListViewProps) {
  if (isLoading) return <LoadingOverlay />;
  return <FlatList data={leads} renderItem={renderItem} />;
}
```

Regras:

- **Screens**: Apenas orquestração (useQuery, useState, navigation). Sem JSX complexo.
- **Componentes**: Recebem props e renderizam. Sem chamadas de API diretas.
- **Hooks**: Extraem lógica reutilizável (regras de negócio, derivados de estado).
- **API**: Funções puras de HTTP. Sem side effects de UI.

### 2. Gerenciamento de Estado — Regras de Ouro

| Camada                       | Tecnologia                 | Quando usar                                            |
| ---------------------------- | -------------------------- | ------------------------------------------------------ |
| Estado do Servidor           | TanStack Query             | Toda chamada API (cache, refresh, mutações)            |
| Estado Global Cliente        | Zustand                    | Auth, tema, dados que raramente mudam                 |
| Estado Local de Tela         | useState / useReducer      | UI local (modal open, input text), curto prazo         |
| Estado Compartilhado Feature | Zustand (feature-specific) | Dados compartilhados entre telas da mesma feature      |
| Contexto React               | Não use                    | Substitua por Zustand (menos re-renders, mais simples) |

Anti-padrões proibidos:

- Proibido: `useEffect` para fetch de dados → Use `useQuery`
- Proibido: Props drilling > 2 níveis → Use store ou composition
- Proibido: Estado duplicado entre Zustand e useState → Fonte única de verdade
- Proibido: Mutar estado diretamente → Sempre via setters/actions

### 3. Performance Mobile

```typescript
// Memoize componentes pesados ou listas
const MemoizedCard = React.memo(LeadCard, (prev, next) => prev.id === next.id);

// useMemo para cálculos caros
const sortedLeads = useMemo(() => [...leads].sort(...), [leads]);

// useCallback para funções passadas como props
const handlePress = useCallback((id: string) => { ... }, []);

// FlatList para listas (nunca ScrollView + map)
<FlatList
  data={data}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  initialNumToRender={10}
  windowSize={5}
/>
```

Regras:

- Sempre `FlatList` para listas > 10 itens. Configure `getItemLayout` quando possível.
- Imagens: Use `expo-image` com cache e placeholder. Especifique `width`/`height`.
- Evite `console.log` em produção. Use `__DEV__` condicional.
- Bundle size: Lazy load telas com `React.lazy` ou dynamic imports quando suportado.
- Animações: Use `react-native-reanimated` (worklets) para animações suaves a 60fps.

### 4. Navegação — Tipagem e Padrões

```typescript
// Tipagem forte de rotas
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  LeadDetails: { leadId: string };
};

// Hook tipado
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, 'LeadDetails'>>();
```

Regras:

- Todas as rotas tipadas em `src/navigation/types.ts`.
- Nunca passe objetos grandes como params — passe apenas IDs e busque dados via API/cache.
- Deep links configurados em `src/navigation/DeepLinkConfig.ts`.

### 5. Tratamento de Erros e Resiliência

```typescript
// Tratamento centralizado em queries
const { data, error, isError } = useQuery({
  queryKey: ['leads'],
  queryFn: fetchLeads,
  retry: (failureCount, error) => {
    if (error instanceof UnauthorizedError) return false;
    return failureCount < 3;
  },
});

// UI de erro por tela
if (isError) return <ErrorRetryView message={error.message} onRetry={refetch} />;
```

Regras:

- Erros de API: Tratados no interceptor + UI local com retry.
- Erros de validação: Zod + RHF mostram no campo.
- Erros críticos: Error Boundary (quando possível) ou tela de fallback.
- Offline: Use TanStack Query `networkMode` e cache para UX tolerante.

### 6. Acessibilidade (a11y)

```typescript
// Props de acessibilidade obrigatórias
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Salvar lead"
  accessibilityHint="Toque para salvar as alterações"
>
  <Text>Salvar</Text>
</Pressable>
```

Regras:

- Todos os elementos interativos precisam de `accessibilityRole` e `accessibilityLabel`.
- Touch targets: Mínimo 44x44 dp (Paper já faz isso, mas verifique customizações).
- Contraste: Siga o tema Paper (já validado WCAG).
- Teste com VoiceOver (iOS) / TalkBack (Android) antes de entregar.

### 7. Mobile-First UX

- **Keyboard Avoiding**: Use `KeyboardAvoidingView` em formulários com inputs.
- **Safe Areas**: Use `SafeAreaView` de `react-native-safe-area-context`.
- **Status Bar**: Respeite tema dark/light via `expo-status-bar`.
- **Loading States**: Skeletons ou spinners em toda navegação assíncrona.
- **Empty States**: Sempre exiba mensagem amigável quando listas estiverem vazias.
- **Pull-to-refresh**: Implemente `onRefresh` em listas de dados mutáveis.
- **Bottom sheets**: Use `@gorhom/bottom-sheet` para ações secundárias (filtros, confirmações).
- **Toasts/Snackbars**: Use Paper `Snackbar` para feedbacks rápidos (sucesso, erro).

### 8. Segurança

- Tokens **nunca** em AsyncStorage — sempre `expo-secure-store`.
- Variáveis sensíveis (API keys) em variáveis de ambiente, **nunca** hardcoded.
- Valide todas as entradas do usuário (Zod no client + backend valida também).
- Sanitiza dados antes de renderizar (evite `dangerouslySetInnerHTML` equivalente).

---

## Estrutura de Features

Toda nova feature segue o padrão obrigatório:

```
src/features/nome-da-feature/
├── screens/          # Telas (1 arquivo = 1 tela, PascalCase + Screen)
│   └── LeadListScreen.tsx
├── api/              # Hooks/functions de API (TanStack Query)
│   └── leads.api.ts
├── hooks/            # Hooks específicos da feature
│   └── useLeadSearch.ts
├── stores/           # Zustand stores específicos (se necessário)
│   └── leads.store.ts
└── types.ts          # Types locais da feature
```

### Nomenclatura de Arquivos

| Tipo        | Padrão                                            |
| ----------- | ------------------------------------------------- |
| Screens     | `PascalCaseScreen.tsx` → `LeadListScreen.tsx`   |
| Components  | `PascalCase.tsx` → `ConfirmDialog.tsx`            |
| Hooks       | `camelCase` + prefixo `use` → `usePermissions.ts` |
| Stores      | `camelCase` + sufixo `Store` → `authStore.ts`    |
| API clients | `camelCase` → `leads.api.ts`                       |
| Utils       | `camelCase` → `dateTime.util.ts`                 |

---

## Autenticação & API

- Token JWT armazenado em `expo-secure-store` (Keychain/Keystore)
- Header `Authorization: Bearer <token>` em toda requisição
- Em `401`, interceptor tenta refresh silencioso via `/auth/refresh`
- Se refresh falha → desloga e redireciona para login

### Endpoint base da API

```
http://localhost:3000 (desenvolvimento)
```

### Endpoints de Auth (mobile)

- `POST /auth/login` — login com email + senha
- `POST /auth/refresh` — refresh silencioso
- `POST /auth/logout` — logout

---

## Scripts Disponíveis

```bash
npm start          # Metro Bundler (Expo)
npm run android    # Android emulator
npm run ios        # iOS simulator (Mac only)
npm run web        # Modo web para testes rápidos
npm run lint       # ESLint
npm run lint:fix   # ESLint com --fix
npm run format     # Prettier
npm run typecheck  # TypeScript --noEmit
```

**Antes de qualquer commit, execute:**

```bash
npm run lint && npm run typecheck
```

---

## Testes

- Framework: Jest + Testing Library React Native
- Padrão: `*.spec.{ts,tsx}` junto ao código fonte
- Jest mocks customizados em `src/testing/mocks/`
- Cobertura mínima: 95% (branches, functions, lines, statements)
- Setup: `src/testing/setup-tests.ts`

### Padrão de teste básico

```typescript
import { render, screen } from '@testing-library/react-native';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Label')).toBeTruthy();
  });
});
```

## TDD — Desenvolvimento Orientado a Testes

Para **todas as novas features e funcionalidades**, siga o ciclo **Red → Green → Refactor**:

1. **Escreva o teste primeiro** (`*.spec.ts`/`*.spec.tsx`) para a unidade/módulo/tela antes de qualquer código de produção.
   - Valide comportamentos esperados, edge cases, estados de loading/error e interações do usuário.
   - Execute `npm test` e confirme que **falha (Red)**.

2. **Implemente o código mínimo** para fazer o teste passar (**Green**).
   - Sem otimizações prematuras. Mínimo que satisfaça o teste.

3. **Refatore** mantendo o teste verde.
   - Aplique as convenções de estilo (funções curtas, SRP, early returns, path aliases, Paper, TanStack Query, etc.).
   - Execute `npm test` novamente para confirmar que continua passando.

### O que testar em novas features

| Camada               | O que testar                                                 | Exemplo                                               |
| -------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `api/`               | Chamadas HTTP, parsing de resposta, tratamento de erro       | `fetchLeads` retorna `Lead[]` ou lança `ApiError` |
| `hooks/`             | Regras de negócio, derivados, debounce                       | `useLeadSearch` atualiza query após 300ms           |
| `stores/`            | Ações, transições de estado, persistência                    | Zustand store atualiza `selectedLead`               |
| `screens/`           | Renderização condicional (loading, empty, error), interações | Botão "Salvar" dispara `mutation.mutate()`            |
| `shared/components/` | Props, acessibilidade, eventos                               | `ConfirmDialog` chama `onConfirm` ao tocar "Sim"      |

### Regras

- **Nunca** crie um novo módulo (`api.ts`, `store.ts`, `hook.ts`, `Screen.tsx`) sem o respectivo arquivo de teste `*.spec.ts`/`*.spec.tsx`.
- **Nunca** aceite queda de cobertura. A meta global é **≥95%** (branches, functions, lines, statements).
- Use os **mocks customizados** de `src/testing/mocks/` para dependências externas (Expo, Paper, Navigation, TanStack Query, Zustand).
- Testes de API: mock Axios com `jest.mock('@core/services/api')` ou `nock`.
- Testes de screens: envolva com `QueryClientProvider` e `NavigationContainer` quando necessário.

### Ciclo de desenvolvimento sugerido

```bash
# 1. Red: escreva o teste, veja falhar
npm test -- --watch LeadListScreen.spec.tsx

# 2. Green: implemente
# ... código de produção ...

# 3. Refactor: otimize e valide
npm test -- --watchAll=false
npm run lint && npm run typecheck
```

Os docs detalhados podem ser criados na pasta `docs/` conforme necessidade:

| Documento                 | Conteúdo                                |
| ------------------------- | --------------------------------------- |
| `docs/ARCHITECTURE.md`    | Decisões arquiteturais, stack detalhada |
| `docs/SETUP.md`           | Setup completo para novos devs          |
| `docs/API_INTEGRATION.md` | Contratos API, endpoints, payloads      |
| `docs/AUTH.md`            | Fluxo de login, sessão, refresh, RBAC   |
| `docs/FEATURES.md`        | Como criar uma nova feature             |
| `docs/CONVENTIONS.md`     | Guia de estilo completo                 |
| `docs/DEPLOY.md`          | EAS Build, OTA updates, stores          |
| `docs/TROUBLESHOOTING.md` | Problemas comuns e soluções             |

---

## Convenções Especiais

### Zustand Stores

```typescript
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));
```

### TanStack Query (v5)

```typescript
// Queries
const { data } = useQuery({ queryKey: ['leads'], queryFn: fetchLeads });

// Mutations
const mutation = useMutation({
  mutationFn: createLead,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  },
});
```

### React Native Paper Theme

```typescript
import { useTheme } from 'react-native-paper';

// Dentro de componentes
const theme = useTheme();
// theme.colors.primary, theme.colors.surface, etc.
```

---

## Notas para o Assistente

- **Nunca** modifique arquivos de configuração (babel, metro, jest, eslint, tsconfig) sem explicar o motivo.
- **Sempre** mantenha a cobertura de testes acima de 95%.
- **Sempre** use TypeScript `strict` — nenhum `any` implícito.
- **Evite** adicionar novas dependências sem justificativa. Consulte o usuário antes.
- **Mobile-first**: lembre-se que é um app mobile — pense em touch targets, scroll, keyboard avoiding, safe areas.

---

## Git Commits

- Commits em português (pt-br)
- Mensagens descritivas focando no "porquê", não no "o que"
- Sem linha `Co-Authored-By`
- Use conventional commit quando possível: `feat:`, `fix:`, `chore:`, `refactor:`

---

## Environment

- API URL configurada via `EXPO_PUBLIC_API_URL` no `.env`
- Copie `.env.example` para `.env` e configure
- Nunca commite arquivos `.env`

---

## Referências

- Repo da API Follow-Up: `follow-up-mac` (monorepo com API em apps/api/)
