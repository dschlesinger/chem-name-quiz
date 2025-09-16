<script lang='ts'>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  import { container } from '$lib/components/custom/container.svelte';
  import { success, warning, failure } from '$lib/components/custom/toasts.svelte';

  let currentSMILES = $state({current: undefined});

  // Loading RDKit
  let RDKit = null;
  let isLoadingRDKit = false;

  // Works by appending the RDKit CDN
  async function loadRDKit() {
        if (browser && !RDKit) {
            isLoadingRDKit = true;
            try {
                // This should work in the browser
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@rdkit/rdkit/Code/MinimalLib/dist/RDKit_minimal.js';
                document.head.appendChild(script);
                
                // Wait for script to load
                await new Promise((resolve) => {
                    script.onload = resolve;
                });
                
                RDKit = await window.initRDKitModule();
            } catch (error) {
                console.error('Failed to load RDKit:', error);
            }
            isLoadingRDKit = false;
        }
    }
    

  let composer;
  let loadedContainer = $state(false);

  let { 
    veiwProvider = 'kekule', // 'kekule' | 'rdkit'
    width = '600px',
    height = '400px',
    chemicalName = $bindable(), 
    getSMILES = $bindable({current: undefined}), 
    clearSMILES = $bindable({current: undefined}), 
    setSMILES = $bindable({current: undefined}) 
  } = $props();


  onMount(async () => {

    const { Kekule } = await import('kekule');

    console.log('Kekule version:', Kekule.VERSION);

    // Create a new composer widget
    composer = new Kekule.Editor.Composer(document);
    
    // Set the composer's dimensions
    composer.setDimension('100%', '100%');
    
    // Append the composer to the container element
    composer.appendToElem(container.current);

    loadedContainer = true;

    clearSMILES.current = async () => {

      composer.newDoc()

    } 

    setSMILES.current = async (SMILES) => {

      // Load RDKit
      if (!RDKit) await loadRDKit();

      const mol = RDKit.get_mol(SMILES);

      currentSMILES.current = SMILES;

      if (veiwProvider == 'rkdit') {

        document.getElementById('rdkit-svg-provider').innerHTML = "<div id='drawing'>" + mol.get_svg() + "</div>";

      }
      else {
        // default to kekule

          const molecule = Kekule.IO.loadFormatData(mol.get_molblock(), 'mol');

          composer.setChemObj(molecule);
      }
    }

    // Define get SMILES function
    getSMILES.current = async (givenSMILES = undefined) => {

      let SMILES;

      if (givenSMILES) {
        // SMILES is passed in just return name for checking if it is nameable
        SMILES = givenSMILES;
      }
      else if (veiwProvider == 'rdkit') {
        SMILES = currentSMILES.current 
      }
      else {

        // Should only be one molecule, return null if more or less
        const molecules = composer.exportObjs(Kekule.Molecule);

        if (molecules.length !== 1) {

          failure(`Found ${molecules.length} molecules, only works with 1`);
          return
        }

        SMILES = Kekule.IO.saveFormatData(molecules[0], 'smi');

        if (SMILES.length == 0) {

          failure(`SMILES is empty :(`);
          return
        }
      }

      const response = await fetch(
        '/api/nameChemicals',
        {
          method: 'POST',
          body: JSON.stringify({'SMILES': SMILES})
        },
      );

      const { name } = await response.json();

      const trueName = name ?? 'Not nameable :(';
        
      // Both return and change $state
      chemicalName.current = trueName;

      return trueName;

    }

    if (veiwProvider == 'kekule'){
      composer.setCommonToolButtons(['newDoc', 'loadData', 'saveData']);

      // Set displayed buttons in chem toolbar
      composer.setChemToolButtons(['manipulate', 'erase', 'bond', 'atomAndFormula', 'ring']);

      // Set available object modifiers categories
      composer.setAllowedObjModifierCategories([
        Kekule.Editor.ObjModifier.Category.GENERAL, Kekule.Editor.ObjModifier.Category.CHEM_STRUCTURE
        /* Kekule.Editor.ObjModifier.Category.STYLE, Kekule.Editor.ObjModifier.Category.GLYPH */
      ]);
    }

    return () => {
      // Clean up the composer when the component is destroyed
      if(veiwProvider == 'kekule'){composer.finalize()};
    };
  });
</script>

{#if !loadedContainer}

Loading {veiwProvider == 'kekule' ? 'Kekule' : 'RDKit'} ...

{/if}
{#if veiwProvider == 'kekule'}
<div 
  style={`display: ${loadedContainer ? 'visible' : 'none'}; width: ${width}; height: ${height};`} 
  bind:this={container.current}
>
</div>
{:else}
<!-- rdkit -->
 <div id="rdkit-svg-provider"></div>
{/if}