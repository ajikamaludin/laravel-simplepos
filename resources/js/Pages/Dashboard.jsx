import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
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
import { BiSortAlt2 } from 'react-icons/bi'
import moment from 'moment'
import FormInputDateRanger from '@/Components/FormInputDateRange'
import { usePrevious } from 'react-use'
import SearchInput from '@/Components/SearchInput'
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
        total_item_today,
        total_item_price_today,
        sale_days,
        _startDate,
        _endDate,
        _order,
        _p_q,
        _c_q,
        list_favorite_product,
        list_customer,
        favorite_categories,
        month,
        total_sale_month,
        targets,
        target,
    } = props

    const [dates, setDates] = useState({
        startDate: _startDate,
        endDate: _endDate,
    })
    const [order, setOrder] = useState(_order)
    const [p_q, setPq] = useState(_p_q)
    const [c_q, setCq] = useState(_c_q)

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

    const preValue = usePrevious({
        dates,
        order,
        c_q,
        p_q,
    })

    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                {
                    start_date: dates.startDate,
                    end_date: dates.endDate,
                    order,
                    c_q,
                    p_q,
                },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [dates, order, c_q, p_q])

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
                    <div className="px-2 w-full grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">
                                Target Penjualan <br />
                                Bulan {month}
                            </div>
                            <div className="text-3xl font-bold">
                                Rp. {formatIDR(target)}
                            </div>
                        </div>
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
                                Total Penjualan <br />
                                Hari Ini
                            </div>
                            <div className="text-3xl font-bold">
                                Rp. {formatIDR(total_item_price_today)}
                            </div>
                        </div>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">
                                Jumlah Produk Terjual <br />
                                Hari Ini
                            </div>
                            <div className="text-3xl font-bold">
                                {total_item_today}
                            </div>
                        </div>
                    </div>
                    {/* Chart : jumlah transaksi 7 hari terkahir */}
                    <div className="w-full flex flex-col lg:flex-row mt-4 gap-2">
                        <div className="w-full overflow-auto bg-white p-4">
                            <div className="flex flex-row justify-between">
                                <div className="text-xl pb-4">
                                    Penjualan 7 Hari Terakhir
                                </div>
                                <div className="flex flex-row gap-1 items-center">
                                    <div className="px-1 py-1 bg-gray-200 rounded mb-1">
                                        <BiSortAlt2 className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <FormInputDateRanger
                                            selected={dates}
                                            onChange={(dates) =>
                                                setDates(dates)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Bar
                                options={options}
                                data={data}
                                className="max-h-96"
                            />
                        </div>
                        <div className="w-full overflow-auto bg-white p-4 lg:max-w-sm">
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
                        <div className="flex flex-row justify-between mb-2">
                            <div className="text-xl pb-4">Produk Terlaris</div>
                            <div className="flex flex-row gap-1">
                                <div
                                    className="px-1 py-1 bg-gray-200 rounded mb-1"
                                    onClick={() =>
                                        setOrder(
                                            order === 'asc' ? 'desc' : 'asc'
                                        )
                                    }
                                >
                                    <BiSortAlt2 className="h-8 w-8" />
                                </div>
                                <SearchInput
                                    value={p_q}
                                    onChange={(e) => setPq(e.target.value)}
                                />
                            </div>
                        </div>
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
                        <div className="flex flex-row justify-between mb-2">
                            <div className="text-xl pb-4">
                                Pelanggan Hari Ini
                            </div>
                            <div className="flex flex-row gap-1">
                                <div
                                    className="px-1 py-1 bg-gray-200 rounded mb-1"
                                    onClick={() =>
                                        setOrder(
                                            order === 'asc' ? 'desc' : 'asc'
                                        )
                                    }
                                >
                                    <BiSortAlt2 className="h-8 w-8" />
                                </div>
                                <SearchInput
                                    value={c_q}
                                    onChange={(e) => setCq(e.target.value)}
                                />
                            </div>
                        </div>
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
                                                Rp. {formatIDR(customer.stotal)}
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
