<script lang='ts'>

import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from "$lib/components/ui/input/index.js";
  import { Circle } from 'svelte-loading-spinners';
  import { failure, success, warning } from '$lib/components/custom/toasts.svelte';

  import { generateMolecule } from '$lib/kekuleUtils';
  import { onMount } from 'svelte';
  import { type PreviousExample, previousExamples } from '$lib/components/custom/previousExampleCard/previousExampleObject.svelte';

  let chemicalName = $state({current: ''});
  let getSMILES = $state({current: null})
  let setSMILES = $state({current: null})
  let clearSMILES = $state({current: null})
  let guessedName = $state('');

  let isLoading = $state(true);

  let getName = $derived(getSMILES.current ? (async (givenSMILES = undefined) => {isLoading = true; const n = await getSMILES.current?.(givenSMILES); isLoading = false; return n;}) : (async () => {warning('Naming function is not loaded')}));

  async function setupExample() {

    isLoading = true;

    let SMILES = await generateMolecule();
    chemicalName.current = await getName(SMILES);

    while (chemicalName.current == 'Not nameable :(') {
      SMILES = await generateMolecule();
      chemicalName.current = await getName(SMILES);
    }

    await setSMILES?.current(SMILES);

    isLoading = false;
  }

  async function checkName() {

    const processGuess = guessedName.toLowerCase().replaceAll(' ', '');
    const processCorrect = chemicalName.current.toLowerCase().replaceAll(' ', '');
    
    const isCorrect =  processCorrect == processGuess;
    
    console.log(processGuess, processCorrect, isCorrect);

    let thisExample: PreviousExample = {
      correct: isCorrect,
      question_type: 'naming',
      answer: chemicalName.current, // Correct cannonical SMILES or UIPAC name
      guess: guessedName, // User inputed cannonical SMILES or UIPAC name
      timeStamp: (new Date()).toISOString(), // Why not
    }

    previousExamples.name.push(thisExample);

  }

  onMount(async () => {

    previousExamples.current = previousExamples.name

    // Wait for Kekule Container to load 
    const setupTimeout = async () => {
    if (setSMILES.current) {
        await setupExample();
      } else {

        // 10 ms wait
        await new Promise(resolve => setTimeout(resolve, 10));
        await setupTimeout();
      }
    };

    await setupTimeout();

    // Set current examples to this page
  })

  // let onclickGetName = $derived(getSMILES.current ? (async () => {isLoading = true; await getSMILES.current?.(); isLoading = false;}) : (async () => {warning('Naming function is not loaded')}));

</script>

<div class='h-full flex flex-col gap-y-4 justify-center items-center bg-slate-400'>

  <div class='bg-slate-700 rounded-md p-4 text-white text-xl font-bold'>
    What's it's Name?
  </div>

  <div class='flex items-center gap-x-4 w-full justify-around'>
      <div class='flex-1'>
      </div>
      <div class='justify-center'>
        <KekuleViewer veiwProvider='rdkit' bind:chemicalName bind:getSMILES bind:setSMILES bind:clearSMILES
          width='500px'
          height='300px'
        />
      </div>
      <div class='flex-1'>
        <!-- Generate new -->
         <Button onclick={setupExample} disabled={isLoading}>

          {#if isLoading}
            <Circle size="1" color="#EEE" unit="rem" />
          {:else}
            New Molecule
          {/if}
        </Button>
      </div>
  </div>

  <div class='flex gap-x-5'>
    <Button onclick={checkName}>
        Check Answer
    </Button>
    <Input onkeypress={(e) => {if(e.key == 'Enter'){checkName()}}} placeholder='UIPAC Name' bind:value={guessedName} />
  </div>

</div>