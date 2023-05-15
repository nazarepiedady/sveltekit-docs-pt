---
title: Introdução
---

## Antes de Começarmos

> Se fores novo para Svelte ou SvelteKit recomendamos consultar o [passo-a-passo interativo](https://learn.svelte.dev).
>
> Se ficares sem saber o que fazer, chame por ajuda na [sala de conversa da Discord](https://svelte.dev/chat).

## O Que é SvelteKit?

SvelteKit é uma abstração para programar rapidamente aplicações de web otimizadas e robustas usando a [Svelte](https://svelte.dev/). Se estiveres a vir da React, SvelteKit é parecida com a Next. Se estiveres a vira da Vue, SvelteKit é parecida com a Nuxt.

## O Que é Svelte?

Em resumo, Svelte é uma maneira de escrever componentes de interface de utilizador — como uma barra de navegação, seção de comentário, ou formulário de contato — que os utilizadores vê e interagem com os seus navegadores. O compilador da Svelte converte os teus componentes para JavaScript que pode ser executada para gerar o HTML para a página e o CSS que estiliza a página. Tu não precisas de saber Svelte para entender o resto deste guia, mas ajudará. Se gostarias de aprender mais, consulte o [passo-a-passo da Svelte](https://svelte.dev/tutorial).

## O Que a SvelteKit fornece sobre a Svelte?

A Svelte gera os componentes de interface. Tu podes compor estes componentes e gerar uma página inteira só com a Svelte, mas precisas de mais do que a Svelte para escrever uma aplicação inteira.

A SvelteKit fornece funcionalidade básica como um [roteador](glossary#routing) — que atualiza a interface de utilizador quando uma ligação é clicada — e [interpretação no lado do servidor (SSR)](glossary#ssr). Mas além disto, construir uma aplicação com todas as boas práticas modernas é diabolicamente complicado. Estas práticas incluem [otimizações de construção](https://pt.vitejs.dev/guide/features.html#build-optimizations), para que carregues apenas mínimo código exigido; [suporte a offline](service-workers); [pré-carregar](link-options#data-sveltekit-preload-data) as páginas antes do utilizador iniciar a navegação; [interpretação configurável](page-options) que permite-te gerar partes diferentes da tua aplicação no servidor com a [SSR](glossary#ssr), na [interpretação no lado do cliente](glossary#csr) do navegador, ou em tempo de construção com [pré-interpretação](glossary#prerendering); e muitas outras coisas. A SvelteKit faz todas coisas aborrecidas por ti para que possas avançar com a parte criativa.

Ela reflete as mudanças do teu código no navegador instantaneamente para fornecer uma experiência de programação rica em funcionalidade e rápida como relâmpago influenciando a [Vite](https://pt.vitejs.dev/) com uma [extensão de Svelte](https://github.com/sveltejs/vite-plugin-svelte) para fazer a [Substituição de Módulo Instantânea (HMR)](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md#hot).
