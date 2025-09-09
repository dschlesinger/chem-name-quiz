<script>
  import KekuleViewer from '$lib/components/custom/kekuleContainer.svelte';

  let chemicalName = $state('');

</script>

<KekuleViewer />

{ chemicalName }