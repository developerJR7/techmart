# 🚀 Deploy TechMart via GitHub + Vercel (Recomendado)

A maneira mais fácil e profissional de colocar seu site no ar.

## Passo 1: Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `techmart-frontend`
3. Visibilidade: **Public** ou **Private** (você escolhe)
4. **NÃO** marque "Add a README file" (pois já temos um projeto pronto)
5. Clique em **Create repository**

## Passo 2: Enviar Código para o GitHub

Copie e rode estes comandos no seu terminal (substitua `SEU_USUARIO` pelo seu user do GitHub):

```bash
# Adicionar o link do seu repositório
git remote add origin https://github.com/SEU_USUARIO/techmart-frontend.git

# Enviar o código
git push -u origin master
```

> **Nota:** Se ele pedir senha, use seu **Personal Access Token** (não a senha da conta).

## Passo 3: Conectar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Em "Import Git Repository", procure por `techmart-frontend`
3. Clique em **Import**

## Passo 4: Configurar Variáveis (IMPORTANTE)

Na tela de configuração do deploy na Vercel:

1. Clique em **Environment Variables**
2. Adicione:
   - Name: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: `AIzaSyBCfzFcC0qh68myIuiMjUiyp29oLsdNyCY`

3. Clique em **Deploy**

## 🎉 Pronto!

Seu site estará online em minutos e toda vez que você atualizar o código no GitHub, a Vercel atualizará o site automaticamente!
