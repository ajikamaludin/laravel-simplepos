import React, { useEffect, useState } from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { HiXCircle } from 'react-icons/hi'

import { dateToString, formatIDR } from '@/utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import SearchInput from '@/Components/SearchInput'
import Button from '@/Components/Button'
import FormInputDate from '@/Components/FormInputDate'
import Pagination from '@/Components/Pagination'
import FormInput from '@/Components/FormInput'
import CustomerSelectionInput from '../Customer/SelectionInput'
import { Spinner } from 'flowbite-react'
import TextArea from '@/Components/TextArea'

export default function Sale(props) {
    const {
        _products: { data: products, links },
        _page,
    } = props

    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

    const { data, setData, post, processing, errors } = useForm({
        date: dateToString(new Date()),
        customer_id: null,
        items: [],
        note: '',
    })

    const addItem = (product) => {
        const isExist = data.items.find((item) => item.id === product.id)
        if (isExist) {
            return
        }
        setData(
            'items',
            data.items.concat({
                ...product,
                qty: 1,
            })
        )
    }

    const removeItem = (id) => {
        setData(
            'items',
            data.items.filter((item) => item.id !== id)
        )
    }

    const setQuantityItem = (id, qty) => {
        setData(
            'items',
            data.items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        qty: qty,
                    }
                }
                return item
            })
        )
    }

    const handleSubmit = () => {
        post(route('sale.store'))
    }

    const params = { q: search }
    useEffect(() => {
        if (preValue) {
            setLoading(true)
            router.get(
                route(route().current()),
                { q: search },
                {
                    replace: true,
                    preserveState: true,
                    onSuccess: () => {
                        setLoading(false)
                    },
                }
            )
        }
    }, [search])

    const total = data.items.reduce(
        (amt, item) => amt + +item.qty * +item.price,
        0
    )

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Penjualan'}
            action={'Transaksi'}
        >
            <Head title="Penjualan" />

            <div className="mx-auto sm:px-6 lg:px-8 w-full">
                <div className="flex flex-row p-6 shadow-sm sm:rounded-lg bg-white w-full space-x-2">
                    <div className="w-full md:w-7/12">
                        <div className="mb-4">
                            <SearchInput
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                        </div>
                        {loading ? (
                            <div className="w-full flex flex-row justify-center mt-28">
                                <Spinner size="xl" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2 text-center h-[320px]">
                                {products.map((item) => (
                                    <div
                                        className="rounded bg-gray-300 hover:bg-gray-200 shadow-lg px-4 py-2 flex flex-col justify-between"
                                        key={item.id}
                                        onClick={() => addItem(item)}
                                    >
                                        <div className="font-bold">
                                            {item.name}
                                        </div>
                                        <div className="rounded-md bg-gray-800 p-0.5 text-white">
                                            Rp. {formatIDR(item.price)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="w-full mt-4 justify-center">
                            <div className="mx-auto w-fit">
                                <Pagination links={links} params={params} />
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <TextArea
                                value={data.note}
                                onChange={(e) =>
                                    setData('note', e.target.value)
                                }
                                rows={4}
                                placeholder="Catatan"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-5/12 flex flex-col">
                        <CustomerSelectionInput
                            placeholder="Pelanggan"
                            itemSelected={data.customer_id}
                            onItemSelected={(id) => setData('customer_id', id)}
                            error={errors.customer_id}
                        />
                        <FormInputDate
                            selected={data.date}
                            onChange={(date) => setData('date', date)}
                            placeholder="Tanggal"
                            error={errors.date}
                        />
                        <div className="my-4 h-[350px] overflow-y-scroll">
                            <div className="flex flex-row justify-between space-x-2 space-y-2 rounded-md shadow items-center p-2">
                                <div className="w-2/3">Nama</div>
                                <div className="w-1/3">Jumlah</div>
                                <div className="">Subtotal</div>
                                <div className="text-transparent">
                                    <div className="h-5 w-5"></div>
                                </div>
                            </div>
                            {data.items.map((item) => (
                                <div
                                    className="flex flex-row justify-between space-x-2 space-y-2 rounded-md shadow items-center p-2"
                                    key={item.id}
                                >
                                    <div className="w-2/3">{item.name}</div>
                                    <div className="w-1/3 text-right">
                                        <FormInput
                                            type="number"
                                            min="1"
                                            value={item.qty}
                                            onChange={(e) =>
                                                setQuantityItem(
                                                    item.id,
                                                    e.target.value
                                                )
                                            }
                                            className="text-right"
                                        />
                                    </div>
                                    <div className="text-right w-1/3">
                                        {formatIDR(item.qty * item.price)}
                                    </div>
                                    <div
                                        className="text-red-500"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <HiXCircle className="h-5 w-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex flex-row justify-between font-bold text-2xl">
                            <div>Total:</div>
                            <div>{formatIDR(total)}</div>
                        </div>
                        <Button
                            disable={processing}
                            onClick={(e) => handleSubmit()}
                        >
                            Simpan
                        </Button>
                    </div>
                </div>
                <div className="flex flex-row p-6 shadow-sm sm:rounded-lg bg-white w-full space-x-2 mt-2 invisible">
                    <div className="w-full">
                        <TextArea
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            rows={4}
                            label="Catatan"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
