### 2. README do Frontend (Repositório do Angular - a criar)

```markdown
# GymLab Web 🏋️‍♂️🖥️

GymLab Web é a interface (SPA) desenvolvida para academias e alunos gerenciarem seus treinos, cadastrarem perfis biométricos e visualizarem as fichas inteligentes geradas por Inteligência Artificial.

## 🧠 Arquitetura Front-end

Este projeto atua exclusivamente como a camada de apresentação e interação do usuário, delegando processamentos pesados para a nossa API construída em Spring Boot. 

O fluxo de autenticação utiliza o cliente nativo do **Supabase Auth** no client-side. Uma vez que o usuário faz login, o Angular intercepta o token JWT e o anexa no cabeçalho (Header) de todas as requisições HTTP (`HttpClient`) direcionadas à nossa API, garantindo a segurança estrita do ecossistema.

## 🔧 Tecnologias Utilizadas

| Tecnologia | Uso |
| :--- | :--- |
| **Angular** | Framework SPA principal para reatividade e roteamento |
| **TypeScript** | Superset JavaScript para tipagem estática |
| **Supabase Client** | Gerenciamento de sessão, login e registro (Auth) |
| **TailwindCSS** *(Exemplo)* | Estilização utilitária e design responsivo |

## 🚀 Como Executar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone [URL_DO_SEU_REPOSITORIO_FRONTEND]

2. Instale as dependências:
    npm install

3. Crie um arquivo de ambiente (ex: environment.ts) e configure as chaves públicas do seu backend e do Supabase:
    export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  supabaseUrl: 'SUA_URL_SUPABASE',
  supabaseKey: 'SUA_CHAVE_ANON_SUPABASE'
};

4. Suba o servidor de desenvolvimento:
    ng serve

A aplicação estará disponível em http://localhost:4200


## ✅ Funcionalidades Implementadas

### 🔐 Autenticação Segura

O frontend utiliza o `Supabase Auth` para gerenciamento completo de autenticação:

- Login com e-mail/senha
- Registro de novos usuários
- Recuperação de senha
- Persistência automática de sessão
- Logout seguro
- JWT automático para autenticação no backend Java

---

### 🛡️ Conformidade LGPD

A aplicação implementa um fluxo inicial de consentimento de cookies e privacidade:

- Banner de consentimento obrigatório
- Registro local do aceite/rejeição
- Armazenamento mínimo para conformidade
- Separação entre cookies essenciais e opcionais

---

### 🤖 Integração com Inteligência Artificial

Durante o cadastro, o usuário informa dados biométricos e objetivos de treino.

Esses dados são enviados para a API Java (`Spring Boot`), que:

1. Valida o JWT do usuário autenticado
2. Processa os parâmetros físicos
3. Consulta a IA via Ollama
4. Gera automaticamente uma ficha personalizada
5. Persiste os treinos vinculados ao usuário

---

### 📱 Interface Mobile-First

A interface foi construída priorizando dispositivos móveis:

- Layout centralizado
- Componentização leve
- UX simplificada
- Inputs otimizados para touch
- Design dark mode moderno
- Estrutura SPA responsiva

---

## 🔄 Fluxo Completo da Aplicação

```txt
Usuário
   ↓
Consentimento LGPD
   ↓
Supabase Auth
   ↓
JWT
   ↓
Angular HttpClient
   ↓
Spring Security
   ↓
API Java
   ↓
Ollama AI
   ↓
Supabase Database
```

---

## 🔐 Segurança da Aplicação

O frontend foi projetado para não expor credenciais críticas.

### Medidas implementadas:

- Uso exclusivo da `anon key` do Supabase no client-side
- Nenhuma chave privada exposta no navegador
- JWT validado exclusivamente no backend
- Processamento IA isolado no servidor Java
- Sem acesso direto do frontend ao banco de dados
- Headers Authorization com Bearer Token
- Sessões gerenciadas pelo Supabase Auth

---

## 📂 Estrutura Atual do Projeto

```txt
src/
 ├── app/
 │    ├── app.html
 │    ├── app.ts
 │    ├── app.css
 │    ├── app.config.ts
 │    └── supabase.ts
 │
 ├── environments/
 │    └── environment.ts
 │
 └── styles.css
```

---

## 🧪 Estado Atual do Projeto

### Implementado

- [x] Login
- [x] Cadastro
- [x] Recuperação de senha
- [x] Integração Supabase Auth
- [x] Geração automática de treino IA
- [x] JWT Authentication
- [x] Interface mobile-first
- [x] Consentimento LGPD
- [x] Dashboard inicial

### Em desenvolvimento

- [ ] Route Guards
- [ ] Interceptor JWT automático
- [ ] Dashboard completo
- [ ] Histórico de treinos
- [ ] Ajustes inteligentes de treino via IA
- [ ] Upload de imagens corporais
- [ ] Métricas biométricas
- [ ] PWA
- [ ] Deploy em produção

---

## ⚠️ Observações Importantes

Este projeto encontra-se em fase ativa de desenvolvimento.

Algumas funcionalidades ainda estão sendo refinadas, incluindo:

- arquitetura de rotas
- persistência avançada de sessão
- cache
- tratamento global de erros
- hardening de segurança
- observabilidade/logging

---

## 📄 Licença

Projeto privado para fins de desenvolvimento, pesquisa e validação arquitetural.