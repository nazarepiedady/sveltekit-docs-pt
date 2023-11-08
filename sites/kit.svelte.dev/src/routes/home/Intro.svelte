<script>
	import { Blurb } from '@sveltejs/site-kit/home';
</script>

<Blurb --background="var(--sk-back-1)">
	<div slot="one">
		<h2>rápida</h2>
		<p>
			Alimentada pela <a target="_blank" rel="noreferrer" href="https://svelte-docs-pt.vercel.app">Svelte</a> e <a target="_blank" rel="noreferrer" href="https://pt.vitejs.dev">Vite</a>, a velocidade está presente em todos os pormenores: configuração rápida, desenvolvimento rápido, construções rápidas, carregamento rápido de páginas, e navegação rápida. Já mencionámos que é rápida?
		</p>
	</div>

	<div slot="two">
		<h2>divertida</h2>
		<p>
			Acabaram-se os dias perdidos a tentar entender a configuração do empacotador, roteamento, interpretação do lado do servidor, política de segurança de conteúdo, TypeScript, definições de implementação da produção e todas as outras coisas aborrecidas. Codifique com alergia.
		</p>
	</div>

	<div slot="three">
		<h2>flexível</h2>
		<p>
			SPA? MPA? SSR? SSG? Confirmado. A SvelteKit dá-nos as ferramentas para sermos bem-sucedidos em tudo aquilo que estivermos a construir. E executa onde quer que a JavaScript executa.
		</p>
	</div>
</Blurb>

<style>
	p {
		font-size: var(--sk-text-m);
	}
</style>
