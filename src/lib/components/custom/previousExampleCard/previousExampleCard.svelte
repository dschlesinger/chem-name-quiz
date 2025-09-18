<script lang='ts'>
import { browser } from '$app/environment';
import { type PreviousExample } from '$lib/components/custom/previousExampleCard/previousExampleObject.svelte';
import { onMount } from 'svelte';
import Button from '$lib/components/ui/button/button.svelte';
import { Circle } from 'svelte-loading-spinners';
import { isPreviousExample, currentPreviousExample } from '$lib/components/custom/previousExampleCard/previousExampleObject.svelte';

const { 
    previousExample, 
    cardType = 'naming',
    expanded = false,
}: {
    previousExample: PreviousExample;
    cardType: 'naming' | 'drawing';
    expanded: boolean;
} = $props();

let RDKit = $state<any>(null);
let isLoadingRDKit = $state(true);
let isLoadingSVG = $state(true);
let correctSVG = $state('');
let guessSVG = $state('');

async function loadRDKit() {
    if (browser && !RDKit) {
        isLoadingRDKit = true;
        try {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@rdkit/rdkit/Code/MinimalLib/dist/RDKit_minimal.js';
            document.head.appendChild(script);
            
            await new Promise<void>((resolve) => {
                script.onload = () => resolve();
            });
            
            RDKit = await (window as any).initRDKitModule();
        } catch (error) {
            console.error('Failed to load RDKit:', error);
        } finally {
            isLoadingRDKit = false;
        }
    }
}

async function getRDKitSVG(SMILES: string): Promise<string> {
    return RDKit.get_mol(SMILES).get_svg('200', '200');
}

function handleClick() {
    if (cardType === 'naming') {
        isPreviousExample.name = true;
        currentPreviousExample.current = previousExample;
        currentPreviousExample.name = previousExample;
    } else if (cardType === 'drawing') {
        isPreviousExample.draw = true;
        currentPreviousExample.current = previousExample;
        currentPreviousExample.draw = previousExample;
    } else {
        console.error(`Unknown card type: ${cardType}`);
    }
}

function handleBackClick() {
    if (cardType === 'naming') {
        currentPreviousExample.name = undefined;
        isPreviousExample.name = false;
    } else if (cardType === 'drawing') {
        currentPreviousExample.draw = undefined;
        isPreviousExample.draw = false;
    } else {
        console.error(`Unknown card type: ${cardType}`);
    }
}

onMount(async () => {
    if (!RDKit) await loadRDKit();
});

$effect(async () => {
    if (!RDKit || !previousExample) return;

    isLoadingSVG = true;

    try {
        if (previousExample.question_type === 'naming') {
            correctSVG = await getRDKitSVG(previousExample.info);
        } else if (previousExample.question_type === 'drawing') {
            correctSVG = await getRDKitSVG(previousExample.answer);
            guessSVG = await getRDKitSVG(previousExample.guess);
        }
    } catch (error) {
        console.error('Failed to generate SVG:', error);
    } finally {
        isLoadingSVG = false;
    }
});

const backgroundClass = previousExample.correct ? 'bg-green-500' : 'bg-red-500';
const svgBackgroundClass = previousExample.correct ? 'bg-green-600' : 'bg-red-600';
const timestamp = new Date(currentPreviousExample?.current?.timeStamp).toUTCString();
</script>

{#if !expanded}
    {#if cardType === 'naming'}
        <button 
            type="button" 
            onclick={handleClick} 
            class="hover:outline-3 hover:outline-orange-400 hover:opacity-70 rounded-md m-1 flex w-64 min-h-24 h-24 {backgroundClass}"
        >
            <div class="flex flex-col justify-around flex-1 p-2">
                <div class="text-sm">Correct: {previousExample.answer}</div>
                <div class="text-sm">Guess: {previousExample.guess.slice(0, 10)}</div>
            </div>

            <div class="bg-gray-500 rounded-md overflow-hidden w-24 h-full flex items-center justify-center">
                {#if isLoadingSVG}
                    <Circle size="2" color="#EEE" unit="rem" />
                {:else}
                    <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                        {@html correctSVG}
                    </div>
                {/if}
            </div>
        </button>
    {:else if cardType === 'drawing'}
        <button 
            type="button" 
            onclick={handleClick} 
            class="hover:opacity-70 hover:outline-3 m-1 hover:outline-orange-400 flex bg-gray-500 rounded-md overflow-hidden min-h-24 w-48 justify-between"
        >
            <div class="p-0.5 bg-green-600 rounded-md overflow-hidden w-20 h-full flex items-center justify-center">
                {#if isLoadingSVG}
                    <Circle size="2" color="#EEE" unit="rem" />
                {:else}
                    <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                        {@html correctSVG}
                    </div>
                {/if}
            </div>

            <div class="flex items-center justify-center h-full">
                <h4>vs.</h4>
            </div>

            <div class="p-0.5 {svgBackgroundClass} rounded-md overflow-hidden w-20 h-full flex items-center justify-center">
                {#if isLoadingSVG}
                    <Circle size="2" color="#EEE" unit="rem" />
                {:else}
                    <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                        {@html guessSVG}
                    </div>
                {/if}
            </div>
        </button>
    {/if}
{:else}
    {#if cardType === 'naming'}
        <div class="flex flex-col items-center gap-y-2">
            <div class="p-0.5 bg-gray-600 rounded-md overflow-hidden min-h-48 h-full flex items-center justify-center">
                {#if isLoadingSVG}
                    <Circle size="2" color="#EEE" unit="rem" />
                {:else}
                    <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                        {@html correctSVG}
                    </div>
                {/if}
            </div>

            <div class="{svgBackgroundClass} p-2 rounded-md">
                You said: {previousExample.guess}
            </div>

            <div class="bg-green-600 p-2 rounded-md">
                Answer: {previousExample.answer}
            </div>

            <div class="self-start">{timestamp}</div>

            <Button class="bg-red-600" onclick={handleBackClick}>
                Back to Quiz
            </Button>
        </div>
    {:else if cardType === 'drawing'}
        <div class="flex flex-col items-center gap-y-2">
            <div class="p-2 bg-slate-600 text-white text-xl rounded-md">
                {previousExample.info}
            </div>

            <div class="flex rounded-md overflow-hidden min-h-48 w-128 justify-between gap-x-2">
                <div class="p-0.5 bg-green-600 rounded-md overflow-hidden h-full flex items-center justify-center">
                    {#if isLoadingSVG}
                        <Circle size="2" color="#EEE" unit="rem" />
                    {:else}
                        <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                            {@html correctSVG}
                        </div>
                    {/if}
                </div>

                <div class="flex items-center justify-center">
                    <h4>vs.</h4>
                </div>

                <div class="p-0.5 {svgBackgroundClass} rounded-md overflow-hidden h-full flex items-center justify-center">
                    {#if isLoadingSVG}
                        <Circle size="2" color="#EEE" unit="rem" />
                    {:else}
                        <div class="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                            {@html guessSVG}
                        </div>
                    {/if}
                </div>
            </div>

            <div class="self-start">{timestamp}</div>

            <Button class="bg-red-600" onclick={handleBackClick}>
                Back to Quiz
            </Button>
        </div>
    {/if}
{/if}