import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatIDR } from '@/utils';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

export default function Dashboard(props) {
    const { 
        total_sale_today, total_item_today, total_product, total_customer, 
        sale_days,
        list_favorite_product,
        list_customer
    } = props

    const options = {
        responsive: true,
    };

    const data = {
        labels: sale_days.map((item) => item.date),
        datasets: [
            {
                label: 'Penjualan',
                data: sale_days.map((item) => item.stotal),
                // backgroundColor: 'rgb(87, 13, 248, 0.5)', //rgb(87, 13, 248, 0.5) //rgba(255, 99, 132, 0.5)
                backgroundColor: [
                    'rgba(201, 203, 207, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
            },
        ],
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
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className='px-2 w-full grid grid-cols-2 md:grid-cols-4 gap-2'>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">Total Penjualan <br/>Hari Ini</div>
                            <div className='text-3xl font-bold'>{total_sale_today}</div>
                        </div>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">Total Barang Terjual <br/>Hari Ini</div>
                            <div className='text-3xl font-bold'>{total_item_today}</div>
                        </div>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">Jumlah Barang</div>
                            <div className='text-3xl font-bold'>{total_product}</div>
                        </div>
                        <div className="p-4 overflow-hidden shadow sm:rounded-lg bg-white">
                            <div className="text-xl">Jumlah Pelanggan</div>
                            <div className='text-3xl font-bold'>{total_customer}</div>
                        </div>
                    </div>
                    {/* Chart : jumlah transaksi 7 hari terkahir */}
                    <div className="overflow-auto bg-white p-4 mt-4">
                        <div className='text-xl pb-4'>
                            Penjualan 7 Hari Terakhir
                        </div>
                        <Bar options={options} data={data} className='max-h-96' />
                    </div>
                    {/* list produk paling laris dengan jumlah penjualan */}
                    <div className='overflow-auto bg-white p-4 mt-4'>
                        <div className='text-xl pb-4'>
                            Barang Terlaris
                        </div>
                        <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            Kode
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Barang
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list_favorite_product.map(product => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={product.product_id}>
                                            <td scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                    <div className='overflow-auto bg-white p-4 mt-4'>
                        <div className='text-xl pb-4'>
                            Pelanggan Hari Ini
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
                                    {list_customer.map(customer => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={customer.customer_id}>
                                            <td scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {customer.customer !== null ? customer.customer.name : 'Umum'}
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
    );
}
