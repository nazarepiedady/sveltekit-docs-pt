---
title: Padrões da Web
---

Ao longo desta documentação, verás referências as [APIs da Web](https://developer.mozilla.org/en-US/docs/Web/API) padrão sobre as quais a SvelteKit constrói. No lugar de reinventar a roda, _usamos a plataforma_, o que significa que as tuas habilidades de desenvolvimento da web existente são aplicáveis a SvelteKit. Inversamente, noutro lado o tempo gasto aprendendo a SvelteKit ajudar-te-á a ser um programador da web melhor.

Estas APIs estão disponíveis em todos os navegadores modernos e em muitos ambientes sem navegador como Operários da Cloudflare, Deno e Funções de Borda da Vercel. Durante o desenvolvimento, e nos [adaptadores](adapters) para ambientes baseados na Node (incluindo AWS Lambda), são disponibilizadas através de supridores de recursos onde necessário (por agora, isto é — a Node está rapidamente a adicionar suporte para mais padrões da web).

Em particular, estarás confortável com os seguintes:

## Fetch APIs

A SvelteKit usa a [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) para receber dados a partir da rede. Está disponível nos [gatilhos](hooks) e bem como nas [rotas do servidor](routing#server) no navegador.

> Uma versão especial de `fetch` está disponível nas funções de [`load`](load), [gatilhos do servidor](hooks#server-hooks) e [rotas da API](routing#server) para invocar destinos diretamente durante a interpretação no lado do servidor, sem fazer uma chamada de HTTP, enquanto preserva as credenciais. (Para fazer requisições credenciadas no código do lado do servidor fora de `load`, deves passar explicitamente cabeçalhos de `cookie` e ou `authorization`). Isto também permite-te fazer requisições relativas, enquanto que a `fetch` do lado do servidor normalmente exige uma URL qualificada completamente.

Além da própria `fetch`, a [API de Requisição](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) inclui as seguintes interfaces:

### Request

Uma instância de [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) é acessível nos [gatilhos](hooks) e [rotas do servidor](routing#server) como `event.request`. Contém métodos úteis como `request.json()` e `request.formData()` para obter os dados que foram publicados para um destino.

### Response

Uma instância de [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) é retornada a partir de `await fetch(...)` e manipuladores nos ficheiros `+server.js`. Fundamentalmente, uma aplicação de SvelteKit é uma máquina para tornar uma `Request` numa `Response`.

### Headers

A interface de [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) permite-nos ler `request.headers` de entrada e definir `response.headers` de saída:

```js
// @errors: 2461
/// file: src/routes/what-is-my-user-agent/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
	// registar todos os cabeçalhos
	console.log(...event.request.headers);

	return json({
		// recuperar um cabeçalho específico
		userAgent: event.request.headers.get('user-agent')
	});
}
```

## FormData

Quando lidarmos com submissões de formulário nativas de HTML trabalharemos com os objetos de [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```js
// @errors: 2461
/// file: src/routes/hello/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const body = await event.request.formData();

	// registar todos os campos
	console.log([...body]);

	return json({
		// receber o valor dum campo específico
		name: body.get('name') ?? 'world'
	});
}
```

## Stream APIs

Na maior parte do tempo, os nossos destinos retornarão dados completos, como no exemplo de `userAgent` acima. Algumas vezes, podemos precisar de retornar uma resposta que é grande demais para caber na memória em uma ida, ou é entregado em pedaços, e para isto a plataforma fornece os [fluxos](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) — [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) e [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream).

## URL APIs

As URLs são representadas pela interface de [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL), que inclui propriedades úteis como `origin` e `pathname` (e, no navegador, `hash`). Esta interface aparece em vários lugares — `event.url` nos [gatilhos](hooks) e [rotas do servidor](routing#server), [`$page.url`](modules#$app-stores) nas [páginas](routing#page), `from` e `to` no [`beforeNavigate` e `afterNavigate`](modules#$app-navigation) e assim por diante.

### URLSearchParams

Onde quer que encontrarmos uma URL, podemos acessar os parâmetros de consulta através de `url.searchParams`, que é uma instância de [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams):

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

A [API de Criptografia da Web](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) está disponível através da global `crypto`. É usada internamente para os cabeçalhos de [Política de Segurança de Conteúdo](configuration#csp), mas também podemos usá-la para coisas como gerar UUIDs:

```js
const uuid = crypto.randomUUID();
```
