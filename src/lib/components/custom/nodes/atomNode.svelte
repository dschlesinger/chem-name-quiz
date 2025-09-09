<script lang="ts">
  import { Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
  import { colorAtom } from '$lib/components/custom/nodes/atomColorizer'
 
  let { id, data }: NodeProps = $props();

  let { atomType = 'carbon' } = data;
 
  let { updateNodeData } = useSvelteFlow();

</script>
 
<div class='rounded-full atom-node w-8 h-8 border-white border-1 text-white text-center font-bold text-xl' style={`background: ${colorAtom(atomType)};`}>
    {atomType ? atomType[0] : '?' }
</div>