<script>
    import { SvelteFlow, Background } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';

    let nodes = $state.raw([
        {
            id: '1',
            position: { x: 0, y: 0 },
            data: { label: 'Hello' },
        },
        {
            id: '2',
            position: { x: 100, y: 100 },
            data: { label: 'World' },
        },
    ]);

</script>

<div class='w-screen h-screen flex justify-center items-center bg-black'>
    <div class='w-[80%] h-[80%]'>
        <SvelteFlow class='rounded-md' bind:nodes>
            <Background />
        </SvelteFlow>
    </div>
</div>