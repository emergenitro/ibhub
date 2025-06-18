'use client';

import { useState, useRef } from 'react';
import CheckButton from "@/components/CheckButton";
import EssayInputBox from "@/components/EssayInputBox";
import SearchableDropdown from '@/components/SearchableDropdown';
import FileDropzone from '@/components/FileDropzone';

export default function GradersPage() {
  const [essay, setEssay] = useState("");
  const [file, setFile] = useState(null);
  const [essayType, setEssayType] = useState(null);

  const cardRef = useRef(null);
  const [cardStyle, setCardStyle] = useState({});
  

  // Constants for the 3D effect
  const ROTATION_STRENGTH = 3;
  const PERSPECTIVE = 1000;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    // Get the position and dimensions of the card
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();

    // Calculate mouse position relative to the card's center
    const mouseX = e.clientX - left - width / 2;
    const mouseY = e.clientY - top - height / 2;

    // Calculate rotation angles
    // The rotation on the Y-axis is driven by the mouse's X position
    // The rotation on the X-axis is driven by the mouse's Y position (inverted)
    const rotateY = (mouseX / (width / 2)) * ROTATION_STRENGTH;
    const rotateX = -(mouseY / (height / 2)) * ROTATION_STRENGTH;

    // Apply the transform style
    setCardStyle({
      transform: `perspective(${PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
    });
  };

  const handleMouseLeave = () => {
    // Reset the style to default when the mouse leaves
    setCardStyle({
      transform: `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    });
  };

  const handleSubmit = async () => {
    const endpoint = 'api.domain.com/tokcheck';

    try {
      let response;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        if (essayType) {
          formData.append('essayType', essayType.value);
        }

        response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });
      } else if (essay.trim() !== "") {
        // If essay is provided, send it as JSON
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: essay, 
            essayType: essayType ? essayType.value : null,
          }),
        });
      } else {
        console.log("Nothing to submit");
        return;
      }

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Submission successful:', data);

      // ACTIVATE MODAL OR DISPLAY RESULTS HERE


    } catch (error) {
      console.error('Error during submission:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const isEssayBoxDisabled = !!file;
  const isDropzoneDisabled = essay.trim() !== "";
  
  const isCheckButtonDisabled = !file && essay.trim() === "";

  return (
    <div className="min-h-screen w-full bg-black flex justify-center items-center text-white px-4 py-12">
      <div 
        ref={cardRef} 
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave} 
        style={cardStyle}
        className="w-full max-w-5xl bg-[#0a0a0a] rounded-2xl 
                      shadow-[0_0_400px_rgba(15,15,255,0.25)] p-8 
                      border border-blue-700/30
                      transition-transform duration-300 ease-out
                      transform-gpu backface-hidden">
        <h1 className="text-4xl font-bold text-center mb-6 text-white drop-shadow-[0_0_6px_#0f0fff]">
          AI Essay Grader
        </h1>
        <p className="text-center text-lg mb-10 text-gray-300">
          Paste your IBDP essay below or upload a file to let the AI do the grading magic ✨
        </p>
        <SearchableDropdown
          label="Select Essay Type"
          options={[
            { label: 'Extended Essay', value: 'extended_essay' },
            { label: 'TOK Essay', value: 'tok_essay' },
            { label: 'Personal Statement', value: 'personal_statement' },
            { label: 'English', value: 'eng' },
            { label: 'Math', value: 'math' },
            { label: 'Physics', value: 'phy' },
            { label: 'Computer Science', value: 'cs' },
            { label: 'Economics', value: 'econs' },
          ]}
          onSelect={setEssayType}
          initiallyOpen={true}
        />

        <FileDropzone
          onFileSelect={setFile}
          disabled={isDropzoneDisabled}
        />

        <div className="flex items-center justify-between my-4">
          <span className="h-px w-1/4 bg-blue-700/30"></span>
          <span className="px-4 text-gray-500 font-semibold">OR</span>
          <span className="h-px w-1/4 bg-blue-700/30"></span>
        </div>

        <EssayInputBox
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          disabled={isEssayBoxDisabled}
        />

        <div className="flex justify-center mt-8">
          <CheckButton 
            onClick={handleSubmit} 
            text="Check Essay"
            disabled={isCheckButtonDisabled} 
          />
        </div>
      </div>
    </div>
  );
}
