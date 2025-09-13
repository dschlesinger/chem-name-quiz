<script lang='ts'>

    import { page } from '$app/state';

    const { children } = $props();

    let previousExamples = $derived(page.data?.previousExamples?.current ?? []);

</script>

<div class='h-full w-full flex'>

    <div class='flex-1'>
        {@render children?.()}
    </div>

    <aside class='bg-blue-950 max-w-96 min-w-72 ml-auto'>

        <header class='w-full p-4 text-center text-white font-bold bg-slate-700'>
            Previous Examples
        </header>

        <div>
            {#each previousExamples as PE}

                <!-- Previous Example Card -->

                <div class='w-24 h-24 bg-red-500'>

                </div>

            {/each}
            </div>

    </aside>

</div>