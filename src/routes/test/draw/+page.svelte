<script lang='ts'>

    import KekuleViewer from "$lib/components/custom/kekuleContainer.svelte";
    import { type PreviousExample, previousExamples } from "$lib/components/custom/previousExampleCard/previousExampleObject.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";
    import { generateMolecule } from '$lib/kekuleUtils';
    import { Circle } from "svelte-loading-spinners";

    let chemicalName = $state({current: ''});
    let getSMILES = $state({current: null})
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

    async function checkDrawing() {

      console.log(
        await isEqual.current(
          generatedSMILES.current
        )
      )

    }

    async function setupExample() {

      isLoading = true;

      // Blank
      generatedSMILES.current = undefined;
      generatedUIPAC.current = undefined;

      generatedSMILES.current = await generateMolecule();
      generatedUIPAC.current = await getName(generatedSMILES.current);

      isLoading = false;
    }

    onMount(async () => {

        previousExamples.current = previousExamples.draw

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

  <div class='bg-slate-700 rounded-md p-4 text-white text-xl font-bold'>
    Draw this Molecule!
  </div>

  <div>
    <div>{generatedUIPAC.current ? generatedUIPAC.current : 'Loading ...'}</div>
  </div>

  <div class='flex items-center gap-x-4 w-full justify-around'>
      <div class='flex-1'>
      </div>
      <div class='justify-center'>
        <KekuleViewer 
          veiwProvider='kekule' 
          bind:chemicalName 
          bind:getSMILES 
          bind:setSMILES 
          bind:clearSMILES
          bind:isEqual
          width='500px'
          height='300px'
        />
      </div>
      <div class='flex-1 flex flex-col gap-y-4 items-center'>
        <!-- Generate new -->
         <Button onclick={setupExample}>
          Generate New
        </Button>
         <Button onclick={clearSMILES.current}>
          Clear Canvas
        </Button>
        <Button onclick={checkDrawing}>
          Check Answer
        </Button>
      </div>
  </div>

</div>