import React from 'react';

const Button = ({ children, onClick, className = "", variant = "primary" }) => {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-colors duration-200";
    const variants = {
        primary: "bg-primary text-white hover:bg-opacity-90",
        outline: "border-2 border-primary text-primary hover:bg-primary/5"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
