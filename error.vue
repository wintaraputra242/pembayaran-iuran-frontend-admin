<script setup lang="ts">
defineProps({
  error: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;">
    <div style="text-align:center;max-width:400px;">
      <h1>{{ error.statusCode || 500 }}</h1>
      <p>{{ error.statusMessage || error.message || 'Something went wrong' }}</p>

      <a href="/" style="margin-top:16px;display:inline-block;">
        Back to Home
      </a>
    </div>
  </div>
</template>
