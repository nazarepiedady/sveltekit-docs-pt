---
title: Carregando Dados
---

Antes dum componente [`+page.svelte`](routing#page-page-svelte) (e os seus componentes que contém [`+layout.svelte`](routing#layout-layout-svelte)) poderem ser interpretados, frequentemente precisamos receber alguns dados. Isto é feito definindo as funções `load`.

## Dados da Página

Um ficheiro `+page.svelte` pode ter um `+page.js` irmão que exporta uma função `load`, o valor de retorno do que está disponível a uma página através da propriedade `data`:

```js
/// file: src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
}
```

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

Graças ao módulo `$types` gerado, obtemos a segurança de tipo completa.

Uma função `load` num ficheiro `+page` executa ambos no servidor e no navegador (a menos que combinada com `export const ssr = false`, no qual caso esta [apenas executará no navegador](https://kit.svelte.dev/docs/page-options#ssr)). Se a nossa função `load` deveria _sempre_ executar no servidor (porque esta usa variáveis de ambiente privadas, por exemplo, ou acessa uma base de dados) então esta iria num `+page.server.js`.

Uma versão mais realística da nossa função `load` da publicação de blogue, que apenas executa no servidor e puxa dados a partir duma base de dados, seria parecida com isto:

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

Repara que o tipo mudou de `PageLoad` à `PageServerLoad`, porque as funções `load` do servidor podem acessar argumentos adicionais. Para entender quando usar `+page.js` e quando usar `+page.server.js`, consultar [Universal vs servidor](load#universal-vs-servidor).

## Dados da Disposição

Nossos ficheiros `+layout.svelte` também podem carregar dados, através de `+layout.js` ou `+layout.server.js`:

```js
/// file: src/routes/blog/[slug]/+layout.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

```svelte
<!--- file: src/routes/blog/[slug]/+layout.svelte --->
<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<main>
	<!-- +page.svelte é interpretado neste <slot> -->
	<slot />
</main>

<aside>
	<h2>More posts</h2>
	<ul>
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}">
					{post.title}
				</a>
			</li>
		{/each}
	</ul>
</aside>
```

Os dados retornados a partir das funções `load` da disposição estão disponíveis aos componentes filhos de `+layout.svelte` e o componente `+page.svelte` bem como a disposição que a qual esta 'pertence':

```diff
/// file: src/routes/blog/[slug]/+page.svelte
<script>
+	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	export let data;

+	// nós podemos acessar `data.posts` porque é retornada
+	// a partir da função `load` da disposição pai
+	$: index = data.posts.findIndex(post => post.slug === $page.params.slug);
+	$: next = data.posts[index - 1];
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

+{#if next}
+	<p>Next post: <a href="/blog/{next.slug}">{next.title}</a></p>
+{/if}
```

> Se várias funções `load` retornarem dados com a mesma chave, o último 'vence' — o resultado duma `load` de disposição retornando `{ a: 1, b: 2 }` e uma `load` de página retornando `{ b: 3, c: 4 }` seria `{ a: 1, b: 3, c: 4 }`.

## `$page.data`

O componente `+page.svelte`, e cada componente `+layout.svelte` acima deste, tem acesso ao seus próprios dados mais todos os dados do seus componentes pai.

Em alguns casos, podemos precisar do oposto — um disposição pai pode precisar acessar os dados da página ou dados a partir duma disposição filho. Por exemplo, a disposição de raiz pode querer acessar uma propriedade `title` retornada a partir duma função `load` no `+page.js` ou `+page.server`. Isto pode ser feito com `$page.data`:

```svelte
<!--- file: src/routes/+layout.svelte --->
<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data.title}</title>
</svelte:head>
```

A informação de tipo para `$page.data` é fornecida pela `App.PageData`.

## Universal vs Servidor

Conforme vimos, existe dois tipos de função `load`:

* Os ficheiros `+page.js` e `+layout.js` exportam funções `load` _universais_ que executam ambas no servidor e no navegador
* Os ficheiros `+page.server.js` e `+layout.server.js` exportam funções `load` do _servidor_ que apenas executam no lado do servidor

Concetualmente, são a mesma coisa, mas existem algumas diferenças importantes a ter-se consciência.

### Quando é Que a Função de Carregamento é Executada?

As funções `load` do servidor _sempre_ executam sobre o servidor.

Por padrão, as funções `load` universais executam sobre o servidor durante a interpretação do lado do servidor quando o utilizador visita a nossa página pela primeira vez. Estas então executarão novamente durante a hidratação, reutilizando quaisquer respostas das [requisições de pesquisa](#making-fetch-requests). Todas as invocações subsequentes das funções `load` universais acontecem no navegador. Nós podemos personalizar o comportamento através das [opções da página](page-options). Se desativarmos a [interpretação do lado do servidor](page-options#ssr), obteremos uma aplicação de página única e funções `load` universais que _sempre_ executam sobre o cliente.

Uma função `load` é invocada na execução, a menos que [pré-interpretemos](page-options#prerender) a página — neste caso, é invocada na construção.

### Entrada

Ambas funções `load` do servidor e universais têm acesso às propriedades descrevendo a requisição (`params`, `route`, e `url`) e várias funções (`fetch`, `setHeaders`, `parent` e `depends`). Estas são descritas nas seguintes seções.

As funções `load` do servidor são chamadas com um `ServerLoadEvent`, que herda `clientAddress`, `cookies`, `locals`, `platform`, e `request` da `RequestEvent`.

As funções `load` universais são chamadas com um `LoadEvent`, que tem uma propriedade `data`. Se tivermos funções `load` em ambos `+page.js` e `+page.server.js` (ou `+layout.js` e `+layout.server.js`), o valor de retorno da função `load` do servidor é a propriedade `data` do argumento da função `load` universal.

### Saída

Uma função `load` universal pode retornar um objeto que contém quaisquer valores, incluindo coisas como classes personalizadas e construtores de componente.

Um função `load` do servidor deve retornar dados que podem ser serializados com [`devalue`](https://github.com/rich-harris/devalue) — qualquer coisa que pode ser representada como JSON mais coisas como `BigInt`, `Date`, `Map`, `Set` e `RegExp`, ou referências repetidas ou cíclicas — para que possa ser transportado sobre a rede. Nossos dados podem incluir [promessas](#streaming-with-promises), casos em que serão transmitidos aos navegadores.

### Quando Usar Qual

As funções `load` do servidor são convenientes quando precisamos acessar os dados diretamente a partir duma base de dados ou sistema de ficheiro, ou precisamos usar variáveis de ambiente privadas.

As funções `load` universais são úteis quando precisamos pedir dados duma API externa e não precisamos de credenciais privadas, uma vez que a SvelteKit pode obter os dados diretamente da API ao invés ir através do nosso servidor. Estas também são úteis quando precisamos retornar algo que não pode ser serializado, tais como um construtor de componente da Svelte.

Em raros casos, podemos precisar usar ambas em conjunto — por exemplo, podemos precisar retornar uma instância duma classe personalizada que era inicializada com os dados do nosso servidor.

## Usando Dados da URL

Often the `load` function depends on the URL in one way or another. For this, the `load` function provides you with `url`, `route` and `params`.

### url

An instance of [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL), containing properties like the `origin`, `hostname`, `pathname` and `searchParams` (which contains the parsed query string as a [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object). `url.hash` cannot be accessed during `load`, since it is unavailable on the server.

> In some environments this is derived from request headers during server-side rendering. If you're using [adapter-node](adapter-node), for example, you may need to configure the adapter in order for the URL to be correct.

### route

Contains the name of the current route directory, relative to `src/routes`:

```js
/// file: src/routes/a/[b]/[...c]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ route }) {
	console.log(route.id); // '/a/[b]/[...c]'
}
```

### params

`params` is derived from `url.pathname` and `route.id`.

Given a `route.id` of `/a/[b]/[...c]` and a `url.pathname` of `/a/x/y/z`, the `params` object would look like this:

```json
{
	"b": "x",
	"c": "y/z"
}
```

## Making fetch requests

To get data from an external API or a `+server.js` handler, you can use the provided `fetch` function, which behaves identically to the [native `fetch` web API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) with a few additional features:

- It can be used to make credentialed requests on the server, as it inherits the `cookie` and `authorization` headers for the page request.
- It can make relative requests on the server (ordinarily, `fetch` requires a URL with an origin when used in a server context).
- Internal requests (e.g. for `+server.js` routes) go directly to the handler function when running on the server, without the overhead of an HTTP call.
- During server-side rendering, the response will be captured and inlined into the rendered HTML by hooking into the `text` and `json` methods of the `Response` object. Note that headers will _not_ be serialized, unless explicitly included via [`filterSerializedResponseHeaders`](hooks#server-hooks-handle).
- During hydration, the response will be read from the HTML, guaranteeing consistency and preventing an additional network request - if you received a warning in your browser console when using the browser `fetch` instead of the `load` `fetch`, this is why.

```js
/// file: src/routes/items/[id]/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	const item = await res.json();

	return { item };
}
```

## Cookies

A server `load` function can get and set [`cookies`](types#public-types-cookies).

```js
/// file: src/routes/+layout.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getUser(sessionid: string | undefined): Promise<{ name: string, avatar: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');

	return {
		user: await db.getUser(sessionid)
	};
}
```

Cookies will only be passed through the provided `fetch` function if the target host is the same as the SvelteKit application or a more specific subdomain of it.

For example, if SvelteKit is serving my.domain.com:
- domain.com WILL NOT receive cookies
- my.domain.com WILL receive cookies
- api.domain.dom WILL NOT receive cookies
- sub.my.domain.com WILL receive cookies

Other cookies will not be passed when `credentials: 'include'` is set, because SvelteKit does not know which domain which cookie belongs to (the browser does not pass this information along), so it's not safe to forward any of them. Use the [handleFetch hook](hooks#server-hooks-handlefetch) to work around it.

> When setting cookies, be aware of the `path` property. By default, the `path` of a cookie is the current pathname. If you for example set a cookie at page `admin/user`, the cookie will only be available within the `admin` pages by default. In most cases you likely want to set `path` to `'/'` to make the cookie available throughout your app.

## Headers

Both server and universal `load` functions have access to a `setHeaders` function that, when running on the server, can set headers for the response. (When running in the browser, `setHeaders` has no effect.) This is useful if you want the page to be cached, for example:

```js
// @errors: 2322 1360
/// file: src/routes/products/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	const url = `https://cms.example.com/products.json`;
	const response = await fetch(url);

	// cache the page for the same length of time
	// as the underlying data
	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});

	return response.json();
}
```

Setting the same header multiple times (even in separate `load` functions) is an error — you can only set a given header once. You cannot add a `set-cookie` header with `setHeaders` — use `cookies.set(name, value, options)` instead.

## Using parent data

Occasionally it's useful for a `load` function to access data from a parent `load` function, which can be done with `await parent()`:

```js
/// file: src/routes/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return { a: 1 };
}
```

```js
/// file: src/routes/abc/+layout.js
/** @type {import('./$types').LayoutLoad} */
export async function load({ parent }) {
	const { a } = await parent();
	return { b: a + 1 };
}
```

```js
/// file: src/routes/abc/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { a, b } = await parent();
	return { c: a + b };
}
```

```svelte
<!--- file: src/routes/abc/+page.svelte --->
<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<!-- renders `1 + 2 = 3` -->
<p>{data.a} + {data.b} = {data.c}</p>
```

> Notice that the `load` function in `+page.js` receives the merged data from both layout `load` functions, not just the immediate parent.

Inside `+page.server.js` and `+layout.server.js`, `parent` returns data from parent `+layout.server.js` files.

In `+page.js` or `+layout.js` it will return data from parent `+layout.js` files. However, a missing `+layout.js` is treated as a `({ data }) => data` function, meaning that it will also return data from parent `+layout.server.js` files that are not 'shadowed' by a `+layout.js` file

Take care not to introduce waterfalls when using `await parent()`. Here, for example, `getData(params)` does not depend on the result of calling `parent()`, so we should call it first to avoid a delayed render.

```diff
/// file: +page.js
/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
-	const parentData = await parent();
	const data = await getData(params);
+	const parentData = await parent();

	return {
		...data
		meta: { ...parentData.meta, ...data.meta }
	};
}
```

## Errors

If an error is thrown during `load`, the nearest [`+error.svelte`](routing#error) will be rendered. For _expected_ errors, use the `error` helper from `@sveltejs/kit` to specify the HTTP status code and an optional message:

```js
/// file: src/routes/admin/+layout.server.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user?: {
			name: string;
			isAdmin: boolean;
		}
	}
}

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		throw error(401, 'not logged in');
	}

	if (!locals.user.isAdmin) {
		throw error(403, 'not an admin');
	}
}
```

If an _unexpected_ error is thrown, SvelteKit will invoke [`handleError`](hooks#shared-hooks-handleerror) and treat it as a 500 Internal Error.

## Redirects

To redirect users, use the `redirect` helper from `@sveltejs/kit` to specify the location to which they should be redirected alongside a `3xx` status code.

```js
/// file: src/routes/user/+layout.server.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user?: {
			name: string;
		}
	}
}

// @filename: index.js
// ---cut---
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		throw redirect(307, '/login');
	}
}
```

> Don't use `throw redirect()` from within a try-catch block, as the redirect will immediately trigger the catch statement.

In the browser, you can also navigate programmatically outside of a `load` function using [`goto`](modules#$app-navigation-goto) from [`$app.navigation`](modules#$app-navigation).

## Streaming with promises

Promises at the _top level_ of the returned object will be awaited, making it easy to return multiple promises without creating a waterfall. When using a server `load`, _nested_ promises will be streamed to the browser as they resolve. This is useful if you have slow, non-essential data, since you can start rendering the page before all the data is available:

```js
/// file: src/routes/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		one: Promise.resolve(1),
		two: Promise.resolve(2),
		streamed: {
			three: new Promise((fulfil) => {
				setTimeout(() => {
					fulfil(3)
				}, 1000);
			})
		}
	};
}
```

This is useful for creating skeleton loading states, for example:

```svelte
<!--- file: src/routes/+page.svelte --->
<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<p>
	one: {data.one}
</p>
<p>
	two: {data.two}
</p>
<p>
	three:
	{#await data.streamed.three}
		Loading...
	{:then value}
		{value}
	{:catch error}
		{error.message}
	{/await}
</p>
```

> On platforms that do not support streaming, such as AWS Lambda, responses will be buffered. This means the page will only render once all promises resolve. If you are using a proxy (e.g. NGINX), make sure it does not buffer responses from the proxied server.

> Streaming data will only work when JavaScript is enabled. You should avoid returning nested promises from a universal `load` function if the page is server rendered, as these are _not_ streamed — instead, the promise is recreated when the function reruns in the browser.

> The headers and status code of a response cannot be changed once the response has started streaming, therefore you cannot `setHeaders` or throw redirects inside a streamed promise.

## Parallel loading

When rendering (or navigating to) a page, SvelteKit runs all `load` functions concurrently, avoiding a waterfall of requests. During client-side navigation, the result of calling multiple server `load` functions are grouped into a single response. Once all `load` functions have returned, the page is rendered.

## Rerunning load functions

SvelteKit tracks the dependencies of each `load` function to avoid rerunning it unnecessarily during navigation.

For example, given a pair of `load` functions like these...

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

```js
/// file: src/routes/blog/[slug]/+layout.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

...the one in `+page.server.js` will rerun if we navigate from `/blog/trying-the-raw-meat-diet` to `/blog/i-regret-my-choices` because `params.slug` has changed. The one in `+layout.server.js` will not, because the data is still valid. In other words, we won't call `db.getPostSummaries()` a second time.

A `load` function that calls `await parent()` will also rerun if a parent `load` function is rerun.

Dependency tracking does not apply _after_ the `load` function has returned — for example, accessing `params.x` inside a nested [promise](#streaming-with-promises) will not cause the function to rerun when `params.x` changes. (Don't worry, you'll get a warning in development if you accidentally do this.) Instead, access the parameter in the main body of your `load` function.

### Manual invalidation

You can also rerun `load` functions that apply to the current page using [`invalidate(url)`](modules#$app-navigation-invalidate), which reruns all `load` functions that depend on `url`, and [`invalidateAll()`](modules#$app-navigation-invalidateall), which reruns every `load` function. Server load functions will never automatically depend on a fetched `url` to avoid leaking secrets to the client.

A `load` function depends on `url` if it calls `fetch(url)` or `depends(url)`. Note that `url` can be a custom identifier that starts with `[a-z]:`:

```js
/// file: src/routes/random-number/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends }) {
	// load reruns when `invalidate('https://api.example.com/random-number')` is called...
	const response = await fetch('https://api.example.com/random-number');

	// ...or when `invalidate('app:random')` is called
	depends('app:random');

	return {
		number: await response.json()
	};
}
```

```svelte
<!--- file: src/routes/random-number/+page.svelte --->
<script>
	import { invalidate, invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;

	function rerunLoadFunction() {
		// any of these will cause the `load` function to rerun
		invalidate('app:random');
		invalidate('https://api.example.com/random-number');
		invalidate(url => url.href.includes('random-number'));
		invalidateAll();
	}
</script>

<p>random number: {data.number}</p>
<button on:click={rerunLoadFunction}>Update random number</button>
```

### When do load functions rerun?

To summarize, a `load` function will rerun in the following situations:

- It references a property of `params` whose value has changed
- It references a property of `url` (such as `url.pathname` or `url.search`) whose value has changed. Properties in `request.url` are _not_ tracked
- It calls `await parent()` and a parent `load` function reran
- It declared a dependency on a specific URL via [`fetch`](#making-fetch-requests) (universal load only) or [`depends`](types#public-types-loadevent), and that URL was marked invalid with [`invalidate(url)`](modules#$app-navigation-invalidate)
- All active `load` functions were forcibly rerun with [`invalidateAll()`](modules#$app-navigation-invalidateall)

`params` and `url` can change in response to a `<a href="..">` link click, a [`<form>` interaction](form-actions#get-vs-post), a [`goto`](modules#$app-navigation-goto) invocation, or a [`redirect`](modules#sveltejs-kit-redirect).

Note that rerunning a `load` function will update the `data` prop inside the corresponding `+layout.svelte` or `+page.svelte`; it does _not_ cause the component to be recreated. As a result, internal state is preserved. If this isn't what you want, you can reset whatever you need to reset inside an [`afterNavigate`](modules#$app-navigation-afternavigate) callback, and/or wrap your component in a [`{#key ...}`](https://svelte.dev/docs#template-syntax-key) block.

## Further reading

- [Tutorial: Loading data](https://learn.svelte.dev/tutorial/page-data)
- [Tutorial: Errors and redirects](https://learn.svelte.dev/tutorial/error-basics)
- [Tutorial: Advanced loading](https://learn.svelte.dev/tutorial/await-parent)
