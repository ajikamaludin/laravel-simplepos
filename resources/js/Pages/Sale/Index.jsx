import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { Head } from '@inertiajs/react'
import { Button, Dropdown } from 'flowbite-react'
import { HiEye, HiTrash } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import SearchInput from '@/Components/SearchInput'
import { formatDate, formatIDR, hasPermission } from '@/utils'
import CustomerSelectionInput from '../Customer/SelectionInput'
import FormInputDateRanger from '@/Components/FormInputDateRange'

export default function Sale(props) {
    const {
        query: { links, data },
        _startDate,
        _endDate,
        auth,
    } = props

    const [customer, setCustomer] = useState(null)
    const [date, setDate] = useState({
        startDate: _startDate,
        endDate: _endDate,
    })
    const [search, setSearch] = useState('')
    const preValue = usePrevious(`${search}${customer}${date}`)

    const confirmModal = useModalState()

    const toggleFormModal = () => {
        router.get(route('sale.create'))
    }

    const viewDetail = (sale) => {
        router.get(route('sale.show', sale))
    }

    const handleDeleteClick = (sale) => {
        confirmModal.setData(sale)
        confirmModal.toggle()
    }

    const onDelete = () => {
        if (confirmModal.data !== null) {
            router.delete(route('sale.destroy', confirmModal.data.id))
        }
    }

    const params = { q: search, customer_id: customer, ...date }
    useEffect(() => {
        if (preValue) {
            let filterDate = {}
            if (date.endDate !== null) {
                filterDate = date
            }
            router.get(
                route(route().current()),
                { q: search, customer_id: customer, ...filterDate },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search, customer, date])

    const canCreate = hasPermission(auth, 'create-sale')
    const canUpdate = hasPermission(auth, 'update-sale')
    const canDelete = hasPermission(auth, 'delete-sale')

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Penjualan'}
            action={''}
        >
            <Head title="Penjualan" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            {canCreate && (
                                <Button
                                    size="sm"
                                    onClick={() => toggleFormModal()}
                                >
                                    Tambah
                                </Button>
                            )}
                            <div className="flex flex-col items-center space-y-1">
                                <SearchInput
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                                <div className="flex flex-row space-x-1">
                                    <CustomerSelectionInput
                                        placeholder="Pelanggan"
                                        itemSelected={customer}
                                        onItemSelected={(id) => setCustomer(id)}
                                    />
                                    <FormInputDateRanger
                                        selected={date}
                                        onChange={(date) => {
                                            setDate(date)
                                        }}
                                        placeholder="Tanggal"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Kode
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Tanggal
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Pelanggan
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Total
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((sale) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={sale.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {sale.code}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatDate(sale.date)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {sale.customer?.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {formatIDR(sale.total)}
                                                </td>
                                                <td className="py-4 px-6 flex justify-end">
                                                    <Dropdown
                                                        label={'Opsi'}
                                                        floatingArrow={true}
                                                        arrowIcon={true}
                                                        dismissOnClick={true}
                                                        size={'sm'}
                                                    >
                                                        {canUpdate && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    viewDetail(
                                                                        sale
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex space-x-1 items-center">
                                                                    <HiEye />
                                                                    <div>
                                                                        Detail
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                        )}
                                                        {canDelete && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        sale
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex space-x-1 items-center">
                                                                    <HiTrash />
                                                                    <div>
                                                                        Hapus
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                        )}
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Pagination links={links} params={params} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalConfirm modalState={confirmModal} onConfirm={onDelete} />
        </AuthenticatedLayout>
    )
}
