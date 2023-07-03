import React, { useEffect } from 'react'
import Modal from '@/Components/Modal'
import { useForm } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import { isEmpty } from 'lodash'
import CategorySelectionInput from '../Category/SelectionInput'

export default function FormModal(props) {
    const { modalState } = props

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            price: 0,
            cost: 0,
            stock: 0,
            category_id: null,
            is_active: 0,
        })

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === 'checkbox'
                ? event.target.checked
                    ? 1
                    : 0
                : event.target.value
        )
    }

    const handleReset = () => {
        modalState.setData(null)
        reset()
        clearErrors()
    }

    const handleClose = () => {
        handleReset()
        modalState.toggle()
    }

    const handleSubmit = () => {
        const product = modalState.data
        if (product !== null) {
            put(route('product.update', product), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('product.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const product = modalState.data
        if (isEmpty(product) === false) {
            setData({
                name: product.name,
                price: product.price,
                cost: product.cost,
                stock: product.stock,
                category_id: product.category_id,
                is_active: product.is_active,
            })
            return
        }
    }, [modalState])

    return (
        <Modal isOpen={modalState.isOpen} toggle={handleClose} title={'Produk'}>
            <FormInput
                name="name"
                value={data.name}
                onChange={handleOnChange}
                label="Nama"
                error={errors.name}
            />
            <FormInput
                type="number"
                name="price"
                value={data.price}
                onChange={handleOnChange}
                label="Harga Jual"
                error={errors.price}
            />
            <FormInput
                type="number"
                name="cost"
                value={data.cost}
                onChange={handleOnChange}
                label="Harga Beli"
                error={errors.cost}
            />
            <FormInput
                type="number"
                name="stock"
                value={data.stock}
                onChange={handleOnChange}
                label="Stok"
                error={errors.stock}
            />
            <CategorySelectionInput
                label="Kategori"
                itemSelected={data.category_id}
                onItemSelected={(id) => setData('category_id', id)}
                error={errors.category_id}
            />
            <div className="mt-4">
                <div className="mb-1 text-sm">Status</div>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleOnChange}
                    value={data.is_active}
                    name="is_active"
                >
                    <option value="0">Aktif</option>
                    <option value="1">Tidak Aktif</option>
                </select>
                {errors.is_active && (
                    <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                        {errors.is_active}
                    </p>
                )}
            </div>
            <div className="flex items-center">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
                <Button onClick={handleClose} type="secondary">
                    Batal
                </Button>
            </div>
        </Modal>
    )
}
