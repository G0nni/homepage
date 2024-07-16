import React, { type ChangeEvent } from "react";

interface CustomFileInputProps {
  id: string;
  name: string;
  accept: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function CustomFileInput({ id, name, accept, onChange }: CustomFileInputProps) {
  return (
    <div className="relative w-full">
      <input
        type="file"
        id={id}
        name={name}
        accept={accept}
        onChange={onChange}
        className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
      />
      <label
        htmlFor={id}
        className="flex w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-500 p-2.5 text-center text-sm text-gray-900 hover:bg-gray-100 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      >
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M16 11v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6M5 11h14M12 15v2"
          ></path>
        </svg>
        Choisir un fichier
      </label>
    </div>
  );
}

export default CustomFileInput;
