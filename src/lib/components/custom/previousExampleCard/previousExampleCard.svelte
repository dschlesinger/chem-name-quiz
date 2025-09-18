<script lang='ts'>

    import { browser } from '$app/environment';
    import { type PreviousExample } from '$lib/components/custom/previousExampleCard/previousExampleObject.svelte';
    import { onMount } from 'svelte';

    const { 
        previousExample, 
        cardType = 'naming',
        onclick = $bindable(() => {console.log('This was clicked')}),
    } : {previousExample: PreviousExample, cardType: 'naming' | 'drawing'} = $props();

    let RDKit = $state(null);
    let isLoadingRDKit = $state(true);

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
            }
            isLoadingRDKit = false;
        }
    }

    let correctSVG = $state('');
    let guessSVG = $state('');

    async function getRDKitSVG(SMILES:string) {
            // Use smaller dimensions since we'll scale with CSS
            return RDKit.get_mol(SMILES).get_svg('200', '200')
    }

    onMount(async () => {

        if (!RDKit) await loadRDKit();

    })

    $effect(async () => {
        if (!RDKit || !previousExample) return;

        if (previousExample.question_type === 'naming') {
            correctSVG = await getRDKitSVG(previousExample.info);
        } else if (previousExample.question_type === 'drawing') {
            correctSVG = await getRDKitSVG(previousExample.answer);
            guessSVG = await getRDKitSVG(previousExample.guess);
        }
    });

</script>

{#if cardType == 'naming'}
<div onclick={() => {onclick(previousExample)}} class={`rounded-md flex w-64 min-h-24 h-24 ${previousExample.correct ? 'bg-green-500' : 'bg-red-500'}`}>

    <div class='flex flex-col justify-around flex-1 p-2'>
        <div class="text-sm">Correct: {previousExample.answer}</div>
        <div class="text-sm">Guess: {previousExample.guess.slice(0, 10)}</div>
    </div>

    <div class='bg-gray-500 rounded-md overflow-hidden w-24 h-full flex items-center justify-center'>
        <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
            {@html correctSVG}
        </div>
    </div>

</div>
{:else if cardType == 'drawing'}
<div onclick={onclick} class='flex bg-gray-500 rounded-md overflow-hidden min-h-24 w-48 justify-between'>

    <div class='p-1 bg-green-600 rounded-md overflow-hidden w-20 h-full flex items-center justify-center'>
        <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
            {@html correctSVG}
        </div>
    </div>

    <div class='items-center justify-center'>
        <h4>vs.</h4>
    </div>

    <div class={`p-1 ${previousExample.correct ? 'bg-green-600' : 'bg-red-600'} rounded-md overflow-hidden w-20 h-full flex items-center justify-center`}>
        <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
            {@html guessSVG}
        </div>
    </div>

</div>
{/if}