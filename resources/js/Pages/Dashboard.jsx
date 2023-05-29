import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { formatIDR } from '@/utils'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import moment from 'moment'
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ArcElement,
    Legend
)

export default function Dashboard(props) {
    const {
        total_sale_today,
        total_item_today,
        total_item_price_today,
        total_customer,
        sale_days,
        list_favorite_product,
        list_customer,
        favorite_categories,
        month,
        total_sale_month,
        targets,
    } = props

    const options = {
        responsive: true,
        scales: {
            x: {},
            x2: {
                display: false,
            },
        },
    }

    const data = {
        labels: sale_days.map((item) =>
            moment(item.date).format('DD MMM YYYY')
        ),
        datasets: [
            {
                label: 'Penjualan',
                data: sale_days.map((item) => item.stotal),
                backgroundColor: ['rgba(255, 205, 86, 1)'],
            },
            {
                label: 'Target',
                data: targets,
                backgroundColor: ['rgba(200, 30, 30, 1)'],
                xAxisID: 'x2',
            },
        ],
    }

    const names = favorite_categories.map(
        (c) => `${c.product.category.name} - ${c.qty}`
    )
    const count = favorite_categories.map((c) => c.qty)
    const dataDounat = {
        labels: names,
        datasets: [
            {
                label: '# Jumlah',
                data: count,
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    '#b91c1c',
                    '#c2410c',
                    '#b45309',
                    '#15803d',
                    '#047857',
                    '#0f766e',
                    '#0369a1',
                    '#1d4ed8',
                    '#6d28d9',
                    '#a21caf',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    '#b91c1c',
                    '#c2410c',
                    '#b45309',
                    '#15803d',
                    '#047857',
                    '#0f766e',
                    '#0369a1',
                    '#1d4ed8',
                    '#6d28d9',
                    '#a21caf',
                ],
                borderWidth: 1,
            },
        ],
    }

    const optionsDounat = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
        },
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Dashboard'}
            action={''}
        >
            <Head title="Dashboard" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="px-2 w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">
                                Total Penjualan <br />
                                Bulan {month}
                            </div>
                            <div className="text-3xl font-bold">
                                Rp. {formatIDR(total_sale_month)}
                            </div>
                        </div>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">
                                Total Barang Terjual <br />
                                Hari Ini
                            </div>
                            <div className="text-3xl font-bold">
                                Rp. {formatIDR(total_item_price_today)}
                            </div>
                        </div>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">
                                Jumlah Barang Terjual <br />
                                Hari Ini
                            </div>
                            <div className="text-3xl font-bold">
                                {total_item_today}
                            </div>
                        </div>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">Jumlah Pelanggan</div>
                            <div className="text-3xl font-bold">
                                {total_customer}
                            </div>
                        </div>
                    </div>
                    {/* Chart : jumlah transaksi 7 hari terkahir */}
                    <div className="w-full flex flex-row mt-4 space-x-2">
                        <div className="flex-1 overflow-auto bg-white p-4">
                            <div className="text-xl pb-4">
                                Penjualan 7 Hari Terakhir
                            </div>
                            <Bar
                                options={options}
                                data={data}
                                className="max-h-96"
                            />
                        </div>
                        <div className="overflow-auto bg-white p-4 max-w-sm">
                            <div className="text-xl pb-4">
                                Kategori Produk yang laku Terjual pada Bulan{' '}
                                {month}
                            </div>
                            <Doughnut
                                data={dataDounat}
                                options={optionsDounat}
                            />
                        </div>
                    </div>
                    {/* list produk paling laris dengan jumlah penjualan */}
                    <div className="overflow-auto bg-white p-4 mt-4">
                        <div className="text-xl pb-4">Produk Terlaris</div>
                        <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            Kode
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Produk
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list_favorite_product.map((product) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={product.product_id}
                                        >
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {product.product.code}
                                            </td>
                                            <td className="py-4 px-6">
                                                {product.product.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                {formatIDR(product.qty)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* list customer yang bertransaksi dengan total transaksi */}
                    <div className="overflow-auto bg-white p-4 mt-4">
                        <div className="text-xl pb-4">Pelanggan Hari Ini</div>
                        <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            Pelanggan
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Total Belanja
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list_customer.map((customer) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={customer.customer_id}
                                        >
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {customer.customer !== null
                                                    ? customer.customer.name
                                                    : 'Umum'}
                                            </td>
                                            <td className="py-4 px-6">
                                                {formatIDR(customer.stotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
