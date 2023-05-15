---
title: Criando um projeto
---

A maneira mais fácil de começar a construir uma aplicação de SvelteKit é executar `npm create`:

```bash
npm create svelte@latest my-app
cd my-app
npm install
npm run dev
```

O primeiro comando estruturará um novo projeto no diretório `my-app` perguntando-te se gostarias de configurar algum ferramental básico tal como TypeScript. Consulte as Questões Frequentes por [indicações sobre configurar ferramental adicional](/faq#integrations). Os comandos subsequentes depois instalarão suas dependências e começará um servidor no [localhost:5173](http://localhost:5173).

Existem dois conceitos básicos:

- Cada página da tua aplicação é um componente de [Svelte](https://svelte.dev).
- Tu crias páginas adicionando ficheiros ao diretório `src/routes` do teu projeto. Estes serão interpretado pelo servidor para que a primeira visita do utilizador à tua aplicação seja o mais rápido possível, depois a aplicação no lado do cliente assume o controlo.

Experimente editar os ficheiros para sentires como tudo funciona.

## Configuração do editor

Nós recomendamos usar o [Visual Studio Code (mais conhecido como VS Code)](https://code.visualstudio.com/download) com [a extensão de Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode), mas [também existe suporte para numerosos outros editores](https://sveltesociety.dev/tools#editor-support).
