<script lang='ts'>

  import { page } from '$app/state';
  import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from "$lib/components/ui/input/index.js";
  import { Circle } from 'svelte-loading-spinners';
  import { failure, success, warning } from '$lib/components/custom/toasts.svelte';

  import { generateMolecule } from '$lib/kekuleUtils';
  import { onMount, tick } from 'svelte';

  let previousExamples = $state({current: []});

  // Pass to layout for side bar
  page.data.previousExamples = previousExamples;

  let chemicalName = $state({current: ''});
  let getSMILES = $state({current: null})
  let setSMILES = $state({current: null})
  let clearSMILES = $state({current: null})
  let guessedName = $state('');

  let isLoading = $state(true);

  let getName = $derived(getSMILES.current ? (async () => {isLoading = true; const n = await getSMILES.current?.(); isLoading = false; return n;}) : (async () => {warning('Naming function is not loaded')}));

  async function setupExample() {

    isLoading = true;

    const SMILES = await generateMolecule();

    await setSMILES?.current(SMILES);

    chemicalName.current = await getName();

    isLoading = false;
  }

  async function checkName() {

    const processGuess = guessedName.toLowerCase().replaceAll(' ', '');
    const processCorrect = chemicalName.current.toLowerCase().replaceAll(' ', '');
    
    const isCorrect =  processCorrect == processGuess;
    
    console.log(processGuess, processCorrect, isCorrect);

    if (isCorrect) {
      success('Correct!')
    }
    else {
      failure('Incorrect :(')
    }

  }

  onMount(async () => {

    const checkVariable = async () => {
    if (setSMILES.current) {
        await setupExample();
      } else {

        // 10 ms wait
        await new Promise(resolve => setTimeout(resolve, 10));
        await checkVariable();
      }
    };

    await checkVariable();
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
        <KekuleViewer bind:chemicalName bind:getSMILES bind:setSMILES bind:clearSMILES
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
            Generate New
          {/if}
        </Button>
      </div>
  </div>

  <div class='flex gap-x-5'>
    <Button onclick={checkName}>
        Check Answer
    </Button>
    <Input placeholder='UIPAC Name' bind:value={guessedName} />
  </div>

</div>