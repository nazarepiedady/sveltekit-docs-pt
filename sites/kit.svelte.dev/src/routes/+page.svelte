<script>
	import { Footer, TrySection } from '@sveltejs/site-kit/home';
	import { onMount } from 'svelte';
	import Deployment from './home/Deployment.svelte';
	import Features from './home/Features.svelte';
	import Hero from './home/Hero.svelte';
	import Intro from './home/Intro.svelte';
	import Showcase from './home/Showcase.svelte';
	import Svelte from './home/Svelte.svelte';
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
	<TrySection />
	<Svelte />
	<Features />
	<Deployment />
	<Showcase />

	<Footer
		links={{
			resources: [
				{
					title: 'documentação',
					href: '/docs'
				},
				{
					title: 'tutorial',
					href: 'https://learn-svelte-pt.vercel.app/tutorial/introducing-sveltekit'
				},
				{
					title: 'blogue',
					href: 'https://svelte-docs-pt.vercel.app/blog'
				}
			],
			connect: [
				{
					title: 'github',
					href: 'https://github.com/sveltejs/kit'
				},
				{
					title: 'opencollective',
					href: 'https://opencollective.com/svelte'
				},
				{
					title: 'discord',
					href: 'https://svelte.dev/chat'
				},
				{
					title: 'twitter',
					href: 'https://twitter.com/sveltejs'
				}
			]
		}}
	>
		<span slot="license">
			SvelteKit is <a target="_blank" rel="noreferrer" href="https://github.com/sveltejs/kit"
				>free and open source software</a
			> released under the MIT license.
		</span></Footer
	>
</div>
