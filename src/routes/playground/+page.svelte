<script>
  import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { warning } from '$lib/components/custom/toasts.svelte';
  import { Circle } from 'svelte-loading-spinners';
    import { get } from 'svelte/store';

  let chemicalName = $state({current: ''});
  let getUIPAC = $state({current: null})
  let getSMILES = $state({current: null})

   let isLoading = $state(false);

  let onclickGetName = $derived(getUIPAC.current ? (async () => {isLoading = true; await getUIPAC.current?.(await getSMILES?.current()); isLoading = false;}) : (async () => {warning('Naming function is not loaded')}));

</script>

<div class='flex flex-col gap-y-4 items-center'>
  <div class='flex justify-center w-full h-full [&>#kekule-container]:w-full [&>#kekule-container]:h-full [&>#kekule-container]:max-w-[100vw] [&>#kekule-container]:max-h-[100vh]'>
    <KekuleViewer 
      width="600px"
      height="400px"
      bind:chemicalName 
      bind:getSMILES 
      bind:getUIPAC 
    />
  </div>

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