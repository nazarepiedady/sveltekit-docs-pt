<script>
	import Video from './Video.svelte';
	import { Section } from '@sveltejs/site-kit/components';
</script>

<Section --background="var(--background-1)">
	<p class="definition">
		<em>/ˈsvɛlt/</em> <span class="adjective">adjetivo</span>
		<span class="description">atraente e fina, graciosa e elegante</span>
	</p>

	<div class="grid" style="--columns: 3">
		<div class="video-container">
			<Video />

			<p>
				<a
					target="_blank"
					rel="noreferrer"
					href="https://www.offerzen.com/community/svelte-origins-documentary"
				>
					Assistir o documentário completo das Origens da Svelte
				</a>
			</p>
		</div>

		<div>
			<p>
				A SvelteKit foi construída sobre a Svelte, uma abstração de interface que usa um compilador para permitir-nos escrever componentes extremamente concisos que fazem um trabalho mínimo no navegador, usando as linguagens que já conhecemos — HTML, CSS e JavaScript. <strong>É uma carta de amor ao desenvolvimento da Web</strong>.
			</p>

			<p>
				Porém não acredite na nossa palavra. Os programadores constantemente classificam a Svelte como a abstração que estão
				<a
					target="_blank"
					rel="noreferrer"
					href="https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks"
				>
					mais
				</a>
				<a
					target="_blank"
					rel="noreferrer"
					href="https://tsh.io/state-of-frontend/#which-of-the-following-frameworks-would-you-like-to-learn-in-the-future"
				>
					excitados
				</a>
				<a
					target="_blank"
					rel="noreferrer"
					href="https://2021.stateofjs.com/en-US/libraries/front-end-frameworks/"
				>
					em
				</a>

				<a
					target="_blank"
					rel="noreferrer"
					href="https://twitter.com/Rich_Harris/status/1589675637195042817"
				>
					usar</a
				>.
			</p>
		</div>
	</div>
</Section>

<style>
	p {
		font-size: var(--sk-text-s);
	}

	.definition {
		font-size: var(--sk-text-l);
	}

	.definition em {
		font-style: normal;
		font-size: var(--sk-text-xxl);
		color: var(--sk-theme-1);
	}

	.definition .adjective {
		position: relative;
		top: -0.15em;
		padding: 0.25em 0.5em 0.1em;
		line-height: 1;
		margin: 0 1em;
		text-transform: uppercase;
		font-size: var(--sk-text-s);
		background: var(--sk-text-2);
		border-radius: var(--sk-border-radius);
		color: var(--sk-back-2);
	}

	.definition .description {
		display: block;
	}

	@media (min-width: 900px) {
		.definition .description {
			display: inline;
		}

		.video-container {
			order: 2;
			grid-column: 2 / 4;
		}
	}
</style>
