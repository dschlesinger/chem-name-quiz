<script lang='ts'>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  import { container } from '$lib/components/custom/container.svelte';
  import { success, warning, failure } from '$lib/components/custom/toasts.svelte';
  import { Circle } from 'svelte-loading-spinners';

  let currentSMILES = $state({current: undefined});

  // Loading RDKit
  let RDKit = null;
  let isLoadingRDKit = false;
  let rdkitSVG = $state('');
  $inspect(rdkitSVG);

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
    setSMILES = $bindable({current: undefined}),
    isEqual = $bindable({current: undefined}),
  } = $props();


  onMount(async () => {

    if (veiwProvider == 'kekule') {
const { Kekule } = await import('kekule');

    console.log('Kekule version:', Kekule.VERSION);

    // Create a new composer widget
    composer = new Kekule.Editor.Composer(document);
    
    // Set the composer's dimensions
    composer.setDimension('100%', '100%');
    
    // Append the composer to the container element
    composer.appendToElem(container.current);
    }

    isEqual.current = async (SMILES: string) => {
      // Takes generated smiles from draw and compares it with kekule

      const molecules = composer.exportObjs(Kekule.Molecule);

        if (molecules.length !== 1) {

          failure(`Found ${molecules.length} molecules, only works with 1`);
          return
        }

      const DrawnMol = molecules[0];

      // Load RDKit

      if (!RDKit) await loadRDKit();

      const GivenMol = Kekule.IO.loadFormatData(RDKit.get_mol(SMILES).get_molblock(), 'mol');

      return DrawnMol.isSameStructureWith(GivenMol);
    }

    clearSMILES.current = async () => {

      // Only works for kekule
      composer.newDoc()

    } 

    setSMILES.current = async (SMILES) => {

      // Load RDKit
      if (!RDKit) await loadRDKit();

      const mol = RDKit.get_mol(SMILES);


      currentSMILES.current = SMILES;

      if (veiwProvider == 'rdkit') {

        rdkitSVG = mol.get_svg(width=width.replace('px', ''), height=height.replace('px', ''));

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

    loadedContainer = true;

    return () => {
      // Clean up the composer when the component is destroyed
      if(veiwProvider == 'kekule'){composer.finalize()};
    };
    
  });
</script>

<div class='flex rounded-md overflow-hidden items-center justify-center bg-slate-200' style={`width: ${width}; height: ${height};`} >

  {#if !loadedContainer}
  <div class='flex flex-col items-center gap-y-4'>
    <Circle color='white' />
    <div>
      Loading {veiwProvider == 'keule' ? 'Kekule' : 'RDKit'}...
    </div>
  </div>

  {/if}
  {#if veiwProvider == 'kekule'}
    <div 
      style={`display: ${loadedContainer ? 'visible' : 'none'}; width: ${width}; height: ${height};`} 
      bind:this={container.current}
    >
    </div>
  {:else}
  <!-- rdkit -->
  <div class='rounded-md overflow-hidden' id="rdkit-svg-provider" style={`display: ${loadedContainer ? 'visible' : 'none'}; width: ${width}; height: ${height};`}>
    {@html rdkitSVG }
  </div>
  {/if}
</div>