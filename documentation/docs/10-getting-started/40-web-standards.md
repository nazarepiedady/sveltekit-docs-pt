---
title: Padrões da Web
---

Ao longo desta documentação, verás referências as [APIs da Web](https://developer.mozilla.org/en-US/docs/Web/API) padrão sobre as quais a SvelteKit constrói. No lugar de reinventar a roda, _usamos a plataforma_, o que significa que as tuas habilidades de desenvolvimento da web existente são aplicáveis a SvelteKit. Inversamente, noutro lado o tempo gasto aprendendo a SvelteKit ajudar-te-á a ser um programador da web melhor.

Estas APIs estão disponíveis em todos os navegadores modernos e em muitos ambientes sem navegador como Operários da Cloudflare, Deno e Funções de Borda da Vercel. Durante o desenvolvimento, e nos [adaptadores](adapters) para ambientes baseados na Node (incluindo AWS Lambda), são disponibilizadas através de supridores de recursos onde necessário (por agora, isto é — a Node está rapidamente a adicionar suporte para mais padrões da web).

Em particular, estarás confortável com os seguintes:

## APIs de Requisição

A SvelteKit usa a [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) para receber dados a partir da rede. Está disponível nos [gatilhos](hooks) e bem como nas [rotas do servidor](routing#server) no navegador.

> Uma versão especial de `fetch` está disponível nas funções de [`load`](load), [gatilhos do servidor](hooks#server-hooks) e [rotas da API](routing#server) para invocar destinos diretamente durante a interpretação no lado do servidor, sem fazer uma chamada de HTTP, enquanto preserva as credenciais. (Para fazer requisições credenciadas no código do lado do servidor fora de `load`, deves passar explicitamente cabeçalhos de `cookie` e ou `authorization`). Isto também permite-te fazer requisições relativas, enquanto que a `fetch` do lado do servidor normalmente exige uma URL qualificada completamente.

Além da própria `fetch`, a [API de Requisição](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) inclui as seguintes interfaces:

### Request

An instance of [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) is accessible in [hooks](hooks) and [server routes](routing#server) as `event.request`. It contains useful methods like `request.json()` and `request.formData()` for getting data that was posted to an endpoint.

### Response

An instance of [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) is returned from `await fetch(...)` and handlers in `+server.js` files. Fundamentally, a SvelteKit app is a machine for turning a `Request` into a `Response`.

### Headers

The [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) interface allows you to read incoming `request.headers` and set outgoing `response.headers`:

```js
// @errors: 2461
/// file: src/routes/what-is-my-user-agent/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
	// log all headers
	console.log(...event.request.headers);

	return json({
		// retrieve a specific header
		userAgent: event.request.headers.get('user-agent')
	});
}
```

## FormData

When dealing with HTML native form submissions you'll be working with [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) objects.

```js
// @errors: 2461
/// file: src/routes/hello/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const body = await event.request.formData();

	// log all fields
	console.log([...body]);

	return json({
		// get a specific field's value
		name: body.get('name') ?? 'world'
	});
}
```

## Stream APIs

Most of the time, your endpoints will return complete data, as in the `userAgent` example above. Sometimes, you may need to return a response that's too large to fit in memory in one go, or is delivered in chunks, and for this the platform provides [streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) — [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) and [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream).

## URL APIs

URLs are represented by the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) interface, which includes useful properties like `origin` and `pathname` (and, in the browser, `hash`). This interface shows up in various places — `event.url` in [hooks](hooks) and [server routes](routing#server), [`$page.url`](modules#$app-stores) in [pages](routing#page), `from` and `to` in [`beforeNavigate` and `afterNavigate`](modules#$app-navigation) and so on.

### URLSearchParams

Wherever you encounter a URL, you can access query parameters via `url.searchParams`, which is an instance of [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams):

```js
// @filename: ambient.d.ts
declare global {
	const url: URL;
}

export {};

// @filename: index.js
// ---cut---
const foo = url.searchParams.get('foo');
```

## Web Crypto

The [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) is made available via the `crypto` global. It's used internally for [Content Security Policy](configuration#csp) headers, but you can also use it for things like generating UUIDs:

```js
const uuid = crypto.randomUUID();
```
