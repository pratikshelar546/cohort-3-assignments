"use client";

import { ReactNode } from "react";
interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
}

const buttonVariant = {
  primary: "bg-white text-blue-700 hover:bg-blue-500",
  secondary: "bg-blue-600 text-white hover:bg-blue-50",
  outline: "bg-transparent border border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white",
};

const sizeVariant = {
  lg: "text-xl font-semibold px-6 py-3",
  md: "text-md font-medium px-4 py-2",
  sm: "text-sm font-normal px-3 py-1",
};

export const Button = ({
  children,
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={`rounded-lg flex items-center justify-center transition duration-300 ${buttonVariant[variant]} ${sizeVariant[size]} ${{ "opacity-50 cursor-not-allowed": disabled }} ${className}`}

      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
