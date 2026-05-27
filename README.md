# GymLab Web 🏋️‍♂️🖥️

GymLab Web é a SPA (Single Page Application) do ecossistema GymLab, desenvolvida em Angular para academias e alunos gerenciarem treinos inteligentes, autenticação segura, métricas biométricas e fichas automatizadas por Inteligência Artificial.

---

# 🧠 Arquitetura Front-end

O frontend atua exclusivamente como camada de apresentação, autenticação e experiência do usuário.

Toda a lógica crítica, processamento IA, persistência e segurança avançada são delegados ao backend Java/Spring Boot.

O fluxo de autenticação utiliza o cliente nativo do Supabase Auth no client-side. Após autenticação, o JWT é automaticamente utilizado para comunicação segura com a API.

---

# 🔐 Fluxo Arquitetural

```txt
Usuário
   ↓
Banner LGPD
   ↓
Supabase Auth
   ↓
JWT
   ↓
Angular Services
   ↓
Spring Security
   ↓
API Java Spring Boot
   ↓
Ollama AI
   ↓
Supabase Database
```

---

# 🔧 Tecnologias Utilizadas

| Tecnologia | Uso |
| :--- | :--- |
| Angular 21 | Framework SPA principal |
| TypeScript | Tipagem estática |
| Angular Signals | Gerenciamento reativo de estado |
| Angular Router | Rotas SPA |
| Reactive Forms | Formulários reativos |
| Supabase Auth | Login, registro e sessão |
| TailwindCSS 4 | Estilização |
| Spring Boot | Backend |
| Spring Security | Validação JWT |
| Ollama | Inteligência Artificial |
| PostgreSQL/Supabase | Banco de dados |

---

# 🚀 Como Executar o Projeto Localmente

## 1. Clone o repositório

```bash
git clone [URL_DO_REPOSITORIO]
```

---

## 2. Instale as dependências

```bash
npm install
```

---

## 3. Configure o environment.ts

Crie:

```txt
src/environments/environment.ts
```

Conteúdo:

```ts
export const environment = {
  production: false,

  apiUrl: 'http://localhost:8080/api',

  supabaseUrl: 'SUA_URL_SUPABASE',

  supabaseKey: 'SUA_ANON_KEY'
};
```

---

## 4. Suba o projeto

```bash
ng serve
```

Aplicação disponível em:

```txt
http://localhost:4200
```

---

# 🔒 Segurança Implementada

## Supabase Auth

- Login seguro
- Registro de usuários
- Recuperação de senha
- Sessão persistente
- Logout seguro
- JWT Authentication

---

## Spring Security

O backend valida automaticamente os JWTs emitidos pelo Supabase.

Endpoints protegidos utilizam:

```txt
Bearer Token
```

---

## LGPD

Fluxo inicial de consentimento implementado:

- Modal obrigatório de consentimento
- Aceite ou rejeição de cookies opcionais
- Persistência local do consentimento
- Registro backend do consentimento
- Endpoint público específico para LGPD

---

# 🧩 Estrutura Atual do Projeto

```txt
src/
 ├── app/
 │
 │    ├── components/
 │    │    ├── sidebar/
 │    │    ├── workout-card/
 │    │    └── exercise-item/
 │    │
 │    ├── guards/
 │    │    └── auth.guard.ts
 │    │
 │    ├── pages/
 │    │    ├── auth/
 │    │    ├── dashboard/
 │    │    └── profile/
 │    │
 │    ├── services/
 │    │    ├── auth.ts
 │    │    └── treino.ts
 │    │
 │    ├── app.config.ts
 │    ├── app.css
 │    ├── app.html
 │    ├── app.routes.ts
 │    ├── app.ts
 │    └── supabase.ts
 │
 ├── environments/
 │    └── environment.ts
 │
 ├── styles.css
 │
 ├── index.html
 └── main.ts
```

---

# 📱 Interface e UX

A interface foi construída com foco em:

- mobile-first
- dark mode
- centralização visual
- UX simplificada
- acessibilidade
- componentes reutilizáveis
- arquitetura limpa

---

# 🧠 Arquitetura Angular Atual

O projeto está migrando de uma arquitetura monolítica para componentização desacoplada.

## Objetivos arquiteturais

- evitar boilerplate excessivo
- manter Angular puro
- evitar abstrações desnecessárias
- manter clean code
- preservar simplicidade
- componentização leve
- separação por domínio

---

# ✅ Funcionalidades Implementadas

## 🔐 Autenticação

- [x] Login
- [x] Cadastro
- [x] Logout
- [x] Recuperação de senha
- [x] Persistência de sessão
- [x] Integração Supabase

---

## 🛡️ Segurança

- [x] JWT Authentication
- [x] Spring Security
- [x] Route Guard inicial
- [x] Consentimento LGPD
- [x] Endpoint público LGPD
- [x] Proteção de rotas privadas

---

## 🎨 Interface

- [x] Dark mode moderno
- [x] Layout responsivo
- [x] Componentização inicial
- [x] Sidebar estrutural
- [x] Dashboard inicial
- [x] Formulários reativos
- [x] UX mobile-first

---

## 🤖 IA

- [x] Cadastro biométrico
- [x] Integração backend IA
- [x] Geração automática de treino
- [x] Comunicação Angular → API → Ollama

---

# 🚧 Dashboard em Desenvolvimento

O novo dashboard será estruturado em:

## Sidebar lateral

- Perfil
- Gerar treino IA
- Histórico
- Configurações
- Logout

---

## Área principal

### Exibição do treino do dia

```txt
Hoje é Segunda-feira
Seu treino é: Costas + Bíceps
```

---

## Lista de exercícios

Cada exercício possuirá:

- checkbox de conclusão
- expansão dinâmica
- séries
- repetições
- instruções
- último peso utilizado
- atualização manual de carga

---

# 🧪 Estado Atual do Projeto

## Concluído

- [x] Estrutura Angular modular
- [x] Supabase Auth
- [x] Spring Security JWT
- [x] LGPD frontend/backend
- [x] Componentização base
- [x] Dashboard estrutural
- [x] Guards iniciais
- [x] Dark UI
- [x] Rotas SPA

---

## Em andamento

- [ ] Dashboard funcional completo
- [ ] Sidebar dinâmica
- [ ] Exercise Item Component
- [ ] Workout Card Component
- [ ] Histórico de treino
- [ ] Atualização de carga
- [ ] Persistência de progresso
- [ ] Interceptor JWT automático
- [ ] PWA
- [ ] Deploy

---

# ⚠️ Observações Técnicas

## environment.ts

O arquivo:

```txt
src/environments/environment.ts
```

não deve ser commitado quando possuir credenciais reais.

Adicionar ao `.gitignore`:

```gitignore
src/environments/environment.ts
```

---

## Segurança

Mesmo utilizando a `anon key` do Supabase:

- nenhuma chave sensível deve ir ao frontend
- toda autorização real permanece no backend
- JWTs são validados exclusivamente no Spring Security

---

# 📄 Licença

Projeto privado para fins de desenvolvimento, pesquisa arquitetural e validação de integração IA + treino inteligente.