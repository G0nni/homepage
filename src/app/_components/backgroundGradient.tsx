"use client";
import React, { useEffect, useState } from "react";

export function BackgroundGradient() {
  const [topColor, setTopColor] = useState("#ffffff"); // Couleur par défaut pour le haut
  const [bottomColor, setBottomColor] = useState("#000000"); // Couleur par défaut pour le bas

  useEffect(() => {
    const initialStorageCheck = () => {
      const autoThemeEnabled = localStorage.getItem("autoThemeEnabled");

      if (autoThemeEnabled === "true") {
        const storedTopColor = localStorage.getItem("lightVibrant");
        const storedBottomColor = localStorage.getItem("darkVibrant");

        if (storedTopColor && storedBottomColor) {
          const lightVibrant = JSON.parse(storedTopColor);
          const darkVibrant = JSON.parse(storedBottomColor);

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
      } else {
        const storedTopColor = localStorage.getItem("topColor");
        const storedBottomColor = localStorage.getItem("bottomColor");

        if (storedTopColor && storedBottomColor) {
          const topColorHex = JSON.parse(storedTopColor).hex;
          const bottomColorHex = JSON.parse(storedBottomColor).hex;

          document.body.style.background = `linear-gradient(${topColorHex}, ${bottomColorHex})`;

          // Mettre à jour l'état local si nécessaire
          setTopColor(topColorHex);
          setBottomColor(bottomColorHex);
        }
      }
    };

    initialStorageCheck();

    const handleStorageChange = () => {
      const autoThemeEnabled = localStorage.getItem("autoThemeEnabled");

      if (autoThemeEnabled === "true") {
        const storedTopColor = localStorage.getItem("lightVibrant");
        const storedBottomColor = localStorage.getItem("darkVibrant");

        if (storedTopColor && storedBottomColor) {
          const lightVibrant = JSON.parse(storedTopColor);
          const darkVibrant = JSON.parse(storedBottomColor);

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
      } else {
        const newTopColor =
          JSON.parse(localStorage.getItem("topColor") ?? "null")?.hex ??
          topColor;
        const newBottomColor =
          JSON.parse(localStorage.getItem("bottomColor") ?? "null")?.hex ??
          bottomColor;

        document.body.style.background = `linear-gradient(${newTopColor}, ${newBottomColor})`;

        // Mettre à jour l'état local si nécessaire
        setTopColor(newTopColor);
        setBottomColor(newBottomColor);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Assurez-vous de spécifier les bonnes dépendances si nécessaire

  return <></>;
}
