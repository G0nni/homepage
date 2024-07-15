"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import defaultImage from "~/images/default.webp";

export function ImageContainer() {
  const [image, setImage] = useState<string | undefined>();

  // Utilisation de useEffect pour vérifier localStorage et initialiser l'image
  useEffect(() => {
    // Vérifier d'abord localStorage pour une image
    const storedImage = localStorage.getItem("themeImage");
    if (storedImage) {
      // Si une image est trouvée dans localStorage, l'utiliser
      setImage(storedImage);
    } else {
      // Sinon, utiliser l'image par défaut
      setImage(defaultImage.src);
    }

    const handleStorageChange = () => {
      const newImage = localStorage.getItem("themeImage") || defaultImage.src;
      setImage(newImage);
    };

    // Ajouter un écouteur pour le changement d'événement de stockage
    window.addEventListener("storage", handleStorageChange);

    // Nettoyer l'écouteur lorsque le composant est démonté
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Afficher un élément de chargement ou rien tant que l'image n'est pas déterminée
  if (!image) {
    return (
      <div className="relative hidden h-[600px] w-[350px] overflow-hidden rounded-md shadow-[0px_54px_55px_rgba(0,0,0,0.25),0px_-12px_30px_rgba(0,0,0,0.12),0px_4px_6px_rgba(0,0,0,0.12),0px_12px_13px_rgba(0,0,0,0.17),0px_-3px_5px_rgba(0,0,0,0.09)] md:flex lg:flex"></div>
    );
  }

  return (
    <div className="relative hidden h-[600px] w-[350px] overflow-hidden rounded-md shadow-[0px_54px_55px_rgba(0,0,0,0.25),0px_-12px_30px_rgba(0,0,0,0.12),0px_4px_6px_rgba(0,0,0,0.12),0px_12px_13px_rgba(0,0,0,0.17),0px_-3px_5px_rgba(0,0,0,0.09)] md:flex lg:flex">
      <Image src={image} alt="Theme image" fill className="object-cover" />
    </div>
  );
}
