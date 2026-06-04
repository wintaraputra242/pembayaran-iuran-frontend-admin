export default [
    { type: 'link', title: 'Dashboard', icon: 'ri-home-smile-line', to: '/dashboard' },
    {
        type: 'group',
        title: 'Master Data',
        icon: 'ri-box-3-line',
        open: true,
        children: [
            { type: 'link', title: 'Pengguna', to: '/master-data/users' },
            { type: 'link', title: 'Warga', to: '/master-data/warga' },
            { type: 'link', title: 'Regu', to: '/master-data/regu' },
            { type: 'link', title: 'Informasi Iuran', to: '/master-data/informasi-iuran' },
        ],
    },
    { type: 'link', title: 'Atur QRIS', icon: 'ri-qr-code-line', to: '/qris-setting' },
    { type: 'link', title: 'Pembayaran', icon: 'ri-cash-line', to: '/pembayaran' },
    { type: 'link', title: 'Laporan', icon: 'ri-table-line', to: '/laporan' },
    { type: 'link', title: 'Aktivitas', icon: 'ri-time-line', to: '/activity' },
]
