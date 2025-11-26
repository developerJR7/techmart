# 🚀 Deploy TechMart na Vercel

Guia completo para fazer deploy do seu e-commerce TechMart com IA na Vercel.

## Pré-requisitos

- Conta no GitHub
- Conta na Vercel (gratuita)
- Código do TechMart no GitHub

## Passo 1: Preparar o Repositório

### 1.1 Criar Repositório no GitHub

```bash
# Se ainda não tiver um repositório, crie um
cd c:\Users\jrmon\techmart\frontend
git init
git add .
git commit -m "Initial commit - TechMart with AI"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/techmart-frontend.git
git push -u origin main
```

### 1.2 Verificar Arquivos Necessários

Certifique-se de que estes arquivos existem:
- ✅ `package.json`
- ✅ `next.config.ts`
- ✅ `.gitignore` (deve incluir `.env.local`)

## Passo 2: Deploy na Vercel

### 2.1 Importar Projeto

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New..."** → **"Project"**
3. Selecione **"Import Git Repository"**
4. Escolha seu repositório `techmart-frontend`
5. Clique em **"Import"**

### 2.2 Configurar Projeto

Na tela de configuração:

**Framework Preset:** Next.js (detectado automaticamente)

**Root Directory:** `./` (deixe como está)

**Build Command:** `npm run build` (padrão)

**Output Directory:** `.next` (padrão)

**Install Command:** `npm install` (padrão)

### 2.3 Configurar Variáveis de Ambiente

⚠️ **IMPORTANTE**: Adicione as variáveis de ambiente:

1. Clique em **"Environment Variables"**
2. Adicione as seguintes variáveis:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | `AIzaSyBCfzFcC0qh68myIuiMjUiyp29oLsdNyCY` |
| `NEXT_PUBLIC_API_URL` | URL do seu backend (se houver) |

3. Clique em **"Deploy"**

## Passo 3: Aguardar Deploy

O deploy levará cerca de 2-5 minutos. Você verá:

1. ⏳ **Building** - Compilando o projeto
2. ⏳ **Deploying** - Fazendo upload
3. ✅ **Ready** - Pronto!

## Passo 4: Acessar Aplicação

Após o deploy, você receberá uma URL como:
```
https://techmart-frontend.vercel.app
```

## Configurações Adicionais

### Domínio Personalizado (Opcional)

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### Variáveis de Ambiente para Produção

Se precisar de valores diferentes para produção:

1. Vá em **Settings** → **Environment Variables**
2. Selecione **Production** no dropdown
3. Adicione/edite variáveis

### Proteção de Rotas Admin

Para proteger rotas admin em produção, adicione autenticação:

```typescript
// middleware.ts (criar na raiz do projeto)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Proteger rotas /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Adicionar lógica de autenticação aqui
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

## Atualizações Automáticas

Toda vez que você fizer push para o GitHub, a Vercel fará deploy automaticamente:

```bash
# Fazer mudanças
git add .
git commit -m "Atualização do chatbot"
git push

# Deploy automático será iniciado!
```

## Monitoramento

### Ver Logs

1. Acesse seu projeto na Vercel
2. Clique em **"Deployments"**
3. Selecione um deployment
4. Clique em **"View Function Logs"**

### Analytics (Opcional)

A Vercel oferece analytics gratuito:

1. Vá em **Analytics**
2. Ative **Vercel Analytics**
3. Adicione ao código (se necessário):

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Troubleshooting

### Erro: "Module not found"

**Solução**: Verifique se todas as dependências estão no `package.json`

```bash
npm install
```

### Erro: "API Key não configurada"

**Solução**: Adicione `NEXT_PUBLIC_GEMINI_API_KEY` nas variáveis de ambiente da Vercel

### Chatbot não funciona

**Solução**: 
1. Verifique se a API key está correta
2. Veja os logs de função na Vercel
3. Teste localmente primeiro

### Build falhou

**Solução**:
1. Veja os logs de build
2. Teste build localmente: `npm run build`
3. Corrija erros de TypeScript/ESLint

## Comandos Úteis

```bash
# Testar build localmente antes do deploy
npm run build
npm start

# Verificar erros de lint
npm run lint

# Limpar cache do Next.js
rm -rf .next
npm run build
```

## Recursos da Vercel Gratuita

✅ **Incluído no plano gratuito:**
- Deployments ilimitados
- 100 GB de bandwidth/mês
- Domínio .vercel.app gratuito
- SSL automático (HTTPS)
- Deploy automático via Git
- Preview deployments (branches)

## Próximos Passos

1. ✅ Fazer deploy na Vercel
2. 🔐 Adicionar autenticação admin
3. 📊 Configurar analytics
4. 🌐 Adicionar domínio personalizado (opcional)
5. 🔔 Configurar notificações de deploy

## Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)

---

**Dúvidas?** Consulte a [documentação da Vercel](https://vercel.com/docs) ou abra uma issue no GitHub.
