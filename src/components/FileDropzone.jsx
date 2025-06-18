'use client';

import React, { useState, useRef, useCallback } from 'react';

// Some icons that fit the theme
const UploadIcon = () => (
  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5l2 3h9a2 2 0 012 2v7a2 2 0 01-2 2H9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
);

const FileIcon = () => (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
);

const CrossIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

export default function FileDropzone({ onFileSelect, disabled = false }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef(null);

    const acceptedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const acceptedExtensions = ['.pdf', '.txt', '.doc', '.docx'];

    const handleFile = (file) => {
        if (file && acceptedTypes.includes(file.type)) {
            setSelectedFile(file);
            onFileSelect(file);
        } else {
            alert(`Unsupported file type. Please upload a file with one of the following extensions: ${acceptedExtensions.join(', ')}`);
        }
    }

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        } /*else if (e.type === 'drop') {
            setIsDragActive(false);
            const file = e.dataTransfer.files[0];
            handleFile(file);
        }*/
    }, [disabled]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [disabled]);

    const handleChange = (e) => {
        e.preventDefault();
        if (disabled) return;
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        if (disabled) return;
        inputRef.current.click();
    };

    const handleClearFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        onFileSelect(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const dropzoneClasses = `
        w-full max-w-4xl mx-auto my-6 p-8 text-center rounded-lg 
        border-2 border-dashed transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed bg-black' : 'cursor-pointer'}
        ${isDragActive 
            ? 'border-[#3a7eff] bg-[#3a7eff]/10 shadow-[0_0_24px_#3a7eff]' 
            : 'border-[#0f0fff]/50 hover:border-[#3a7eff] hover:bg-black/30'
        }
    `;

    return (
        <div
            className={dropzoneClasses}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept={acceptedExtensions}
                disabled={disabled}
            />

            {!selectedFile ? (
                // View when no file is selected
                <div className="flex flex-col items-center justify-center">
                    <UploadIcon />
                    <p className="text-lg font-semibold text-white">
                        <span className="text-[#3a7eff]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-400 mt-1">PDF, TXT or DOC/DOCX</p>
                    {isDragActive && (
                        <p className="mt-4 text-xl font-bold text-[#3a7eff]">
                            Drop the file here...
                        </p>
                    )}
                </div>
            ) : (
                // View when a file is selected
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <FileIcon />
                        <div className="text-left">
                            <p className="font-semibold text-white">{selectedFile.name}</p>
                            <p className="text-sm text-gray-400">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClearFile}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-white transition-colors duration-200"
                        aria-label="Remove file"
                    >
                        <CrossIcon />
                    </button>
                </div>
            )}
        </div>
    );
}