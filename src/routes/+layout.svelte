<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import Button from '$lib/components/ui/button/button.svelte';
	
	let { children } = $props();
	let mobileMenuOpen = $state(false);

	const options = {};

	const pages = [
		{name: 'Home', link: '/'},
		{name: 'Playground', link: '/playground'},
		{name: 'Test Naming', link: '/test/name'},
		{name: 'Test Drawing', link: '/test/draw'},
	]

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SvelteToast {options} />

<div class="w-screen h-screen flex flex-col overflow-x-hidden overflow-y-auto">
  <nav class="bg-slate-800 relative">
    <!-- Desktop Navigation -->
    <div class="hidden md:flex justify-center gap-x-8">
      {#each pages as page}
        <div class="p-4">
          <Button class="bg-blue-800" href={page.link}>{page.name}</Button>
        </div>
      {/each}
    </div>

	<!-- Claude generated nav hamburger animation -->
    <!-- Mobile Navigation -->
    <div class="md:hidden">
      <!-- Mobile Header with Hamburger -->
      <div class="flex items-center justify-between p-4">
        <span class="text-white font-semibold">Menu</span>
        <button 
          onclick={toggleMobileMenu}
          class="text-white p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded relative w-8 h-8"
          aria-label="Toggle menu"
        >
          <!-- Hamburger to X Animation -->
          <div class="absolute inset-0 flex flex-col justify-center items-center">
            <!-- Top line -->
            <div class="w-6 h-0.5 bg-white transition-all duration-300 ease-in-out transform" 
                 class:rotate-45={mobileMenuOpen} 
                 class:translate-y-1.5={mobileMenuOpen}></div>
            <!-- Middle line -->
            <div class="w-6 h-0.5 bg-white mt-1.5 transition-all duration-300 ease-in-out" 
                 class:opacity-0={mobileMenuOpen}></div>
            <!-- Bottom line -->
            <div class="w-6 h-0.5 bg-white mt-1.5 transition-all duration-300 ease-in-out transform" 
                 class:-rotate-45={mobileMenuOpen} 
                 class:-translate-y-1.5={mobileMenuOpen}></div>
          </div>
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      {#if mobileMenuOpen}
        <div class="absolute top-full left-0 right-0 bg-slate-800 border-t border-slate-700 z-50 shadow-lg">
          {#each pages as page}
            <div class="border-b border-slate-700 last:border-b-0">
              <Button 
                class="w-full bg-transparent hover:bg-slate-700 text-white justify-start rounded-none p-4" 
                href={page.link}
                onclick={closeMobileMenu}
              >
                {page.name}
              </Button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </nav>

  <div class="flex-1 flex flex-col min-h-0">
    {@render children?.()}
  </div>
</div>