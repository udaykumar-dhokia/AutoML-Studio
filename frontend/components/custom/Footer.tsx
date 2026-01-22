import Image from "next/image"
import logoDark from "@/public/logo/logo-dark/icons8-workflow-100.png";

const Footer = () => {
    return (
        <div>
            <footer className="text-gray-600 body-font border-t border-dashed border-primary/20">
                <div className="container px-5 py-6 mx-auto flex items-center justify-between sm:flex-row flex-col">
                    <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
                        <Image src={logoDark} alt="Logo" width={28} height={28} />
                        <span className="ml-3 text-xl">AutoML Studio</span>
                    </a>
                    <p className="text-sm text-white/50 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2025 AutoML Studio —
                        <a href="https://github.com/udaykumar-dhokia" className="text-white ml-1" rel="noopener noreferrer" target="_blank">@udaykumar-dhokia</a>
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Footer