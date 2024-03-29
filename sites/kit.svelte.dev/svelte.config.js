import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: 'edge'
		}),
		paths: {
			relative: true
		},
		prerender: {
			handleMissingId: 'ignore'
		}
	}
};

export default config;
