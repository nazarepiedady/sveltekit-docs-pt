<script>
	import { Section } from '@sveltejs/site-kit/components';
</script>

<Section --background="var(--sk-back-1)">
	<div class="container">
		<div class="features">
			<h2><span>funcionalidades? temos todas.</span></h2>
			<p class="wall">
				Misture e combine as páginas <strong>pré-interpretadas</strong> para o máximo desempenho com a <strong>interpretação dinâmica no lado do servidor</strong> para máxima flexibilidade. Transforme a tua aplicação numa <strong>PWA</strong> gerada pelo cliente com uma única de código, para a coisa inteira ou apenas uma página. Use o <strong>roteamento acessível do lado do cliente</strong> com <strong>pré-carregamento</strong> automático para navegação instantânea habilidosa que não recarrega a tua página inteira (e as tuas analises, e todas as outras tralhas). Proteja os teus utilizadores com <strong>proteção de CSRF</strong> automática e configuração de <strong>Política de Segurança de Conteúdo</strong> fácil de usar. Mantenha os teus segredos contigo mesmo com a manipulação de <strong>variável de ambiente</strong> avançada. Manipule os erros graciosamente e <strong>com segurança</strong>. Carregue os dados <strong>diretamente da tua base de dados</strong> e conecte o teu backend ao teu frontend com carregamento de dados com <strong>segurança de tipo</strong> e <strong>ações de formulário</strong> embutidas que trabalham com ou sem JavaScript. <strong>Co-exista</strong> com outras abstrações de roteamento na mesma página. Adicione operários de serviço para suporte <strong>offline</strong>. Gere páginas <strong>compatíveis com a AMP</strong> se realmente tiveres. Construa interfaces de utilizador complexas com as excecionalmente poderosas <strong>rotas baseadas no sistema de ficheiro</strong>. Disposições encaixadas? Duh. Aprenda <strong>padrões de web</strong> que funcionam através dos ambientes. Integra com <strong>Tailwind</strong>
				e <strong>Playwright</strong> e <strong>Vitest</strong> e <strong>Storybook</strong> e, bem, o que quiseres. Construa <strong>bibliotecas</strong> bem como aplicações. <strong>Implemente em qualquer parte</strong> com os adaptadores.
			</p>

			<p>
				SvelteKit é uma abstração que
				<strong>cresce contigo</strong>, seja o que for que termines por construir.
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
