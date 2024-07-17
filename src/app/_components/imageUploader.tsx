import React from "react";
import CustomFileInput from "./customFileInput";

interface ImageUploaderProps {
  imagePreviewUrl: string;
  setImagePreviewUrl: React.Dispatch<React.SetStateAction<string>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imagePreviewUrl,
  setImagePreviewUrl,
  handleImageChange,
  handleSaveImage,
}) => {
  return (
    <div className="flex flex-col md:flex-row lg:flex-row">
      <div className="w-1/2">
        <div className="mb-4">
          <label
            htmlFor="themeImage"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Changer l&apos;image
          </label>
          <CustomFileInput
            id="themeImage"
            name="themeImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() =>
              setImagePreviewUrl(localStorage.getItem("themeImage") ?? "")
            }
            className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none"
          >
            Supprimer l&apos;image
          </button>
          <button
            onClick={handleSaveImage}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none"
          >
            Sauvegarder
          </button>
        </div>
      </div>
      {imagePreviewUrl && (
        <div className="ml-4 flex-shrink-0">
          <div
            className="mt-4 overflow-hidden rounded-lg shadow-lg"
            style={{
              width: "175px",
              height: "300px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={imagePreviewUrl}
              alt="Prévisualisation"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
