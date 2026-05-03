# Contributing ao Follow-Up Mobile

Este documento contém as instruções necessárias para configurar o ambiente e manter a qualidade do código.

## Índice

1. [Configuração do Ambiente](#configuração-do-ambiente)
2. [Execução do Projeto](#execução-do-projeto)
3. [Fluxo de Contribuição](#fluxo-de-contribuição)
4. [Padrões de Código](#padrões-de-código)
5. [Testes](#testes)
6. [Commits](#commits)

## Configuração do Ambiente

### Requisitos Mínimos

| Ferramenta     | Versão       | Obrigatório |
| -------------- | ------------ | ------------ |
| Node.js        | 24.14.1 LTS | **Sim**      |
| npm            | >= 10        | **Sim**      |
| Expo CLI       | latest       | **Sim**      |
| Android Studio | com SDK 33+  | Para Android |
| Xcode         | 15+          | Para iOS (apenas Mac) |

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/follow-up-mobile.git
cd follow-up-mobile

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com as configurações da sua máquina:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ENV=development
```

> **Importante**: Para dispositivos físicos ou emuladores externos (como Waydroid), use o IP da sua máquina em vez de `localhost`.

### Configuração da API

O app consome a API do projeto [follow-up-mac](https://github.com/SEU_USUARIO/follow-up-mac). Siga os passos:

1. Clone e configure o `follow-up-mac` (veja o README dele)
2. Suba a infraestrutura: `cd follow-up-mac && npm run infra:up`
3. Inicie a API: `npm run dev:api`
4. A API estará disponível em `http://localhost:3000`

### Instalação do Android Studio (para Android)

1. Baixe o [Android Studio](https://developer.android.com/studio)
2. Instale o SDK 33+ via SDK Manager
3. Crie um emulador via Device Manager
4. Ou conecte um dispositivo físico com **USB Debugging** ativado

### Instalação do Expo Go (opcional, para testes rápidos)

1. Instale o app **Expo Go** no seu dispositivo (Android/iOS)
2. Execute `npm start` no projeto
3. Escaneie o QR Code exibido no terminal

## Execução do Projeto

### Comandos Básicos

```bash
# Metro Bundler (Expo Dev Tools)
npm start

# Android (emulador ou dispositivo)
npm run android

# iOS (apenas macOS)
npm run ios

# Web (navegador)
npm run web
```

### Scripts de Qualidade

```bash
# Lint (verificação)
npm run lint

# Lint com correção automática
npm run lint:fix

# Formatação (Prettier)
npm run format

# Verificação de tipos (TypeScript)
npm run typecheck
```

**Sempre execute antes de commitar:**

```bash
npm run lint && npm run typecheck
```

## Fluxo de Contribuição

### 1. Crie uma Branch

```bash
# Branch para nova feature
git checkout -b feat/nome-da-feature

# Branch para correção de bug
git checkout -b fix/nome-do-bug
```

### 2. Desenvolva Seguindo o TDD

Para **todas as novas features**, siga o ciclo **Red → Green → Refactor**:

```bash
# 1. Red: escreva o teste, veja falhar
npm test -- --watch NomeScreen.spec.tsx

# 2. Green: implemente o código mínimo
# ... código de produção ...

# 3. Refactor: otimize e valide
npm test -- --watchAll=false
npm run lint && npm run typecheck
```

### 3. Commits Semânticos

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```bash
# Features
git commit -m "feat: adiciona tela de listagem de leads"

# Correções
git commit -m "fix: corrige navegação na tela de perfil"

# Refatorações
git commit -m "refactor: extrai lógica de busca para hook useLeadSearch"

# Docs
git commit -m "docs: atualiza README com instruções de setup"
```

**Regras:**
- Mensagens em **português (pt-br)**
- Sem linha `Co-Authored-By`
- Foco no "porquê", não no "o que"

### 4. Pull Request

```bash
# Push da branch
git push origin feat/nome-da-feature
```

No GitHub:
1. Acesse o repositório e clique em **Compare & pull request**
2. Preencha o template com:
   - O que foi feito
   - Como testar
   - Screenshots (se houver mudança visual)
3. Aguarde a revisão

## Padrões de Código

### Estrutura de Arquivos

Toda nova feature segue o padrão:

```
src/features/nome-da-feature/
├── screens/          # Telas (1 arquivo = 1 tela)
│   └── NomeScreen.tsx
├── api/              # Hooks/funções de API (TanStack Query)
│   └── nome.api.ts
├── hooks/            # Hooks específicos da feature
│   └── useNome.ts
├── stores/           # Zustand stores (se necessário)
│   └── nome.store.ts
└── types.ts          # Types locais da feature
```

### Path Aliases (obrigatório)

Nunca use caminhos relativos (`../../../`). Sempre use aliases:

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

### Estado da Aplicação

| Camada                | Tecnologia     | Quando usar                              |
| --------------------- | -------------- | ---------------------------------------- |
| Estado do Servidor    | TanStack Query | Toda chamada API (cache, refresh)        |
| Estado Global Cliente | Zustand        | Auth, tema, dados estáveis               |
| Estado Local de Tela  | useState       | UI local (modal open, input text)         |

**Proibido:**
- `useEffect` para fetch de dados → Use `useQuery`
- Props drilling > 2 níveis → Use Zustand
- Estado duplicado entre Zustand e useState

### UI Components

Sempre prefira componentes do **React Native Paper**:

```typescript
// Correto
import { Button, TextInput, Card } from 'react-native-paper';

// Errado (só use se absolutamente necessário)
import { Button } from 'react-native';
```

### Formulários

Todo formulário usa **React Hook Form + Zod**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  // ...
}
```

### Regras de Estilo

- Funções: **4-20 linhas**. Divida se for maior.
- Arquivos: **menos de 500 linhas**.
- Uma coisa por função (SRP).
- Tipos explícitos. **Sem `any`**.
- Early returns. Máximo **2 níveis de indentação**.
- Nomes específicos. Evite `data`, `handler`, `Manager`.

## Testes

### Requisitos

- **Cobertura mínima**: 95% (branches, functions, lines, statements)
- **Framework**: Jest + Testing Library React Native
- **Padrão**: `*.spec.{ts,tsx}` junto ao código fonte

### Como Rodar

```bash
# Todos os testes
npm test

# Modo watch (desenvolvimento)
npm test -- --watch

# Com cobertura
npm test -- --coverage

# Apenas um arquivo
npm test -- src/features/leads/LeadsScreen.spec.tsx
```

### O que Testar

| Camada               | O que testar                                          |
| -------------------- | ----------------------------------------------------- |
| `api/`               | Chamadas HTTP, parsing, tratamento de erro            |
| `hooks/`             | Regras de negócio, derivados, debounce               |
| `stores/`            | Ações, transições de estado, persistência            |
| `screens/`           | Renderização condicional, interações, loading/error  |
| `shared/components/` | Props, acessibilidade, eventos                       |

### Exemplo de Teste

```typescript
import { render, screen } from '@testing-library/react-native';
import { LeadCard } from './LeadCard';

describe('LeadCard', () => {
  it('should render lead name correctly', () => {
    const lead = { id: '1', name: 'João Silva', status: 'ACTIVE' };
    render(<LeadCard lead={lead} />);
    expect(screen.getByText('João Silva')).toBeTruthy();
  });
});
```

## Commits

### Formato

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
<tipo>(escopo opcional): descrição curta

Corpo opcional com contexto do "porquê"
```

### Tipos de Commit

| Tipo       | Quando usar                                      |
| ----------- | ------------------------------------------------ |
| `feat`      | Nova funcionalidade                              |
| `fix`       | Correção de bug                                  |
| `refactor`  | Refatoração (sem nova funcionalidade ou fix)    |
| `docs`      | Documentação                                     |
| `style`     | Formatação (Prettier, lint)                      |
| `test`      | Testes                                           |
| `chore`     | Tarefas auxiliares (build, deps, config)         |

### Exemplos

```bash
git commit -m "feat(leads): adiciona filtro por status na listagem"
git commit -m "fix(auth): corrige redirecionamento após login"
git commit -m "refactor(core): extrai lógica de API para hooks customizados"
git commit -m "docs: adiciona instruções de setup no CONTRIBUTING"
```

**Regras importantes:**
- Mensagens em **português (pt-br)**
- **Sem linha `Co-Authored-By`**
- Use verbos no infinitivo: "adiciona", "corrige", "refatora"

## Dúvidas

Abra uma [issue](https://github.com/SEU_USUARIO/follow-up-mobile/issues) no repositório.
