<script lang='ts'>

    import { type PreviousExample } from '$lib/components/custom/previousExampleCard/previousExampleObject.svelte';

    const { previousExample } : {previousExample: PreviousExample} = $props();
</script>

<!-- Make it a ShadCN card later -->
 <div class={`w-32 min-h-32 ${previousExample.correct ? 'bg-green-600' : 'bg-red-600'}`}>
    {previousExample.correct} == {previousExample.answer}
 </div>