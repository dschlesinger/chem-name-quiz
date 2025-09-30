<script lang='ts'>

  import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';
  import PreviousExampleCard from '$lib/components/custom/previousExampleCard/previousExampleCard.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from "$lib/components/ui/input/index.js";
  import { Circle } from 'svelte-loading-spinners';
  import { failure, success, warning } from '$lib/components/custom/toasts.svelte';

  import { generateMolecule } from '$lib/kekuleUtils';
  import { onMount } from 'svelte';
  import { type PreviousExample, previousExamples, currentPage, isPreviousExample, currentPreviousExample } from '$lib/components/custom/previousExampleCard/previousExampleObject.svelte';

  let chemicalName = $state({current: ''});
  let getSMILES = $state({current: null})
  let getUIPAC = $state({current: null})
  let setSMILES = $state({current: null})
  let clearSMILES = $state({current: null})
  let guessedName = $state('');
  let SMILES = $state('');

  let isLoading = $state(true);

  let getName = $derived(getUIPAC.current ? (async (givenSMILES = undefined) => {const n = await getUIPAC.current?.(givenSMILES); return n;}) : (async () => {warning('Naming function is not loaded')}));

  async function setupExample() {

    isLoading = true;

    SMILES = await generateMolecule();
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

    let thisExample: PreviousExample = {
      correct: isCorrect,
      question_type: 'naming',
      info: SMILES,
      answer: chemicalName.current, // Correct cannonical SMILES or UIPAC name
      guess: guessedName, // User inputed cannonical SMILES or UIPAC name
      timeStamp: (new Date()).toISOString(), // Why not
    }

    previousExamples.name.push(thisExample);

  }

  onMount(async () => {

    previousExamples.current = previousExamples.name
    currentPage.current = 'naming'
    isPreviousExample.current = isPreviousExample.name
    currentPreviousExample.current = currentPreviousExample.name

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

  {#if isPreviousExample.name}
    <div class='bg-slate-500 p-4 rounded-md'>

      <PreviousExampleCard expanded={true} cardType='naming' previousExample={currentPreviousExample.name} />

    </div>
  {:else}
  <div class='bg-slate-700 rounded-md p-4 text-white text-xl font-bold'>
    What's it's Name?
  </div>

  <div class='flex flex-col md:flex-row items-center gap-y-2 md:gap-x-4 w-full justify-around'>
      <div class=' flex-1 hidden invisible md:block'>
        <Button class='bg-yellow-600 px-4 flex justify-center hover:bg-yellow-600 hover:opacity-75' onclick={setupExample}>
          {#if isLoading}
            <Circle size="1" color="#EEE" unit="rem" />
          {:else}
            Generate New
          {/if}
        </Button>
      </div>
      <div class='flex w-[90%] md:w-auto justify-center h-full'>
        <KekuleViewer 
          veiwProvider='rdkit' 
          bind:chemicalName 
          bind:getSMILES 
          bind:setSMILES 
          bind:clearSMILES 
          bind:getUIPAC
          width='500px'
          height='300px'
        />
      </div>
      <div class='flex-1'>
        <!-- Generate new -->
         <Button class='bg-yellow-600 px-4 flex justify-center hover:bg-yellow-600 hover:opacity-75' onclick={setupExample}>
          {#if isLoading}
            <Circle size="1" color="#EEE" unit="rem" />
          {:else}
            Generate New
          {/if}
        </Button>
      </div>
  </div>

  <div class='flex gap-x-5'>
    <Button class='bg-green-600 hover:bg-green-600 hover:opacity-75' onclick={checkName}>
        Check Answer
    </Button>
    <Input onkeypress={(e) => {if(e.key == 'Enter'){checkName()}}} placeholder='IUPAC Name' bind:value={guessedName} />
  </div>
  {/if}

</div>