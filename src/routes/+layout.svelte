<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import Button from '$lib/components/ui/button/button.svelte';
	
	let { children } = $props();

	const options = {};

	const pages = [
		{name: 'Home', link: '/'},
		{name: 'Draw To Name', link: '/draw'},
		{name: 'Test Naming', link: '/test-name'},
		{name: 'Test Drawing', link: '/test-draw'},
	]

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SvelteToast {options} />

<nav class='bg-slate-800'>

	<div class='flex justify-center gap-x-8'>
		{#each pages as page}

			<div class='p-4'>

				<Button class='bg-blue-800' href={page.link}>{page.name}</Button>

			</div>

		{/each}
	</div>

</nav>

{@render children?.()}
