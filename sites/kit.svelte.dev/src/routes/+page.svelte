<script>
	import { onMount } from 'svelte';
	import Features from './home/Features.svelte';
	import Hero from './home/Hero.svelte';
	import Showcase from './home/Showcase.svelte';
	import Try from './home/Try.svelte';
	import Deployment from './home/Deployment.svelte';
	import Svelte from './home/Svelte.svelte';
	import Intro from './home/Intro.svelte';
	import schema_url from './schema.json?url';
	import './home/common.css';

	let schema;
	onMount(async () => {
		// Google will not allow linking to a schema file. It must be in the DOM
		// We load it and add it to the DOM to save bytes on page load vs inlining
		const json = await (await fetch(schema_url)).text();
		schema = `<script type="application/ld+json">${json}<\/script>`;
	});
</script>

<svelte:head>
	<title>SvelteKit • Desenvolvimento da web, simplificado</title>

	<meta name="twitter:title" content="SvelteKit" />
	<meta name="twitter:description" content="Desenvolvimento da web, simplificado" />
	<meta name="description" content="SvelteKit é a abstração de aplicação de Svelte oficial." />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="SvelteKit • Desenvolvimento da web, simplificado" />
	<meta
		property="og:description"
		content="SvelteKit é a abstração de aplicação de Svelte oficial."
	/>
	<meta property="og:url" content="https://kit.svelte.dev/" />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg"
	/>

	{#if schema}
		{@html schema}
	{/if}
</svelte:head>

<div class="home">
	<h1 class="visually-hidden">SvelteKit</h1>

	<Hero />
	<Intro />
	<Try />
	<Svelte />
	<Features />
	<Deployment />
	<Showcase />

	<footer>
		<p>
			SvelteKit é <a target="_blank" rel="noreferrer" href="https://github.com/sveltejs/kit"
				>software livre e de código-aberto</a
			> lançado sob a licença MIT.
		</p>
	</footer>
</div>

<style>
	footer {
		padding: 1em var(--sk-page-padding-side);
		text-align: center;
		background: var(--sk-back-2);
	}

	footer p {
		max-width: 20em;
		margin: 0 auto;
	}

	footer p a {
		color: inherit;
		text-decoration: underline;
	}

	@media (min-width: 680px) {
		footer p {
			max-width: none;
		}
	}
</style>
