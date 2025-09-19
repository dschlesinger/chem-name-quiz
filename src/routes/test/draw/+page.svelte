<script lang='ts'>

    import KekuleViewer from "$lib/components/custom/kekuleContainer.svelte";
    import PreviousExampleCard from "$lib/components/custom/previousExampleCard/previousExampleCard.svelte";
    import { type PreviousExample, previousExamples, currentPage, isPreviousExample, currentPreviousExample } from "$lib/components/custom/previousExampleCard/previousExampleObject.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";
    import { generateMolecule } from '$lib/kekuleUtils';
    import { Circle } from "svelte-loading-spinners";

    let chemicalName = $state({current: ''});
    let getSMILES = $state({current: null})
    let getUIPAC = $state({current: null})
    let setSMILES = $state({current: null})
    let clearSMILES = $state({current: null})
    let isEqual = $state({current: null})
    let isLoading = $state(true);

    let generatedSMILES = $state({current: undefined});
    let generatedUIPAC = $state({current: undefined});

    async function getName(SMILES: string) {
      const response = await fetch(
        '/api/nameChemicals',
        {
          method: 'POST',
          body: JSON.stringify({'SMILES': SMILES})
        },
      );

      const { name } = await response.json();
      return name
    }

    const checkDrawing = async () => {

      let drawnSMILES = await getSMILES.current?.();

      console.log(drawnSMILES)

      if (!drawnSMILES || drawnSMILES == '') {
        return
      }

      const isCorrect = await isEqual.current(generatedSMILES.current);
      
      let thisExample: PreviousExample = {
        correct: isCorrect,
        question_type: 'drawing',
        info: generatedUIPAC.current,
        answer: generatedSMILES.current, // Correct cannonical SMILES or UIPAC name
        guess: drawnSMILES, // User inputed cannonical SMILES or UIPAC name
        timeStamp: (new Date()).toISOString(), // Why not
      }
      
      previousExamples.draw.push(thisExample);

    }

    async function setupExample() {

      isLoading = true;

      // Blank
      generatedSMILES.current = undefined;
      generatedUIPAC.current = undefined;

      generatedSMILES.current = await generateMolecule();
      generatedUIPAC.current = await getName(generatedSMILES.current);

      while (generatedUIPAC.current == null) {
        generatedSMILES.current = await generateMolecule();
        generatedUIPAC.current = await getName(generatedSMILES.current);
      }

      isLoading = false;
    }

    onMount(async () => {

        previousExamples.current = previousExamples.draw
        currentPage.current = 'drawing'
        isPreviousExample.current = isPreviousExample.draw
        currentPreviousExample.current = currentPreviousExample.draw

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

    })

</script>

<div class='h-full flex flex-col gap-y-4 justify-center items-center bg-slate-400'>

  {#if isPreviousExample.draw}
    <div class='bg-slate-500 p-4 rounded-md'>

      <PreviousExampleCard expanded={true} cardType='drawing' previousExample={currentPreviousExample.draw} />

    </div>
  {:else}
  <div class='bg-slate-700 rounded-md p-4 text-white text-xl font-bold'>
    Draw this Molecule!
  </div>

  <div>
    <div>{generatedUIPAC.current ? generatedUIPAC.current : 'Loading ...'}</div>
  </div>

  <div class='flex flex-col md:flex-row items-center gap-y-2 md:gap-x-4 w-full justify-around'>
      <div class='flex-1 hidden invisible md:block'>
        <!-- to center -->
        <Button class='bg-yellow-600 hover:bg-yellow-600 hover:opacity-75' onclick={setupExample}>
          Generate New
        </Button>
         <Button class='bg-red-600 hover:bg-red-600 hover:opacity-75' onclick={clearSMILES.current}>
          Clear Canvas
        </Button>
        <Button class='bg-green-600 hover:bg-green-600 hover:opacity-75' onclick={checkDrawing}>
          Check Answer
        </Button>
      </div>
      <div class='flex justify-center w-[90%] md:w-auto h-full'>
        <KekuleViewer 
          veiwProvider='kekule' 
          bind:chemicalName 
          bind:getSMILES 
          bind:getUIPAC 
          bind:setSMILES 
          bind:clearSMILES
          bind:isEqual
          width='500px'
          height='300px'
        />
      </div>
      <div class='flex-1 flex md:flex-col md:px-4 gap-x-1 md:gap-y-4 md:items-center'>
        <!-- Generate new -->
         <Button class='bg-yellow-600 hover:bg-yellow-600 hover:opacity-75' onclick={setupExample}>
          Generate New
        </Button>
         <Button class='bg-red-600 hover:bg-red-600 hover:opacity-75' onclick={clearSMILES.current}>
          Clear Canvas
        </Button>
        <Button class='bg-green-600 hover:bg-green-600 hover:opacity-75' onclick={checkDrawing}>
          Check Answer
        </Button>
      </div>
  </div>
  {/if}

</div>