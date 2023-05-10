<script>
	import { page } from '$app/stores';

	// we don't want to use <svelte:window bind:online> here, because we only care about the online
	// state when the page first loads
	let online = typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="container">
	{#if $page.status === 404}
		<h1>Não encontrado!</h1>
	{:else if online}
		<h1>Yikes!</h1>

		{#if $page.error.message}
			<p class="error">{$page.status}: {$page.error.message}</p>
		{/if}

		<p>Tente recarregar a página</p>

		<p>
			Se o erro persistir, visite-nos na <a href="https://svelte.dev/chat">Discord</a> e deixe-nos saber, ou levante uma questão na <a href="https://github.com/sveltejs/svelte">GitHub</a>. Obrigado!
		</p>
	{:else}
		<h1>Parece que estás offline</h1>

		<p>Recarregue a página assim que estiveres ligado a internet.</p>
	{/if}
</div>

<style>
	.container {
		padding: var(--sk-page-padding-top) var(--sk-page-padding-side) 6rem var(--sk-page-padding-side);
	}

	h1,
	p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 300;
		margin: 0;
		margin-bottom: 0.5em;
	}

	p {
		margin: 1em auto;
	}

	.error {
		background-color: #da106e;
		color: white;
		padding: 12px 16px;
		font: 600 16px/1.7 var(--sk-font);
		border-radius: 2px;
	}
</style>
