import React from 'react';

const Button = ({ children, onClick, className = "", variant = "primary", size = "md", disabled = false, ...props }) => {
    const baseStyles = "rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-white text-primary hover:bg-slate-50",
        outline: "border-2 border-primary text-primary hover:bg-primary/5",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        link: "text-primary underline-offset-4 hover:underline"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
