import Link from 'next/link'
import React from 'react'

const Announcement = () => {
    return (
        <div>
            <div className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-gray-900">
                <p className="text-center font-normal">
                    <i>Build your first model in minutes with</i>&nbsp;
                    <Link href="/register" className="inline-block underline">AutoML Studio </Link>
                </p>
            </div>
        </div>
    )
}

export default Announcement