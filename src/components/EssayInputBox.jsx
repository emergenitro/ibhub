"use client";
import React from "react";

export default function EssayInputBox({ value, onChange, disabled = false }) {

    return (
        <div className="w-full max-w-4xl mx-auto my-6">
            <label className={`block text-white text-lg font-semibold mb-2 transition-colors ${disabled ? 'text-gray-500' : 'text-white'}`}>
                Essay Submission
            </label>
            <textarea
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder="Paste your essay here..."
            className={`w-full h-96 p-4 resize-none rounded-md 
                bg-black text-white placeholder-gray-400
                border-2 border-[#0f0fff] 
                overflow-y-scroll
                shadow-[0_0_12px_#0f0fff,0_0_24px_#3a7eff]
                focus:outline-none focus:ring-2 focus:ring-[#3a7eff]
                transition-opacity duration-300
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        </div>
    );
}