<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	
	let { children } = $props();

	const options = {};

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SvelteToast {options} />

{@render children?.()}
