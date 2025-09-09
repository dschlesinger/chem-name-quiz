<script>
    import { useSvelteFlow } from "@xyflow/svelte";
    import Button from "../ui/button/button.svelte";

    const { fitView } = useSvelteFlow();

    let { padding = 0, onclick = undefined, ...restProps } = $props();

</script>

<Button {...restProps} onclick={() => fitView({padding: padding})}>Fit View</Button>