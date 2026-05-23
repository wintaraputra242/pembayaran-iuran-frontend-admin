<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

interface Header {
  key: string
  label?: string
  width?: string
  align?: 'start' | 'center' | 'end' | string
}

const props = withDefaults(defineProps<{
  headers: Header[]
  items: any[]
  loading?: boolean
  hasMore?: boolean
  hasFilter?: boolean
  noDataText?: string
  variant?: 'text' | 'elevated' | 'flat' | 'outlined' | 'tonal' | 'plain'
}>(), {
  noDataText: 'Tidak ada data',
  variant: 'elevated'
})

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'editPassword', item: any): void
  (e: 'loadMore'): void
}>()

const display = useDisplay()

// 🔥 MOBILE SENTINEL
const mobileSentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupObserver = async () => {
  if (!display.smAndDown.value) return
  if (!props.hasMore || props.loading) return

  await nextTick()

  if (!mobileSentinel.value) return

  observer?.disconnect()

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !props.loading) {
        emit('loadMore')
      }
    },
    {
      rootMargin: '100px',
    }
  )

  observer.observe(mobileSentinel.value)
}

onMounted(setupObserver)

onBeforeUnmount(() => {
  observer?.disconnect()
})

// 🔁 PASANG ULANG JIKA DATA BERUBAH
watch(
  () => props.items.length,
  () => setupObserver()
)

watch(
  () => display.smAndDown.value,
  () => setupObserver()
)
</script>


<template>
  <!-- ================= DESKTOP ================= -->
  <VTable v-if="!display.smAndDown" fixed-header height="400px" class="my-table">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header.key" :style="{ width: header.width }"
          :class="header.align === 'center' ? 'text-center' : ''">
          {{ header.label }}
        </th>
        <th style="width: 100px"></th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, i) in items" :key="item.id">
        <td>{{ i + 1 }}</td>

        <td v-for="header in headers.slice(1)" :key="header.key">
          <slot :name="`cell-${header.key}`" :item="item">
            {{ item[header.key] }}
          </slot>
        </td>

        <td>
          <div class="d-flex gap-2">
            <IconBtn size="small" variant="outlined" color="secondary" @click="emit('editPassword', item)">
              <VIcon icon="ri-lock-2-line" />
            </IconBtn>

            <IconBtn size="small" variant="outlined" color="secondary" @click="emit('edit', item)">
              <VIcon icon="ri-edit-line" />
            </IconBtn>
          </div>
        </td>
      </tr>

      <tr v-if="loading">
        <td colspan="99" class="text-center py-4">
          <VProgressCircular indeterminate size="26" />
        </td>
      </tr>

      <tr v-if="hasMore">
        <td colspan="99">
          <div style="height: 1px" />
        </td>
      </tr>
    </tbody>
  </VTable>

  <!-- ================= MOBILE ================= -->
  <div v-else class="list-data">
    <VCard v-for="(item, i) in items" :key="item.id" class="mb-4" rounded="lg" border="sm" :variant="props.variant"
      position="relative">
      <VCardText class="d-flex flex-column gap-2">
        <div class="text-caption text-medium-emphasis">
          #{{ i + 1 }}
        </div>

        <div v-for="header in headers.slice(1)" :key="header.key">
          <div class="text-caption text-medium-emphasis">
            <slot :name="`label-${header.key}`" :item="item" :label="header.label">
              {{ header.label }}
            </slot>
          </div>

          <div v-if="header.key === 'is_deleted'" class="font-weight-medium">
          </div>

          <div v-else-if="header.key !== 'actions'" class="font-weight-medium">
            <slot :name="`cell-${header.key}`" :item="item">
              {{ item[header.key] || '-' }}
            </slot>
          </div>

          <div v-else class="d-flex justify-end gap-2 mt-2">
            <slot :name="`cell-${header.key}`" :item="item">
              {{ item[header.key] }}
            </slot>
          </div>

          <div v-if="header.key === 'is_deleted' && item?.is_deleted" class="d-flex justify-end gap-2 mt-2">
            <VChip class="position-absolute" variant="flat" style="top: 10px; right: 10px;" size="small" color="error">
              Dihapus
            </VChip>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- 🔥 MOBILE SENTINEL -->
    <div v-if="hasMore" ref="mobileSentinel" style="height: 1px" />

    <div v-if="loading" class="text-center py-4">
      <VProgressCircular indeterminate size="26" />
    </div>

    <div v-if="props.items.length === 0 && !props.loading" class="text-center py-4">
      <p class="text-center ma-0">{{ props.hasFilter ? 'Data tidak ditemukan' : props.noDataText }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.list-data {
  background-color: transparent !important;
}
</style>
