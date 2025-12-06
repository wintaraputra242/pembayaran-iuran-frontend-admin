export default [
    { type: 'link', title: 'Dashboard', icon: 'ri-home-smile-line', to: '/dashboard' },
    {
        type: 'group',
        title: 'Master Data',
        icon: 'ri-box-3-line',
        open: true,
        children: [
            { type: 'link', title: 'Warga', to: '/master-data/warga' },
            { type: 'link', title: 'Regu', to: '/master-data/regu' },
            { type: 'link', title: 'Informasi Iuran', to: '/typography' },
        ],
    },
    { type: 'link', title: 'Pembayaran', icon: 'ri-cash-line', to: '/icons' },
    { type: 'link', title: 'Laporan', icon: 'ri-table-line', to: '/tables' },
    { type: 'link', title: 'Aktivitas', icon: 'ri-time-line', to: '/cards' },

// OLD

//   {
//     type: 'group',
//     title: 'Dashboards',
//     icon: 'ri-home-smile-line',
//     badgeContent: '5',
//     badgeClass: 'bg-error',
//     children: [
//       { type: 'link', title: 'Analytics', to: '/dashboard' },
//       { type: 'link', title: 'CRM', href: 'https://demos.themeselection.com/materio-vue', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//       { type: 'link', title: 'ECommerce', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//       { type: 'link', title: 'Academy', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//       { type: 'link', title: 'Logistics', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//     ],
//   },

//   {
//     type: 'group',
//     title: 'Front Pages',
//     icon: 'ri-file-copy-line',
//     badgeContent: 'Pro',
//     badgeClass: 'bg-light-primary text-primary',
//     children: [
//       { type: 'link', title: 'Landing', href: '#', target: '_blank' },
//       { type: 'link', title: 'Pricing', href: '#', target: '_blank' },
//       { type: 'link', title: 'Payment', href: '#', target: '_blank' },
//       { type: 'link', title: 'Checkout', href: '#', target: '_blank' },
//       { type: 'link', title: 'Help Center', href: '#', target: '_blank' },
//     ],
//   },

//   { type: 'section-title', heading: 'Apps & Pages' },

//   { type: 'link', title: 'Email', icon: 'ri-mail-line', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//   { type: 'link', title: 'Chat', icon: 'ri-wechat-line', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//   { type: 'link', title: 'Calendar', icon: 'ri-calendar-line', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//   { type: 'link', title: 'Kanban', icon: 'ri-drag-drop-line', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },

//   { type: 'link', title: 'Account Settings', icon: 'ri-user-settings-line', to: '/account-settings' },
//   { type: 'link', title: 'Login', icon: 'ri-login-box-line', to: '/login' },
//   { type: 'link', title: 'Register', icon: 'ri-user-add-line', to: '/register' },

//   { type: 'section-title', heading: 'User Interface' },
//   { type: 'link', title: 'Typography', icon: 'ri-text', to: '/typography' },
//   { type: 'link', title: 'Icons', icon: 'ri-remixicon-line', to: '/icons' },
//   { type: 'link', title: 'Cards', icon: 'ri-bar-chart-box-line', to: '/cards' },

//   { type: 'section-title', heading: 'Forms & Tables' },
//   { type: 'link', title: 'Form Layouts', icon: 'ri-layout-4-line', to: '/form-layouts' },
//   { type: 'link', title: 'Form Validation', icon: 'ri-checkbox-multiple-line', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//   { type: 'link', title: 'Form Wizard', icon: 'ri-git-commit-line', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//   { type: 'link', title: 'Tables', icon: 'ri-table-alt-line', to: '/tables' },

//   { type: 'section-title', heading: 'Others' },
//   { type: 'link', title: 'Access Control', icon: 'ri-shield-line', href: '#', target: '_blank', badgeContent: 'Pro', badgeClass: 'bg-light-primary text-primary' },
//   { type: 'link', title: 'Documentation', icon: 'ri-article-line', href: 'https://materio-docs', target: '_blank' },
//   { type: 'link', title: 'Raise Support', icon: 'ri-lifebuoy-line', href: '#', target: '_blank' },
]
