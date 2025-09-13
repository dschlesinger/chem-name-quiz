<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';

    let chemicalName = $state({current: ''});
    let getSMILES = $state({current: null})
    let setSMILES = $state({current: null})

</script>

<KekuleViewer bind:chemicalName bind:getSMILES bind:setSMILES />