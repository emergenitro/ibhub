"use client";

//import { useRef } from "react";

export default function CheckButton({ onClick, disabled = false, text }) {

    //const targetRef = target || useRef(null);

    /*const SubmitUpload = async () => {
        if (disabled) return;

        try {
            const response = await fetch(target, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'submit' }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Upload successful:', data);
        } catch (error) {
            console.error('Error during upload:', error);
        }
    }*/

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-50 h-12 bg-black text-white rounded-lg font-semibold transition-colors duration-300 shadow-[0_0_12px_#0f0fff,0_0_24px_#3a7eff] ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer hover:shadow-[0_0_24px_#0f0fff,0_0_48px_#3a7eff] focus:outline-none focus:ring-2 focus:ring-[#3a7eff] focus:ring-offset-2'
            }`}
        >
            {text}
        </button>
    );
}