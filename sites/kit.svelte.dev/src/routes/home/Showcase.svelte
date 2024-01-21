<script>
	import { Section } from '@sveltejs/site-kit/components';
	import pudding from './showcase/pudding.png?enhanced';
	import pocketbase from './showcase/pocketbase.png?enhanced';
	import pronauns from './showcase/pronauns.png?enhanced';
	import pausly from './showcase/pausly.png?enhanced';
	import asmeditor from './showcase/asmeditor.png?enhanced';
	import monogram from './showcase/monogram.png?enhanced';
	import raster from './showcase/raster.png?enhanced';
	import tradingstrategy from './showcase/tradingstrategy.png?enhanced';

	const showcase = [
		{ url: 'pudding.cool', image: pudding },
		{ url: 'www.pronauns.com', image: pronauns },
		{ url: 'www.pausly.app', image: pausly },
		{ url: 'asm-editor.specy.app', image: asmeditor },
		{ url: 'raster.app', image: raster },
		{ url: 'pocketbase.io', image: pocketbase },
		{ url: 'monogram.io', image: monogram },
		{ url: 'tradingstrategy.ai', image: tradingstrategy }
	];
</script>

<Section --background="var(--background-2)">
	<h2>mostruário</h2>

	<div class="showcase">
		{#each showcase as { url, image }}
			<a href="https://{url}" target="_blank" rel="noreferrer">
				<enhanced:img src={image} alt="" style="width:100%;height:100%;object-fit:cover;" />
				<span>{url}</span>
			</a>
		{/each}
	</div>
</Section>

<style>
	h2 {
		color: white;
		text-align: center;
		margin-bottom: 1em;
		text-transform: uppercase;
		font-size: var(--sk-text-s);
	}

	.showcase {
		gap: 2rem;
		display: grid;
	}

	a {
		display: flex;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		color: var(--sk-text-1);
		border-radius: var(--sk-border-radius);
	}

	a :global(img) {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		margin: 0 0 0.5em 0;
		transition: transform 0.2s;
	}

	span {
		top: 0;
		left: 0;
		opacity: 0;
		width: 100%;
		height: 100%;
		color: white;
		display: flex;
		position: absolute;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s;
		backdrop-filter: blur(3px);
		font-size: var(--sk-text-s);
		filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.5));
	}

	a:hover span {
		opacity: 1;
	}

	a:hover :global(img) {
		transform: scale(1.05);
	}

	@media (min-width: 400px) {
		.showcase {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 800px) {
		.showcase {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
