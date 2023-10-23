---
title: Roteamento
---

No coração da SvelteKit está um _roteador baseado no sistema de ficheiro_. As rotas da nossa aplicação — ou seja, os caminhos de URL que os utilizadores podem acessar — são definidos pelos diretórios na nossa base de código:

- `src/routes` é a rota de raiz
- `src/routes/about` cria uma rota `/about`
- `src/routes/blog/[slug]` cria uma rota com um _parâmetro_, `slug`, que pode ser usado para carregar os dados dinamicamente quando o utilizador requisitar uma página como `/blog/hello-world`

> Nós podemos mudar `src/routes` para um diretório diferente editando a [configuração do projeto](configuration).

Cada diretório de rota contem um ou mais _ficheiros de rota_, que podem ser identificados por seu prefixo `+`.

## `+page`

### `+page.svelte`

Um componente `+page.svelte` define uma página da nossa aplicação. Por padrão, as páginas são interpretadas em ambos no servidor ([SSR](glossary#ssr)) para a requisição inicial e no navegador ([CSR](glossary#csr)) para a navegação subsequente:

```svelte
/// file: src/routes/+page.svelte
<h1>Hello and welcome to my site!</h1>
<a href="/about">About my site</a>
```

```svelte
/// file: src/routes/about/+page.svelte
<h1>About this site</h1>
<p>TODO...</p>
<a href="/">Home</a>
```

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>
```

> Nota que a SvelteKit usa os elementos `<a>` para navegar entre as rotas, ao invés dum componente `<Link>` específico da abstração.

### `+page.js`

Muitas vezes, uma página precisará de carregar alguns dados antes de puder ser desenhada. Para isto, adicionamos um módulo `+page.js` que exporta uma função `load`:

```js
/// file: src/routes/blog/[slug]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	throw error(404, 'Not found');
}
```

Esta função executa ao lado do `+page.svelte`, o que significa que executa no servidor durante a interpretação do lado do servidor e no navegador durante a navegação do lado do cliente. Consulte [`load`](load) por detalhes completos da API.

Bem como `load`, `+page.js` pode  exportar valores que configuram o comportamento da página:

- `export const prerender = true` ou `false` ou `'auto'`
- `export const ssr = true` ou `false`
- `export const csr = true` ou `false`

Nós podemos encontrar mais informação sobre estes nas [opções da página](page-options).

### `+page.server.js`

Se a nossa função `load` puder apenas executar no servidor — por exemplo, se precisa de requisitar dados a partir duma base de dados ou precisamos acessar [variáveis de ambiente](modules#$env-static-private) privadas como chaves da API — então podemos renomear `+page.js` para `+page.server.js` e mudar o tipo de `PageLoad` para `PageServerLoad`:

```js
/// file: src/routes/blog/[slug]/+page.server.js

// @filename: ambient.d.ts
declare global {
	const getPostFromDatabase: (slug: string) => {
		title: string;
		content: string;
	}
}

export {};

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await getPostFromDatabase(params.slug);

	if (post) {
		return post;
	}

	throw error(404, 'Not found');
}
```

Durante a navegação do lado do cliente, a SvelteKit carregará este dado a partir do servidor, o que significa que o valor retornado deve ser serivalizável usando [`devalue`](https://github.com/rich-harris/devalue). Consulte a [`load`](load) por detalhes completos da API.

Tal como `+page.js`, `+page.server.js` pode exportar as [opções da página](page-options) — `prerender`, `ssr`, e `csr`.

Um ficheiro `+page.server.js` também pode exportar _ações_. Se `load` permite-nos ler dados do servidor, `actions` permite-nos escrever dados _ao_ servidor usando o elemento `<form>`. Para aprender como usá-los consulte a seção [ações de formulário](form-actions).

## `+error`

Se um erro ocorrer durante a `load`, a SvelteKit desenhará uma página de erro padrão. Nós podemos personalizar esta página de erro numa base por rota adicionando um ficheiro `+error.svelte`:

```svelte
/// file: src/routes/blog/[slug]/+error.svelte
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error.message}</h1>
```

A SvelteKit 'percorrerá a árvore' à procura do limite do erro mais próximo — se o ficheiro acima não existisse, tentaria `src/routes/blog/+error.svelte` e depois `src/routes/+error.svelte` antes de desenhar a página de erro padrão. Se _isto_ falhar (se o erro foi lançado a partir da função `load` do `+layout` de raiz, que situa-se 'acima' do `+error` de raiz), a SvelteKit sairá e desenhará uma página de erro de retrocesso estático, que podemos personalizar criando um ficheiro `src/error.html`.

Se o erro ocorrer dentro duma função `load` no `+layout(.server).js`, o limite do erro mais próximo na árvore é um ficheiro `+error.svelte` _acima_ desta disposição (não próximo à mesma).

Se nenhuma rota puder ser encontrada (404), `src/routes/+error.svelte` (ou a página de erro padrão, se este ficheiro não existir) será usado.

> `+error.svelte` _não_ é usado quando um erro ocorre dentro de [`handle`](hooks#server-hooks-handle) ou um manipulador de requisição do [`+server.js`](#server).

Nós podemos ler mais sobre a manipulação de erro [nesta ligação](errors).

## `+layout`

Até ao momento, tratamos as páginas como componentes inteiramente autónomos — sobre a navegação, o componente `+page.svelte` existente será destruído, e um novo ocupará o seu lugar.

Mas em muitas aplicações, existem elementos que devem ser visíveis em _todas_ as páginas, tais como navegação de alto nível ou um rodapé. No lugar de repeti-los em toda `+page.svelte`, podemos colocá-los nas _disposições_.

### `+layout.svelte`

Para criar uma disposição que aplica-se à todas as páginas, críamos um ficheiro  chamado de `src/routes/+layout.svelte`. A disposição padrão (aquela que a Svelte usa se não trouxermos a nossa própria) parece-se com isto...:

```html
<slot></slot>
```

...mas podemos adicionar qualquer marcação, estilos e comportamento que quisermos. O único requisito é que o componente inclua um `<slot>` para o conteúdo da página. Por exemplo, vamos adicionar uma barra de navegação:

```html
/// file: src/routes/+layout.svelte
<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/settings">Settings</a>
</nav>

<slot></slot>
```

Se criarmos páginas para `/`, `/about` e `/settings`...:

```html
/// file: src/routes/+page.svelte
<h1>Home</h1>
```

```html
/// file: src/routes/about/+page.svelte
<h1>About</h1>
```

```html
/// file: src/routes/settings/+page.svelte
<h1>Settings</h1>
```

...a navegação sempre estará visível, e clicando entre as três páginas apenas resultará no `<h1>` sendo substituído.

As disposições podem ser _encaixadas_. Suponhamos que não apenas temos uma única página `/settings`, mas ao invés disto temos páginas encaixadas como `/settings/profile` e `settings/notifications` com um submenu partilhado (para um exemplo da vida real, consulte a [github.com/settings](https://github.com/settings)).

Nós podemos criar uma disposição que apenas aplica-se às páginas abaixo de `/settings` (enquanto herdamos a disposição de raiz com a navegação de alto nível):

```svelte
/// file: src/routes/settings/+layout.svelte
<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<h1>Settings</h1>

<div class="submenu">
	{#each data.sections as section}
		<a href="/settings/{section.slug}">{section.title}</a>
	{/each}
</div>

<slot></slot>
```

Por padrão, cada disposição herda a disposição acima da mesma. Algumas vezes que isto não é o que queremos - neste caso, as [disposições avançadas](advanced-routing#advanced-layouts) podem ajudar-nos.

### `+layout.js`

Tal como `+page.svelte` carrega dados a partir de `+page.js`, o nosso componente `+layout.svelte` pode receber dados a partir duma função [`load`](load) no `+layout.js`:

```js
/// file: src/routes/settings/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
}
```

Se um `+layout.js` exportar [opções de página](page-options) — `prerender`, `ssr` e `csr` — serão usadas como padrões para as páginas do filho.

Os dados retornados a partir duma função `load` da disposição também está disponível em todas as páginas do seu filho:

```svelte
/// file: src/routes/settings/profile/+page.svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;

	console.log(data.sections); // [{ slug: 'profile', title: 'Profile' }, ...]
</script>
```

> Muitas vezes, os dados da disposição estão inalterados quando navegamos entre as páginas. a Svelte executará novamente de maneira inteligente as funções [`load`](load) quando necessário.

### `+layout.server.js`

Para executar a função `load` da nossa disposição no servidor, a movemos para `+layout.server.js`, e mudamos o tipo de `LayoutLoad` para `LayoutServerLoad`.

Tal como `+layout.js`, `+layout.server.js` pode exportar as [opções de página](page-options) — `prerender`, `ssr` e `csr`.

## `+server`

Bem como as páginas, podemos definir rotas com um ficheiro `+server.js` (algumas vezes remete-nos à como uma 'rota da API' ou um 'destino'), que dá-nos o controlo total sobre a resposta. O nosso ficheiro `+server.js` exporta funções correspondentes aos verbos de HTTP como `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, e `OPTIONS` que recebem um argumento `RequestEvent` e retornam um objeto de [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

Por exemplo, poderíamos criar uma rota `api/random-number` com um manipulador de `GET`:

```js
/// file: src/routes/api/random-number/+server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	const d = max - min;

	if (isNaN(d) || d < 0) {
		throw error(400, 'min and max must be numbers, and min must be less than max');
	}

	const random = min + Math.random() * d;

	return new Response(String(random));
}
```

O primeiro argumento para `Response` pode ser um [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), tornando possível fluir grandes quantidades de dados ou criar eventos enviados do servidor (a menos que implementemos em produção em plataformas que amortecem as respostas, tal como AWS Lambda).

Nós podemos usar os métodos [`error`](modules#sveltejs-kit-error), [`redirect`](modules#sveltejs-kit-redirect) e [`json`](modules#sveltejs-kit-json) do `@sveltejs/kit` por conveniência (mas não temos de o fazer).

Se um erro for lançado (ou `throw erro(...)` ou um erro inesperado), a resposta será uma representação de JSON do erro ou uma página de erro de retrocesso — que pode ser personalizada através de `src/error.html` — dependendo do cabeçalho `Accept`. O componente [`+error.svelte`](#error) _não_ será desenhado neste caso. Nós podemos ler mais sobre a manipulação de erro [nesta ligação](erros).

> Quando críamos um manipulador de `OPTIONS`, nota que a Vite injetará os cabeçalhos `Access-Control-Allow-Origin` e `Access-Control-Allow-Methods` — estes não estarão presentes em produção a menos que os adicionemos.

### Recebendo Dados

Com a exportação dos manipuladores de `POST`/`PUT`/`PATCH`/`DELETE`/`OPTIONS`, os ficheiros `+server.js` podem ser usados para criar uma API completa:

```svelte
/// file: src/routes/add/+page.svelte
<script>
	let a = 0;
	let b = 0;
	let total = 0;

	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json'
			}
		});

		total = await response.json();
	}
</script>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button on:click={add}>Calculate</button>
```

```js
/// file: src/routes/api/add/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

> Em geral, as [ações de formulário](form-actions) são uma maneira melhor de submeter os dados a partir dos navegadores ao servidor.

### Navegação do Conteúdo

Os ficheiros `+server.js` podem ser colocados no mesmo diretório que os ficheiros `+page`, permitindo a mesma rota ser ou uma página ou um destino de API. Para determinar quais, a SvelteKit aplica as seguintes regras:

- As requisições de `PUT`/`PATCH`/`DELETE`/`OPTIONS` são sempre manipuladas pelo `+server.js` uma vez que não aplicam-se às páginas
- As requisições de `GET`/`POST` são tratadas como requisições de página se o cabeçalho `accept` priorizar `text/html` (em outras palavras, é uma requisição de página do navegador), ou são manipuladas pelo `+server.js`

## $types

Em todos os exemplos acima, estávamos a importar os tipos a partir dum ficheiro `$types.d.ts`. Este é um ficheiro que a SvelteKit cria para nós num diretório escondido se estivermos a usar a TypeScript (ou JavaScript com as anotações de tipo da JSDoc) para dar-nos segurança de tipo quando trabalhamos com os nossos ficheiros de raiz.

Por exemplo, anotar `export let data` com `PageData` (ou `LayoutData`, para um ficheiro `+layout.svelte`) diz a TypeScript que o tipo do `data` é tudo aquilo que foi retornado a partir da `load`:

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>
```

Como consequência, anotar a função `load` com `PageLoad`, `PageServerLoad`, `LayoutLoad` ou `LayoutServerLoad` (para `+page.js`, `+page.server.js`, `+layout.js` e `+layout.server.js` respetivamente) garante que o `params` e o valor de retorno estão corretamente tipificados.

Se estivermos a usar o VS Code ou qualquer ambiente de desenvolvimento integrado que suporta o protocolo de servidor de linguagem e extensões de TypeScript então podemos omitir estes tipos _inteiramente_! O ferramental de ambiente de desenvolvimento integrado da Svelte inserirá os tipos corretos para nós, assim receberemos a verificação de tipo sem as escrevermos por conta própria. Também funciona com a nossa ferramenta da linha de comando `svelte-check`.

Nós podemos ler mais sobre a omissão de `$types` na nossa [publicação de blogue](https://svelte-docs-pt.vercel.app/blog/zero-config-type-safety) sobre isto.

## Outros Ficheiros

Quaisquer outros ficheiros dentro do diretório de rota são ignorados pela SvelteKit. Isto significa que podemos colocar componentes e módulos utilitários com as rotas que precisam deles.

Se os componentes e módulos forem necessários por várias rotas, é uma boa ideia colocá-los no [`$lib`](modules#$lib).

## Leituras Avançadas

- [Seminário Interativo: Roteamento](https://learn-svelte-pt.vercel.app/tutorial/pages)
- [Seminário Interativo: Rotas da API](https://learn-svelte-pt.vercel.app/tutorial/get-handlers)
- [Documentação: Roteamento Avançado](advanced-routing)
