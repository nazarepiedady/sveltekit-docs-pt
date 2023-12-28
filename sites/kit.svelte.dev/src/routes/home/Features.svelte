<script>
	import { Section } from '@sveltejs/site-kit/components';
</script>

<Section --background="var(--sk-back-1)">
	<div class="container">
		<div class="features">
			<h2><span>funcionalidades? temos.</span></h2>
			<p class="wall">
				Mistura e combina páginas <strong>pré-interpretadas</strong> para obter o máximo desempenho com a <strong>interpretação dinâmica do lado do servidor</strong> para obter a máxima flexibilidade. Transforme a tua aplicação numa <strong>PWA</strong> desenhada do lado do cliente com uma única linha de código, para tudo ou apenas uma página. Usa o <strong>roteamento acessível do lado do cliente</strong> com a <strong>pré-carregamento</strong> automático para uma navegação elegante e instantânea que não recarrega a página inteira (nem a tuas analises, nem todo o lixo restante). Proteja os teus utilizadores com a <strong>proteção automática de CSRF</strong> e com configuração <strong>Política de Segurança de Conteúdo</strong> fácil de usar. Guarde os teus segredos para ti mesmo com a manipulação avançada de <strong>variável de ambiente</strong>. Manipula os erros graciosamente e com segurança. Carregue dados <strong>diretamente a partir da tua base de dados</strong> e conecte o teu back-end ao teu front-end com o carregamento de dados  <strong>seguros no que diz respeito a tipos</strong> e <strong>ações de formulário</strong> embutidas que funcionam com ou sem JavaScript. <strong>Coexiste</strong> com outras abstrações de roteamento do lado do cliente na mesma página. Adiciona operários de serviço para suporte <strong>desconectado</strong>. Gera páginas compatíveis com <strong>AMP</strong> se for realmente necessário. Construa interfaces complexas com <strong>rotas baseadas no sistema de ficheiro</strong> excecionalmente poderosas. Disposições encaixadas? É verdade. Aprenda <strong>padrões da Web</strong> que funcionam em vários ambiente. Integram com <strong>Tailwind</strong> e <strong>Playwright</strong> e <strong>Vitest</strong> e <strong>Storybook</strong> e, bem, qualquer coisa que quiseres. Construa <strong>bibliotecas</strong> bem como as aplicações. <strong>Implemente em qualquer lugar</strong> com os adaptadores.
			</p>

			<p>
				A SvelteKit é a abstração que <strong>cresce contigo</strong>, qualquer coisa que acabes por construir.
			</p>
		</div>
	</div>
</Section>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}

	.features {
		order: 1;
		text-align: justify;
	}

	h2 {
		float: right;
		width: 5.5em;
	}

	h2 span {
		display: block;
		text-align: right;
		width: 5em;
		margin: 0 0 0 auto;
	}

	.wall {
		margin: 0;
		font-size: var(--sk-text-xs);
	}

	p + p {
		margin-top: 1em;
	}

	p,
	strong {
		color: var(--sk-text-3);
	}

	@media (min-width: 600px) {
		h2 {
			margin-top: 0.5em;
			width: 10em;
		}

		h2 span {
			width: auto;
		}

		/* TODO remove the 62.5% hack so we can use rems in media queries */
		.container {
			--size: 40rem;
			display: block;
		}

		.features {
			padding: 2rem 0 2rem calc(0 * var(--size));
		}
	}

	@media (min-width: 900px) {
		.container {
			--size: 45rem;
		}

		h2 {
			margin-top: 0.1em;
		}

		p {
			font-size: var(--sk-text-s);
		}

		.features {
			padding-top: clamp(0px, calc(23.333vw - 210px), 70px);
		}
	}
</style>
