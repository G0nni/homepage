import React from "react";

const AboutSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">À propos de l'application</h3>
      <p>
        <strong>Version:</strong> 1.0.0
      </p>
      <p>
        <strong>Description:</strong> Cette application sert de page d'accueil
        pour navigateur, offrant des fonctionnalités avancées pour améliorer
        votre expérience en ligne.
      </p>
      <p>
        <strong>Fonctionnalités:</strong>
      </p>
      <ul className="list-disc pl-5">
        <li>Recherche rapide et efficace</li>
        <li>Organisation des favoris par dossier</li>
        <li>Personnalisation du thème</li>
      </ul>
    </div>
  );
};

export default AboutSection;
