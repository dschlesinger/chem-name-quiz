<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';

    let chemicalName = $state({current: ''});
    let getSMILES = $state({current: null})
    let setSMILES = $state({current: null})

    async function generateMolecule() {
        
        const response = await fetch(
        '/api/generateMolecule',
        {
          method: 'POST',
          body: JSON.stringify({})
        },
      );

      const { SMILES } = await response.json();

      console.log(SMILES)

      setSMILES.current?.(SMILES)

    }

</script>

<KekuleViewer bind:chemicalName bind:getSMILES bind:setSMILES />

<Button onclick={generateMolecule}>Test Generate Molecule</Button>