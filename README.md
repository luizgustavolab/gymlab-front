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


