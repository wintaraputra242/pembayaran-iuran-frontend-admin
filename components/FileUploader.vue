<script setup lang="ts">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import VueDropzone from 'dropzone-vue3';
import { computed, ref } from 'vue';

// Props fleksibel
const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },

  // event custom
  onEvents: {
    type: Object,
    default: () => ({}),
  },

  // --- RULES mirip Vuetify ---
  rules: {
    type: Array,
    default: () => [],
  },
})

const dzRef = ref<any>(null)

// files dari Dropzone
const files = ref<any>(null)

// error message
const errorMessage = ref("")

// merged options
const mergedOptions = computed(() => ({
  url: '/api/upload',
  maxFilesize: 2,
  maxFiles: 5,
  acceptedFiles: 'image/*,.pdf',
  previewsContainer: false,
  autoProcessQueue: false, // penting agar tidak upload otomatis
  ...props.options,
}))

// VALIDATOR ala Vuetify
function validateFile(file: any) {
  for (const rule of props.rules) {
    const result = rule(file)
    if (result !== true) {
      errorMessage.value = result
      return false
    }
  }
  errorMessage.value = ""
  return true
}

let oldFile = {} as File

// WATCH ketika file ditambahkan
function handleFileAdded(event: any) {
  const file = event

  if (dzRef.value.dropzone.options.maxFiles === 1) {
    dzRef.value.dropzone.removeFile(oldFile)
    files.value = file
  }
  if (dzRef.value.dropzone.options.maxFiles > 1) files.value.push(file)

  if(!validateFile(file)) return

  oldFile = event
  props.onEvents.addedFile?.(event)
}

// WATCH ketika file dihapus
function handleRemoved(event: any) {
  if (dzRef.value.dropzone.options.maxFiles === 1) {
    dzRef.value.dropzone.removeFile(event)
    files.value = {}
  }
  if (dzRef.value.dropzone.options.maxFiles > 1) files.value = files.value?.filter(f => f.name !== event.file.name)

  props.onEvents.removedFile?.(event)
}

const handleFileError = (event: any) => {
  validateFile(event)

  dzRef.value.dropzone.removeFile(event)

  console.error('error', event)
  props.onEvents.error?.(event)
}

// Format ukuran file
function formatSize(bytes: number) {
  if (!bytes) return "0 KB"
  return (bytes / 1024 / 1024).toFixed(2) + " MB"
}

// Tentukan icon berdasarkan file mimetype
function getFileIcon(file: any) {
  console.log(file)

  const name = file.name.toLowerCase()

  const iconFileFormats = {
    excel: `
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
      xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="8" fill="#1F7244"/>
        <text x="50%" y="60%" fill="white" font-size="20" text-anchor="middle"
        font-family="Arial" font-weight="bold">XLS</text>
      </svg>
    `,
    pdf: `
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
      xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="8" fill="#C62828"/>
        <text x="50%" y="60%" fill="white" font-size="20" text-anchor="middle"
        font-family="Arial" font-weight="bold">PDF</text>
      </svg>
    `,
    word: `
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
      xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="8" fill="#1565C0"/>
        <text x="50%" y="60%" fill="white" font-size="20" text-anchor="middle"
        font-family="Arial" font-weight="bold">DOC</text>
      </svg>
    `,
    image: `
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
      xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="8" fill="#5C6BC0"/>
        <circle cx="34" cy="16" r="5" fill="white"/>
        <path d="M10 34L20 24L32 32L38 26V38H10V34Z" fill="white"/>
      </svg>
    `,
    file: `
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
      xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="8" fill="#9E9E9E"/>
        <text x="50%" y="60%" fill="white" font-size="18" text-anchor="middle"
        font-family="Arial" font-weight="bold">FILE</text>
      </svg>
    `,
  }

  if (name.endsWith('.xlsx') || name.endsWith('.xls'))
    return iconFileFormats['excel']
  if (name.endsWith('.pdf'))
    return iconFileFormats['pdf']
  if (name.endsWith('.doc') || name.endsWith('.docx'))
    return iconFileFormats['word']
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png'))
    return iconFileFormats['image']
  
  return iconFileFormats['file']
}

</script>

<template>
  <div>
    <ClientOnly>
      <VueDropzone
        ref="dzRef"
        id="my-dropzone"
        class="my-dropzone"
        :options="mergedOptions"
  
        @vdropzone-file-added="handleFileAdded"
        @vdropzone-file-removed="handleRemoved"
  
        @vdropzone-success="onEvents.success?.($event)"
        @vdropzone-error="handleFileError"
        @vdropzone-complete="onEvents.complete?.($event)"
      />
    </ClientOnly>

    <!-- ERROR MESSAGE mirip Vuetify -->
    <div
      v-if="errorMessage"
      class="text-red text-caption mt-2"
    >
      {{ errorMessage }}
    </div>

    <!-- PREVIEW FILE CUSTOM -->
    <div class="mt-4">
      <!-- Single mode -->
      <template v-if="dzRef?.dropzone?.options?.maxFiles === 1 && files && files.name">
        <div class="preview-item d-flex gap-3 align-center border pa-2 rounded-lg position-relative">
          <div class="file-icon">
            <div v-html="getFileIcon(files)" />
          </div>
          <div class="file-info">
            <div class="file-name">{{ files.name }}</div>
            <div class="file-size text-body-2">{{ formatSize(files.size) }}</div>
          </div>

          <div class="position-absolute" style="right: 5px; top: 4px;">
            <IconBtn size="small" density="compact" @click="handleRemoved(files)">
              <VIcon icon="ri-close-line" size="16" />
            </IconBtn>
          </div>
        </div>
      </template>

      <!-- Multiple mode -->
      <template v-else-if="Array.isArray(files) && files.length">
        <div
          v-for="file in files"
          :key="file.name"
          class="preview-item"
        >
          <div class="file-icon">
            <img :src="getFileIcon(file)" width="40" />
          </div>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-size">{{ formatSize(file.size) }}</div>
          </div>
        </div>
      </template>
    </div>

  </div>
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

.text-red {
  color: #ff5252;
}
</style>
