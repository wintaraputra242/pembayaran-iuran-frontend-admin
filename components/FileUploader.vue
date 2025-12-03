<script setup lang="ts">
import VueDropzone from 'dropzone-vue3'
import { computed } from 'vue'

// Props fleksibel
const props = defineProps({
  // seluruh opsi Dropzone bisa dikirim dari parent
  options: {
    type: Object,
    default: () => ({}),
  },

  // event custom: success, error, addedfile, removedfile, dsb.
  onEvents: {
    type: Object,
    default: () => ({}),
  },
})

// merge default options + injected options dari parent
const mergedOptions = computed(() => ({
  url: '/api/upload',
  maxFilesize: 2, // MB
  maxFiles: 5,
  acceptedFiles: 'image/*,.pdf',

  ...props.options,
}))
</script>

<template>
  <VueDropzone
    id="my-dropzone"
    class="my-dropzone"
    :options="mergedOptions"

    @vdropzone-success="onEvents.success?.($event)"
    @vdropzone-error="onEvents.error?.($event)"
    @vdropzone-added-file="onEvents.addedFile?.($event)"
    @vdropzone-removed-file="onEvents.removedFile?.($event)"
    @vdropzone-complete="onEvents.complete?.($event)"
  />
</template>

<style scoped>
.my-dropzone {
  border: 2px dashed #9e9e9e;
  border-radius: 10px;
  padding: 40px;
  background: #fafafa;
  transition: 0.2s;
}

.my-dropzone:hover {
  border-color: #1976d2;
  background: #f5faff;
}
</style>
