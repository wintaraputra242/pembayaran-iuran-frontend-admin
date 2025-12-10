<script setup lang="ts">
import { VueDatePicker } from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import { id } from 'date-fns/locale'
import { computed, ref, watch } from "vue"

const props = defineProps({
  modelValue: [String, Date, Array, Object],
  label: String,
  placeholder: String,
  format: { type: String, default: "dd/MM/yyyy" },
  enableTime: { type: Boolean, default: false },
  range: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  rules: { type: Array, default: () => [] },
})

const emit = defineEmits(["update:modelValue"])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
})

const errorMessage = ref("")

function validate() {
  for (const rule of props.rules) {
    const result = rule(model.value)
    if (result !== true) {
      errorMessage.value = result
      return false
    }
  }
  errorMessage.value = ""
  return true
}

watch(() => props.modelValue, () => validate())
</script>

<template>
  <div class="base-date-picker">
    <!-- Label -->
    <label v-if="label" class="bdp-label">
      {{ label }}
    </label>

    <!-- Input -->
    <VueDatePicker
      v-model="model"
      :placeholder="placeholder"
      :formats="{ input: format }"
      :range="range"
      :time-config="{
        enableTimePicker: enableTime
      }"
      :dark="false"
      :teleport="true"
      :disabled="disabled"
      :locale="id"
      :clearable="clearable"
      :rules="rules"
      class="bdp-input"
      :action-row="{ showSelect: false }"
      auto-apply
      @blur="validate()"
    />

    <!-- Error -->
    <p v-if="errorMessage" class="bdp-error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
/* LABEL */
.bdp-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* ERROR */
.bdp-error {
  margin-top: 4px;
  color: #FF4C51;
  font-size: 0.75rem;
  font-weight: 500;
}

/* POPUP CALENDAR */
.bdp-menu {
  border-radius: 10px !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
}

/* CELL */
.bdp-cell.dp__active_date {
  background: #1E3A8A !important;
  color: white !important;
}

.bdp-cell:hover {
  background: #f4e7ff !important;
}
</style>

<!-- CUSTOM THEME OVERRIDE -->
<style lang="scss">
$font-family-custom: "Inter", sans-serif, -apple-system, blinkmacsystemfont, "Segoe UI", roboto,
  "Helvetica Neue", arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

.dp__theme_light {
  --dp-primary-color: #1E3A8A;
  --dp-primary-text-color: #fff;
  --dp-hover-color: #F4ECFF;
  --dp-border-color: #e0e0e0;
  --dp-icon-color: #1E3A8A;
  --dp-border-radius: 10px;
}

/* INPUT */
.bdp-input .dp__input {
  width: 100%;
  height: 48px;
  border: 1px solid #d1d1d1;
  border-radius: 6px !important;
  font-size: 15px;
  transition: border-color 0.2s ease;
  background-color: white;
  font-family: $font-family-custom;
}

.bdp-input .dp__input:focus {
  border-color: #1E3A8A !important; /* Materio primary */
  outline: none;
  box-shadow: none !important;
}
</style>
