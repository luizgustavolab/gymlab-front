GymLab Web 🏋️‍♂️🖥️

GymLab Web é a SPA do ecossistema GymLab, desenvolvida em Angular para academias e alunos gerenciarem seus treinos, autenticação segura, métricas biométricas e fichas estruturadas via motor de estratégias algorítmico.
---

# 🧠 Arquitetura Front-end

O frontend atua estritamente como camada de apresentação, controle de sessão local e experiência do usuário (UX).

Toda a lógica de negócio pesada, o motor de montagem de fichas (Strategy Pattern), a validação de regras por categoria e a persistência relacional são delegados à API REST desenvolvida em Java/Spring Boot.

A autenticação é iniciada no client-side consumindo diretamente o cliente nativo do Supabase Auth. Após o handshake inicial, o JWT obtido (access_token) é capturado e injetado nas requisições HTTP para autorizar o consumo dos endpoints protegidos do ecossistema.

---

# 🔐 Fluxo Arquitetural

                Usuário (Browser / Mobile)
                           │
                           ▼
       [ Banner LGPD ] (Bloqueio/Consentimento Local)
                           │
                           ▼
     [ Supabase Auth SDK ] (Handshake de Credenciais)
                            │
                            ▼
                    [ Sessão Ativa ] ───► Extração do JWT
                              │
                              ▼
   [ Angular Services / HTTP ] (Injeção de Bearer Token)
                             │
                             ▼
     [ API Externa / Spring Boot ] (POST /api/treinos/gerar)

---

# 🔧 Tecnologias Utilizadas

Tecnologia | Uso Principal
| :--- | :--- |
| Angular 21 | Framework corporativo para construção da SPA via Standalone Components |
| TypeScript | Tipagem estática, interfaces de DTOs e segurança em tempo de compilação |
| Angular Signals | Gerenciamento reativo de estado síncrono e controle de fluxos de UI |
| Angular Router | Navegação interna e proteção de rotas privadas via Guards |
| Reactive Forms | Captura estruturada e validação em tempo real dos dados cadastrais/biométricos |
| Supabase Auth | SDK para gerenciamento de login, persistência de tokens e fluxos de senha |
| TailwindCSS 4 | Estilização utilitária e componentes visuais mobile-first |

| PostgreSQL/Supabase | Banco de dados |

---

# 🚀 Como Executar o Projeto Localmente

## 1. Clone o repositório

git clone https://github.com/luizgustavolab/gymlab-front.git


---

## 2. Instale as dependências
Certifique-se de utilizar uma versão LTS do Node.js (v20 ou superior):

npm install


---

## 3. Configure o environment.ts
Crie o arquivo de configuração exatamente no seguinte caminho:

src/environments/environment.ts

Adicione o seguinte conteúdo mapeando a API local do backend e as chaves anônimas do seu cliente de autenticação:

Conteúdo:

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  supabaseUrl: 'SUA_URL_SUPABASE',
  supabaseKey: 'SUA_ANON_KEY'
};

---

## 4. Inicialize o servidor de desenvolvimento

ng serve

Aplicação disponível em: http://localhost:4200


---

# 🔐 Fluxos de Segurança & Governança

## Supabase Auth

Fluxo Unificado: Centralizado na rota /auth, gerenciando de forma reativa as telas de Login, Cadastro de novos usuários e Recuperação de credenciais

Sessões Stateless: O frontend lê a persistência local do Supabase, extrai o token de acesso e o envia estruturado no header de cada requisição HTTP:
   Authorization: Bearer <seu_jwt_token_aqui>

---

## Conformidade LGPD

Consentimento Obrigatório: Modal interceptador de segurança exibido no primeiro acesso à aplicação.
Persistência de Decisão: O aceite ou recusa de logs opcionais é armazenado localmente para evitar redundância de modais e despachado via serviço HTTP para sincronização e registro histórico junto à API.

---

# 🧩 Estrutura de Diretórios (Escopo Front-end)

src/
 ├── app/
 │    ├── components/             # Elementos de interface reutilizáveis
 │    │    ├── sidebar/           # Painel de navegação lateral responsivo
 │    │    ├── workout-card/      # Cartão de agrupamento e listagem semanal de treinos
 │    │    └── exercise-item/     # Linha de exercício com controle de carga e status
 │    │
 │    ├── guards/                 # Regras de proteção de rotas
 │    │    └── auth.guard.ts      # Restringe o acesso a páginas internas para usuários logados
 │    │
 │    ├── pages/                  # Views / Páginas da aplicação
 │    │    ├── auth/              # Container de login, cadastro unificado e senha
 │    │    ├── dashboard/         # Painel principal do aluno com cronograma do dia
 │    │    ├── profile/           # Edição de biometria e configurações de conta
 │    │    └── renovar/           # Hub de requisição e reestruturação de treinos
 │    │
 │    ├── services/               # Serviços Angular e conexões com APIs externas
 │    │    ├── auth.ts            # Wrapper de chamadas do SDK Supabase e sinais de usuário
 │    │    └── treino.ts          # Consumo de rotas de treinos e catálogos de exercícios
 │    │
 │    ├── app.config.ts           # Provedores globais, rotas e configurações do Angular
 │    ├── app.css                 # CSS geral do componente raiz
 │    ├── app.html                # Template principal (contém o router-outlet)
 │    ├── app.routes.ts           # Mapeamento e proteção das rotas da SPA
 │    ├── app.ts                  # Componente raiz inicializador
 │    └── supabase.ts             # Instanciação centralizada do Supabase Client
 │
 ├── environments/                # Arquivos de configuração de ambiente
 │    └── environment.ts          # Credenciais e URLs locais (Ignorado no Git)
 │
 ├── styles.css                   # Core styles, variáveis de tema dark e TailwindCSS 4
 ├── index.html                   # Ponto de montagem da aplicação
 └── main.ts                      # Bootstrap oficial da SPA

---

# 📱 Design System e Ajustes de UX Mobile

A interface foi construída com foco em:

A aplicação adota uma abordagem estritamente mobile-first, focada na ergonomia do usuário dentro da sala de treino:

Dark Mode Nativo: Cores baseadas na escala #0f172a com acentuações em verde esmeralda (#10b981) para evitar fadiga visual.

Correção de Viewport: Interfaces otimizadas com margens de segurança inferiores ajustadas (padding-bottom: 180px em resoluções mobile) para evitar que elementos nativos de seleção de formulários (como os seletores de dias na semana) quebrem o esquadro ou fiquem ocultos pela paginação do navegador.

---

# ✅ Status de Implementação (Focado no Frontend)


>Concluído
[x] Arquitetura base estruturada em Angular 21 Standalone e Signals.
[x] Integração completa com SDK Supabase Auth para controle de estado de sessão.
[x] Sistema de rotas dinâmicas protegido por AuthGuard.
[x] Formulários reativos estruturados com validações síncronas de biometria (Peso, Altura, Gênero e Objetivo).
[x] Tela de reestruturação de fichas (/renovar) integrada ao endpoint de geração do motor de estratégias do backend (POST /api/treinos/gerar).
[x] Modal de controle de privacidade e consentimento de dados (LGPD) com persistência local.
[x] Correção estrutural de overflow em selects nativos para visualização mobile.

>Em Andamento / Próximos Passos
[ ] Construção do fluxo completo de marcação de checkboxes de conclusão de exercícios.
[ ] Componentização final do ExerciseItemComponent com inputs de persistência e histórico de carga.
[ ] Implementação de um HttpInterceptor global para injeção automatizada do cabeçalho Bearer Token em todas as requisições enviadas à API.
[ ] Configuração do service worker para suporte a PWA (acesso e cache local).

---

# ⚠️ Governança do Código Local

Arquivos de Ambiente
O arquivo src/environments/environment.ts armazena chaves privadas de infraestrutura e endpoints de desenvolvimento local. Ele está explicitamente adicionado ao .gitignore e nunca deve ser incluído em seus commits.

Tratamento de Regras de Negócio
O frontend não toma decisões sobre quais exercícios selecionar ou quais ordens priorizar. Ele captura a intenção do usuário, envia a requisição estruturada e renderiza o DTO retornado pelo WorkoutEngine do backend.

---

## 🚀 DEPLOY

# Para fazer o deploy na Vercel, foi feito isso:

1. Configuração de Redirecionamento (`vercel.json`)
Criado na raiz do projeto para interceptar as rotas da SPA (como `/auth`, `/dashboard`, `/renovar`) e evitar erros 404 ao atualizar a página (F5) no navegador:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

2. Script de Injeção Dinâmica de Ambiente (set-env.js)
Criado na raiz para ler as Variáveis de Ambiente da Vercel em tempo de execução no servidor de build, gerando o arquivo environment.ts automaticamente antes da compilação e sem expor chaves sensíveis no GitHub:

JavaScript
const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'environments');
const filePath = path.join(dirPath, 'environment.ts');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const envConfigFile = `export const environment = {
  production: ${process.env.PRODUCTION || 'false'},
  apiUrl: '${process.env.API_URL || 'http://localhost:8080/api'}',
  supabaseUrl: '${process.env.SUPABASE_URL || ''}',
  supabaseKey: '${process.env.SUPABASE_KEY || ''}'
};
`;

fs.writeFileSync(filePath, envConfigFile);
console.log(`✅ environment.ts gerado com sucesso em: ${filePath}`);

3. Automação do Pipeline de Build (package.json)
O script de build foi alterado para garantir que o script gerador de ambiente rode imediatamente antes do compilador do Angular (ng build):

"scripts": {
  "build": "node set-env.js && ng build"
}

4. Configuração das Variáveis de Ambiente na Vercel
Ao importar o repositório no painel da Vercel, as seguintes chaves precisam ser cadastradas na aba de Environment Variables:
PRODUCTION: true
API_URL: URL da API do backend hospedada no Render (https://sua-api.onrender.com/api)
SUPABASE_URL: URL do seu projeto no Supabase
SUPABASE_KEY: A sua chave pública anônima (anon key) do Supabase


# 📄 Licença

Projeto privado para fins de estudo, engenharia de software aplicada, e experimentação de sistemas inteligentes de prescrição de treino.