<script>
    import FitViewButton from '$lib/components/custom/fitViewButton.svelte';
    import { SvelteFlow, SvelteFlowProvider, Background,
             BackgroundVariant, MiniMap
    } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';

    import AtomNode from '$lib/components/custom/nodes/atomNode.svelte';

    let nodes = $state.raw([
        {
            id: '1',
            type: 'AtomNode',
            position: { x: 0, y: 0 },
            data: { label: 'Hello' },
        },
        {
            id: '2',
            type: 'AtomNode',
            position: { x: 100, y: 100 },
            data: { label: 'World' },
        },
    ]);

    let edges = $state.raw([{ id: 'e1-2', source: '1', target: '2' }]);

    const nodeTypes = { AtomNode: AtomNode };

</script>

<div class='w-screen h-screen flex justify-center items-center bg-black'>
    <SvelteFlowProvider>
        <div class='flex flex-col w-4/5 h-4/5'>
            <div class='flex-1 min-h-0'>
                <SvelteFlow class='rounded-full w-full h-full border-white border-2' 
                    bind:nodes bind:edges {nodeTypes} fitView
                >
                    <Background bgColor="#000" patternColor="#93e" variant={BackgroundVariant.Dots} size={2} />
                    <MiniMap class='rounded-2xl' maskColor='#00000030' bgColor='purple'  />
                </SvelteFlow>
            </div>
            <div class='mt-4'>
                <FitViewButton />
            </div>
        </div>
    </SvelteFlowProvider>
</div>