import { usePathname } from "next/navigation";
import { useEffect } from "react";

function usePageTitle(title: string) {
    const path = usePathname();
    useEffect(() => {
        document.title = title;
    }, [path, title]);
}

export default usePageTitle