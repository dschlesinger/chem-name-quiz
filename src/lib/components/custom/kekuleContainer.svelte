<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  import { container } from '$lib/components/custom/container.svelte';
  import Button from '../ui/button/button.svelte';
  import { success, warning, failure } from '$lib/components/custom/toasts.svelte';
  import { fail } from '@sveltejs/kit';

  let composer;
  let loadedContainer = $state(false);

  let { chemicalName } = $props();

  // Init getSMILES
  let getSMILES;

  onMount(async () => {

    const { Kekule } = await import('kekule');
    await import('kekule/theme/default');
    
    console.log('Kekule version:', Kekule.VERSION);

    // Create a new composer widget
    composer = new Kekule.Editor.Composer(document);
    
    // Set the composer's dimensions
    composer.setDimension('100%', '100%');
    
    // Append the composer to the container element
    composer.appendToElem(container.current);

    loadedContainer = true;

    // Define get SMILES function
    getSMILES = async () => {

      // Should only be one molecule, return null if more or less
      const molecules = composer.exportObjs(Kekule.Molecule);

      if (molecules.length !== 1) {

        failure(`Found ${molecules.length} molecules, only works with 1`);
        return
      }

      const SMILES = Kekule.IO.saveFormatData(molecules[0], 'smi');

      const response = await fetch(
        '/api/nameChemicals',
        {
          method: 'POST',
          body: JSON.stringify({'SMILES': SMILES})
        },
      );

      const name = await response.json();

      return name
    }

    return () => {
      // Clean up the composer when the component is destroyed
      composer.finalize();
    };
  });
</script>

{#if !loadedContainer}

Loading Kekule ...

{/if}

<div style={`display: ${loadedContainer ? 'visible' : 'none'}; width: 600px; height: 400px; border: 1px solid #ccc;`} bind:this={container.current}></div>

{#if loadedContainer}

<Button onclick={async () => {const resp = await getSMILES?.(); chemicalName.current = resp.name; console.log(chemicalName.current)}}>Get Name</Button>

{/if}