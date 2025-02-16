"use client"
import React from "react";

export default function TextField({ type, placeholder, value, onChange, className }: {
    type: string,
    placeholder: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string
}) {

    return (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={className} />
    )
}