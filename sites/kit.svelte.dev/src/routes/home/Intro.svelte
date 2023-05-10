<script>
	import { Section } from '@sveltejs/site-kit/components';
</script>

<Section --background="var(--sk-back-1)">
	<div class="grid" style="--columns: 3">
		<div>
			<h2>rápida</h2>
			<p>
				Alimentada pela <a target="_blank" rel="noreferrer" href="https://svelte.dev">Svelte</a> e
				<a target="_blank" rel="noreferrer" href="https://pt.vitejs.dev">Vite</a>, a velocidade é assada em cada abertura: configuração rápida, desenvolvimento rápido, construções rápidas, carregamentos de página rápidos,navegação rápida. Mencionamos que é rápida?
			</p>
		</div>

		<div>
			<h2>divertida</h2>
			<p>
				Dias não mais desperdiçados compreendendo a configuração do empacotador, roteamento, SSR, CSR, TypeScript, definições de implementação e todas as outras coisas aborrecidas. Codifique com prazer.
			</p>
		</div>

		<div>
			<h2>flexível</h2>
			<p>
				SPA? MPA? SSR? SSG? verificado. A SvelteKit dá-te as ferramentas para serem bem-sucedido em seja o que estiveres a construir. E execute-a em onde quer que a JavaScript execute.
			</p>
		</div>
	</div>
</Section>

<style>
	p {
		font-size: var(--sk-text-m);
	}
</style>
