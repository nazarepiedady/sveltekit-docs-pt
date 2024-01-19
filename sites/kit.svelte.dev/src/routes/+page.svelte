<script>
	import { onMount } from 'svelte';
	import Deployment from './home/Deployment.svelte';
	import Features from './home/Features.svelte';
	import Hero from './home/Hero.svelte';
	import Intro from './home/Intro.svelte';
	import Showcase from './home/Showcase.svelte';
	import Svelte from './home/Svelte.svelte';
	import schema_url from './schema.json?url';
	import { Try } from './_components/Try.svelte';

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
	<title>SvelteKit • desenvolvimento da Web, aperfeiçoado</title>

	<meta name="twitter:title" content="SvelteKit" />
	<meta name="twitter:description" content="desenvolvimento da Web, aperfeiçoado" />
	<meta name="description" content="SvelteKit é a abstração de aplicação oficial da Svelte" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="SvelteKit • desenvolvimento da Web, aperfeiçoado" />
	<meta
		property="og:description"
		content="SvelteKit é a abstração de aplicação oficial da Svelte"
	/>
	<meta property="og:url" content="https://sveltekit-docs-pt.vercel.app/" />
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

	<section>
		<footer>
			<div class="logo" />
			<div class="links">
				<h4>recursos</h4>
				<a href="/docs">documentação</a>
				<a href="https://learn-svelte-pt.vercel.app/tutorial/introducing-sveltekit">tutorial</a>
				<a href="https://svelte-docs-pt.vercel.app/blog">blogue</a>
			</div>
			<div class="links">
				<h4>conectar</h4>
				<a href="https://github.com/sveltejs/svelte">github</a>
				<a href="https://opencollective.com/svelte">open collective</a>
				<a href="https://svelte.dev/chat">discord</a>
				<a href="https://twitter.com/sveltejs">twitter</a>
			</div>
			<div class="copyright">
				Direitos de Autor © 2023 <a href="https://github.com/sveltejs/svelte/graphs/contributors">colaboradores da Svelte</a>
			</div>
			<div class="open-source">
				SvelteKit é um projeto <a href="https://github.com/sveltejs/kit">gratuito e de código-aberto</a> lançado sob a licença MIT
			</div>
		</footer>
	</section>
</div>

<style>
	section {
		background: var(--sk-back-4);
		padding: 10rem 0;
	}

	footer {
		max-width: 120rem;
		padding: 0 var(--sk-page-padding-side);
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 1fr;
		grid-row-gap: 6rem;
	}

	footer .logo {
		display: none;
		background: url('@sveltejs/site-kit/branding/svelte-logo.svg');
		background-repeat: no-repeat;
		background-size: 8rem;
		filter: grayscale(100%) opacity(84%);
	}

	footer h4 {
		font-size: var(--sk-text-m);
		padding-bottom: 1rem;
	}

	.links a {
		color: var(--sk-text-2);
		font-size: var(--sk-text-s);
		display: block;
		line-height: 1.8;
	}

	.open-source {
		display: none;
		grid-column: span 2;
	}

	.copyright {
		grid-column: span 2;
	}

	@media (min-width: 500px) {
		footer {
			grid-template-columns: repeat(3, 1fr);
		}

		footer .logo {
			display: block;
		}

		.copyright {
			grid-column: span 1;
		}

		.open-source {
			display: block;
		}
	}
</style>
