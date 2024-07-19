"use client";
import React, { useEffect, useState } from "react";

// Interface pour définir la structure des données des couleurs vibrantes
interface ColorDataVibrant {
  rgb: number[];
  population: number;
}

// Type pour définir la structure des données des couleurs de base
type ColorData = {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  hsv: {
    h: number;
    s: number;
    v: number;
    a: number;
  };
};

// Fonction de validation pour les données de couleurs vibrantes
function isValidColorVibrantData(obj: unknown): obj is ColorDataVibrant {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Array.isArray((obj as ColorDataVibrant).rgb) &&
    (obj as ColorDataVibrant).rgb.length === 3 &&
    (obj as ColorDataVibrant).rgb.every(
      (value: unknown) => typeof value === "number",
    ) &&
    typeof (obj as ColorDataVibrant).population === "number"
  );
}

// Fonction de validation pour les données de couleurs de base
function isValidColorData(obj: unknown): obj is ColorData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as ColorData).hex === "string" &&
    typeof (obj as ColorData).rgb === "object" &&
    typeof (obj as ColorData).hsv === "object"
  );
}

// Composant BackgroundGradient
export function BackgroundGradient() {
  const [topColor, setTopColor] = useState<string>("#65bad7");
  const [bottomColor, setBottomColor] = useState<string>("#7a7e46");

  useEffect(() => {
    const initialStorageCheck = () => {
      const autoThemeEnabled = localStorage.getItem("autoThemeEnabled");

      if (autoThemeEnabled === "true") {
        const storedLightVibrant = localStorage.getItem("lightVibrant");
        const storedDarkVibrant = localStorage.getItem("darkVibrant");

        if (storedLightVibrant && storedDarkVibrant) {
          const lightVibrant: unknown = JSON.parse(storedLightVibrant);
          const darkVibrant: unknown = JSON.parse(storedDarkVibrant);

          if (
            isValidColorVibrantData(lightVibrant) &&
            isValidColorVibrantData(darkVibrant)
          ) {
            const topColorRgb = lightVibrant.rgb;
            const bottomColorRgb = darkVibrant.rgb;

            const topColorCss = `rgb(${topColorRgb.join(",")})`;
            const bottomColorCss = `rgb(${bottomColorRgb.join(",")})`;
            const gradientCss = `linear-gradient(${topColorCss}, ${bottomColorCss})`;

            document.body.style.background = gradientCss;

            // Mettre à jour l'état local si nécessaire
            setTopColor(topColorCss);
            setBottomColor(bottomColorCss);
          }
        }
      } else {
        const storedTopColor = localStorage.getItem("topColor");
        const storedBottomColor = localStorage.getItem("bottomColor");

        if (storedTopColor && storedBottomColor) {
          const parsedTopColor: unknown = JSON.parse(storedTopColor);
          const parsedBottomColor: unknown = JSON.parse(storedBottomColor);

          if (
            isValidColorData(parsedTopColor) &&
            isValidColorData(parsedBottomColor)
          ) {
            const newTopColor = parsedTopColor.hex ?? topColor;
            const newBottomColor = parsedBottomColor.hex ?? bottomColor;

            document.body.style.background = `linear-gradient(${newTopColor}, ${newBottomColor})`;

            // Mettre à jour l'état local si nécessaire
            setTopColor(newTopColor);
            setBottomColor(newBottomColor);
          }
        } else {
          document.body.style.background = `linear-gradient(${topColor}, ${bottomColor})`;
        }
      }
    };

    initialStorageCheck();

    const handleStorageChange = () => {
      const autoThemeEnabled = localStorage.getItem("autoThemeEnabled");

      if (autoThemeEnabled === "true") {
        const storedLightVibrant = localStorage.getItem("lightVibrant");
        const storedDarkVibrant = localStorage.getItem("darkVibrant");

        if (storedLightVibrant && storedDarkVibrant) {
          const lightVibrant: unknown = JSON.parse(storedLightVibrant);
          const darkVibrant: unknown = JSON.parse(storedDarkVibrant);

          if (
            isValidColorVibrantData(lightVibrant) &&
            isValidColorVibrantData(darkVibrant)
          ) {
            const topColorRgb = lightVibrant.rgb;
            const bottomColorRgb = darkVibrant.rgb;

            const topColorCss = `rgb(${topColorRgb.join(",")})`;
            const bottomColorCss = `rgb(${bottomColorRgb.join(",")})`;
            const gradientCss = `linear-gradient(${topColorCss}, ${bottomColorCss})`;

            document.body.style.background = gradientCss;

            // Mettre à jour l'état local si nécessaire
            setTopColor(topColorCss);
            setBottomColor(bottomColorCss);
          }
        }
      } else {
        const storedTopColor = localStorage.getItem("topColor");
        const storedBottomColor = localStorage.getItem("bottomColor");

        if (storedTopColor && storedBottomColor) {
          const parsedTopColor: unknown = JSON.parse(storedTopColor);
          const parsedBottomColor: unknown = JSON.parse(storedBottomColor);

          if (
            isValidColorData(parsedTopColor) &&
            isValidColorData(parsedBottomColor)
          ) {
            const newTopColor = parsedTopColor.hex ?? topColor;
            const newBottomColor = parsedBottomColor.hex ?? bottomColor;

            document.body.style.background = `linear-gradient(${newTopColor}, ${newBottomColor})`;

            // Mettre à jour l'état local si nécessaire
            setTopColor(newTopColor);
            setBottomColor(newBottomColor);
          }
        } else {
          document.body.style.background = `linear-gradient(${topColor}, ${bottomColor})`;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Assurez-vous de spécifier les bonnes dépendances si nécessaire

  return <></>;
}
