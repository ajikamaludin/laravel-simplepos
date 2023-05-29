import React from 'react'
import logo from '@/Assets/logo.jpeg'
import ApplicationLogo from '@/Components/Defaults/ApplicationLogo'
import { Link } from '@inertiajs/react'

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
            <div>
                <Link href="/">
                    <img src={logo} alt="app logo" className="w-48 h-48" />
                </Link>
            </div>

            <div className="w-full max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    )
}
