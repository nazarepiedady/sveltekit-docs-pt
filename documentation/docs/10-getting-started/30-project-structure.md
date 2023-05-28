---
title: Estrutura do projeto
---

Um projeto de SvelteKit normal parece-se com isto:

```bash
my-project/
├ src/
│ ├ lib/
│ │ ├ server/
│ │ │ └ [your server-only lib files]
│ │ └ [your lib files]
│ ├ params/
│ │ └ [your param matchers]
│ ├ routes/
│ │ └ [your routes]
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ └ hooks.server.js
├ static/
│ └ [your static assets]
├ tests/
│ └ [your tests]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

Também encontrarás ficheiros comuns como `.gitignore` e `.npmrc` (e `.prettierrc` e `.eslintrc.cjs`) e assim por diante, se escolheste aquelas opções quando executares `npm create svelte@latest`).

## Ficheiros do projeto <span id="project-files"></span>

### src

O diretório `src` contém a carne do teu projeto. Tudo exceto `src/routes` e `src/app.html` é opcional.

- `lib` contém o código da tua biblioteca (utilitários e componentes), que podem ser importados através do pseudónimo [`$lib`](modules#$lib), ou empacotado para distribuição usando [`svelte-package`](packaging).
	- `server` contém apenas o código da tua biblioteca do servidor. Ele pode ser importado usando o pseudónimo [`$lib/server`](server-only-modules). A SvelteKit impedir-te-á de importar estes no código do cliente.
- `params` contém quaisquer [correspondentes de parâmetro](advanced-routing#matching) que a tua aplicação precisa
- `routes` contém as [rotas](routing) da tua aplicação. Tu podes também colocar neste, outros componentes que apenas são usados dentro numa única rota.
- `app.html` é o modelo de marcação de hipertexto da tua página — um documento de HTML contendo os seguintes espaços reservados:
	- `%sveltekit.head%` — os elementos `<link>` e `<script>` necessários pela aplicação, mais qualquer conteúdo de `<svelte:head>`.
	- `%sveltekit.body%` — a marcação para uma página interpretada. Isto deve morar dentro dum `<div>` ou outro elemento, ao invés de diretamente dentro de `<body>`, para evitar erros de programação causados pelas extensões de navegador injetando elementos que são depois destruídos pelo processo de hidratação. A SvelteKit avisar-te-á no desenvolvimento se este não for o caso.
	- `%sveltekit.assets%` — ou [`paths.assets`](configuration#paths), se especificado, ou um caminho relativo para [`paths.base`](configuration#paths)
	- `%sveltekit.nonce%` — um [CSP](configuration#csp) usado para ligações e programas incluídos manualmente, se usados.
	- `%sveltekit.env.[NAME]%` - isto será substituído no momento da interpretação com a variável de ambiente `[NAME]`, que deve começar com a [`publicPrefix`](configuration#env) (normalmente `PUBLIC_`). Isto retornará para `''` se não for correspondido.
- `error.html` é a página que é desenhada quando todo o resto falhar. Ela pode conter os seguintes espaços reservados:
	- `%sveltekit.status%` — o estado do HTTP
  - `%sveltekit.error.message%` — a mensagem do erro
- `hooks.client.js` contém os teus [gatilhos](/docs/hooks) de cliente
- `hooks.server.js` contém os teus [gatilhos](/docs/hooks) de servidor
- `service-worker.js` contém o teu [operário de serviço](/docs/service-workers)

(Se o projeto contém ficheiros `.js` ou `.ts` depende se optares usar TypeScript quando crias o teu projeto. Tu podes alternar entre JavaScript e TypeScript na documentação usando o alternador no fundo desta página.)

Se adicionaste a [Vitest](https://vitest.dev) quando configuraste o teu projeto, os teus testes unitários morarão no diretório `src` com uma extensão `.test.js`.

### static

Quaisquer recursos estáticos que deveriam ser servidos como estão, como `robots.txt` ou `favicon.png`.

### tests

Se adicionaste [Playwright](https://playwright.dev/) para testes de navegador quando configuraste o teu projeto, os testes morarão neste diretório.

### package.json

O teu ficheiro `package.json` deve incluir `@sveltejs/kit`, `svelte` e `vite` como `devDependencies`.

Quando crias um projeto com `npm create svelte@latest`, também notarás que `package.json` inclui `"type": "module"`. Isto significa que os ficheiros `.js` são interpretados como módulos de JavaScript nativos com as palavras-chaves `import` e `export`. Os ficheiros de CommonJS legados precisam de um extensão `.cjs`.

### svelte.config.js

Este ficheiro contém a tua [configuração](configuration) da Svelte e SvelteKit.

### tsconfig.json

Este ficheiro (ou `jsconfig.json`, se preferes ficheiros `.js` de tipos verificados sobre os ficheiros `.ts`) configura a TypeScript, se adicionaste a verificação de tipo durante `npm create svelte@latest`. Já que a SvelteKit depende que certa configuração seja definida de uma maneira específica, gera o seu próprio ficheiro `.svelte-kit/tsconfig.json` que a tua própria configuração `extends`.

### vite.config.js

Um projeto de SvelteKit é realmente apenas um projeto de [Vite](https://pt.vitejs.dev) que usa a extensão [`@sveltejs/kit/vite`](modules#sveltejs-kit-vite), juntamente com qualquer outra [configuração de Vite](https://pt.vitejs.dev/config/).

## Outros ficheiros

### .svelte-kit

Conforme programares e construires o teu projeto, a SvelteKit gerará ficheiros num diretório `.svelte-kit` (configurável como [`outDir`](configuration#outdir)). Tu podes ignorar o seu conteúdo, e eliminá-los a qualquer momento (serão gerados novamente quando executares o próximo comando `dev` ou `build`).
