import React from 'react';
import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate, formatIDR } from '@/utils';

export default function Sale(props) {
    const { sale, auth } = props
    
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Penjualan'}
            action={sale.code}
        >
            <Head title="Penjualan" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 space-y-4">
                        <div className='flex flex-col'>
                            <div>Date : <b>{formatDate(sale.date)}</b></div>
                            <div>Customer : <b>{sale.customer?.name}</b></div>
                            <div>Total : <b>{formatIDR(sale.total)}</b></div>
                        </div>
                        <div className='overflow-auto'>
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="py-3 px-6">
                                                Barang
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Harga
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Jumlah
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sale?.items?.map(item => (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                                                <td scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.product.name} ({item.product.code})
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(item.price)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(item.quantity)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(item.quantity * item.price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}