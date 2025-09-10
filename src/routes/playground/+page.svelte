<script>
  import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { warning } from '$lib/components/custom/toasts.svelte';
  import { Circle } from 'svelte-loading-spinners'

  let chemicalName = $state({current: ''});
  let getSMILES = $state({current: null})

   let isLoading = $state(false);

  let onclickGetName = $derived(getSMILES.current ? (async () => {isLoading = true; await getSMILES.current?.(); isLoading = false;}) : (async () => {warning('Naming function is not loaded')}));

</script>

<div class='flex flex-col gap-y-4 items-center'>
  <KekuleViewer bind:chemicalName bind:getSMILES />

  <div class='flex gap-x-5'>
    <Button onclick={onclickGetName} disabled={isLoading}>
      {#if isLoading}
        <Circle size="1" color="#EEE" unit="rem" />
      {:else}
        Get Name
      {/if}
    </Button>
    <div class='text-center px-4 bg-slate-800 rounded-lg text-white'>Name: { chemicalName.current }</div>
  </div>

</div>