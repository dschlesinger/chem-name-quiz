<script>
  import { onMount } from 'svelte';

  let container;// = $state(undefined);
  let composer;// = $state(undefined);
  let loadedContainer = $state(false);

  onMount(async () => {

    const { Kekule } = await import('kekule');
    await import('kekule/theme/default');
    
    console.log('Kekule version:', Kekule.VERSION);

    // Create a new composer widget
    composer = new Kekule.Editor.Composer(document);
    
    // Set the composer's dimensions
    composer.setDimension('100%', '100%');
    
    // Append the composer to the container element
    composer.appendToElem(container);

    loadedContainer = true;

    return () => {
      // Clean up the composer when the component is destroyed
      composer.finalize();
    };
  });
</script>

<div style={`visibility: ${loadedContainer ? 'visible' : 'hidden'};`} bind:this={container}></div>

{#if !loadedContainer}

Loading Kekule ...

{/if}