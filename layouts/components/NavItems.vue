<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import menu from '@/navigations/vertical'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
  <template v-for="(item, i) in menu" :key="i">

    <!-- Section Title -->
    <VerticalNavSectionTitle
      v-if="item.type === 'section-title'"
      :item="item"
    />

    <!-- Group -->
    <VerticalNavGroup
      v-else-if="item.type === 'group'"
      :item="item"
    >
      <VerticalNavLink
        v-for="(child, j) in item.children"
        :key="j"
        :item="child"
      />
    </VerticalNavGroup>

    <!-- Single Link -->
    <VerticalNavLink
      v-else-if="item.type === 'link'"
      :item="item"
    />
  </template>
</template>
