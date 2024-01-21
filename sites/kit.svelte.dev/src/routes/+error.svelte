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
		<h1>Não encontrada!</h1>
	{:else if online}
		<h1>Yikes!</h1>

		{#if $page.error.message}
			<p class="error">{$page.status}: {$page.error.message}</p>
		{/if}

		<p>Tente recarregar a página.</p>

		<p>
			Se o erro persistir, visite a <a href="https://svelte.dev/chat">sala de conversas da Discord</a> e informe-nos, ou levante um problema na <a href="https://github.com/sveltejs/svelte">GitHub</a>. Obrigado!
		</p>
	{:else}
		<h1>Parece que estás desconectado da Internet.</h1>

		<p>Recarregue a página quando estiveres conectado a Internet.</p>
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
		margin: 0;
		font-size: 2.8em;
		font-weight: 300;
		margin-bottom: 0.5em;
	}

	p {
		margin: 1em auto;
	}

	.error {
		color: white;
		padding: 12px 16px;
		border-radius: 2px;
		background-color: #da106e;
		font: 600 16px/1.7 var(--sk-font);
	}
</style>
