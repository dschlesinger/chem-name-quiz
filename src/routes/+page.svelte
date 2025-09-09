<script>
  import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';
    import Button from '$lib/components/ui/button/button.svelte';

  let chemicalName = $state({current: ''});

  $effect(() => {console.log(chemicalName.current)})

</script>

<KekuleViewer { chemicalName } />

<div class='w-80 h-10 bg-red-500'>{ chemicalName.current }</div>

<Button onclick={() => {console.log(chemicalName.current)}}> Page Check </Button>