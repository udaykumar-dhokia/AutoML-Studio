import Link from 'next/link'

const Announcement = () => {
    return (
        <div>
            <div className="bg-gray-100 px-4 py-2 text-white bg-white/10">
                <p className="text-center font-normal">
                    <Link href="/register" className="inline-block">We are backed by </Link>
                    <i> No one.</i>&nbsp;
                </p>
            </div>
        </div>
    )
}

export default Announcement