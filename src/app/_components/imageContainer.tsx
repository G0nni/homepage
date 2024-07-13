"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import defaultImage from "~/images/default.webp";

export function ImageContainer() {
  const [themeImage, setThemeImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedImage = localStorage.getItem("themeImage");
    if (storedImage) {
      setThemeImage(storedImage);
    }
  }, []);

  // Utilisation de la variable d'état themeImage pour décider quelle image afficher
  const imageToShow = themeImage || defaultImage;

  return (
    <div className="relative hidden h-[600px] w-[350px] overflow-hidden rounded-md shadow-[0px_54px_55px_rgba(0,0,0,0.25),0px_-12px_30px_rgba(0,0,0,0.12),0px_4px_6px_rgba(0,0,0,0.12),0px_12px_13px_rgba(0,0,0,0.17),0px_-3px_5px_rgba(0,0,0,0.09)] md:flex lg:flex">
      <Image
        src={imageToShow}
        alt="Theme image"
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
}
