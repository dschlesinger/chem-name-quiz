<script lang='ts'>
    import { previousExamples, currentPage } from '$lib/components/custom/previousExampleCard/previousExampleObject.svelte';
    import PreviousExampleCard from '$lib/components/custom/previousExampleCard/previousExampleCard.svelte';

    const { children } = $props();

    let previousExamplesCurrent = $derived(previousExamples?.current ?? []);
</script>

<div class='h-full w-full flex'>
    <div class='flex-1'>
        {@render children?.()}
    </div>

    <aside class='bg-blue-950 max-w-96 min-w-72 ml-auto flex flex-col'>
        <header class='w-full p-4 text-center text-white font-bold bg-slate-700'>
            Previous Examples
        </header>

        <div class='flex-1 overflow-auto items-center gap-y-2 flex flex-col'>
            {#each previousExamplesCurrent as PE}
                <PreviousExampleCard cardType={currentPage.current} previousExample={PE} />
            {/each}
        </div>
    </aside>
</div>