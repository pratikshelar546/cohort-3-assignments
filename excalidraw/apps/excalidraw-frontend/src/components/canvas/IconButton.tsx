import { ReactNode } from "react";

export default function IconButton({ active, onClick, icon }: {
    active: boolean,
    onClick: () => void,
    icon: ReactNode
}) {
    return (
        <div className={`border rounded-lg p-4 bg-black hover:bg-gray-700 ${active ? "text-red-400" : "text-white"}`} onClick={onClick}>{icon}
        </div>)

}