import type { ThemeDefinition } from 'vuetify'

// 🎨 Primary yang baru (biru tua, tidak terlalu gelap)
export const staticPrimaryColor = '#1E3A8A'
export const staticPrimaryDarkenColor = '#1A347A'

export const themes: Record<string, ThemeDefinition> = {
  light: {
    dark: false,
    colors: {
      'primary': staticPrimaryColor,
      'on-primary': '#fff',
      'primary-darken-1': staticPrimaryDarkenColor,

      'secondary': '#8A8D93',
      'secondary-darken-1': '#7C7F84',
      'on-secondary': '#fff',

      'success': '#56CA00',
      'success-darken-1': '#4DB600',
      'on-success': '#fff',

      'info': '#2563EB',         // biru info yang lebih cocok dengan primary baru
      'info-darken-1': '#1D4ED8',
      'on-info': '#fff',

      'warning': '#FFB400',
      'warning-darken-1': '#E6A200',
      'on-warning': '#fff',

      'error': '#FF4C51',
      'error-darken-1': '#E64449',
      'on-error': '#fff',

      'background': '#f4f5fa',
      'on-background': '#1E293B',    // lebih selaras dengan tema biru

      'surface': '#fff',
      'on-surface': '#1E293B',

      'grey-50': '#FAFAFA',
      'grey-100': '#F5F5F5',
      'grey-200': '#EEEEEE',
      'grey-300': '#E0E0E0',
      'grey-400': '#BDBDBD',
      'grey-500': '#9E9E9E',
      'grey-600': '#757575',
      'grey-700': '#616161',
      'grey-800': '#424242',
      'grey-900': '#212121',

      'perfect-scrollbar-thumb': '#c7c7d1',

      'skin-bordered-background': '#fff',
      'skin-bordered-surface': '#fff',

      'expansion-panel-text-custom-bg': '#fafafa',

      'track-bg': '#ECF1FF',   // subtle blue
      'chat-bg': '#F4F7FF',    // subtle blue
    },

    variables: {
      'code-color': '#1E3A8A',            // sebelumnya ungu → ganti biru
      'overlay-scrim-background': '#1E293B',
      'tooltip-background': '#1E3A8A',

      'overlay-scrim-opacity': 0.5,
      'hover-opacity': 0.04,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.4,

      'border-color': '#1E293B',
      'border-opacity': 0.12,

      'table-header-color': '#EEF2FF',   // biru muda netral

      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,

      // 👉 shadows tetap sama namun warnanya disesuaikan
      'shadow-key-umbra-color': '#1E293B',

      'shadow-xs-opacity': '0.16',
      'shadow-sm-opacity': '0.18',
      'shadow-md-opacity': '0.20',
      'shadow-lg-opacity': '0.22',
      'shadow-xl-opacity': '0.24',
    },
  },

  dark: {
    dark: true,
    colors: {
      'primary': staticPrimaryColor,
      'on-primary': '#fff',
      'primary-darken-1': staticPrimaryDarkenColor,

      'secondary': '#8A8D93',
      'secondary-darken-1': '#7C7F84',
      'on-secondary': '#fff',

      'success': '#56CA00',
      'success-darken-1': '#4DB600',
      'on-success': '#fff',

      'info': '#3B82F6',         // biru info untuk dark mode
      'info-darken-1': '#2563EB',
      'on-info': '#fff',

      'warning': '#FFB400',
      'warning-darken-1': '#E6A200',
      'on-warning': '#fff',

      'error': '#FF4C51',
      'error-darken-1': '#E64449',
      'on-error': '#fff',

      'background': '#1C2234',        // dark blue-gray, bukan ungu
      'on-background': '#E5E9F5',

      'surface': '#242B3D',
      'on-surface': '#E5E9F5',

      'grey-50': '#23293B',
      'grey-100': '#293146',
      'grey-200': '#394263',
      'grey-300': '#4B5683',
      'grey-400': '#6A78A4',
      'grey-500': '#7F8DC0',
      'grey-600': '#A6B2D9',
      'grey-700': '#BCC6E5',
      'grey-800': '#D4DBF2',
      'grey-900': '#E8ECFA',

      'perfect-scrollbar-thumb': '#394263',

      'skin-bordered-background': '#242B3D',
      'skin-bordered-surface': '#242B3D',

      'expansion-panel-text-custom-bg': '#2C344A',
      'track-bg': '#323B55',
      'chat-bg': '#2D3650',
    },

    variables: {
      'code-color': '#60A5FA',        // biru terang untuk dark mode
      'overlay-scrim-background': '#1C2234',
      'tooltip-background': '#E5E9F5',

      'overlay-scrim-opacity': 0.5,
      'hover-opacity': 0.04,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'disabled-opacity': 0.4,
      'dragged-opacity': 0.1,

      'border-color': '#E5E9F5',
      'border-opacity': 0.12,

      'table-header-color': '#2A3350',

      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,

      // 👉 shadow
      'shadow-key-umbra-color': '#0F172A',

      'shadow-xs-opacity': '0.20',
      'shadow-sm-opacity': '0.22',
      'shadow-md-opacity': '0.24',
      'shadow-lg-opacity': '0.26',
      'shadow-xl-opacity': '0.28',
    },
  },
}

export default themes
