import React from "react";

const AboutSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">À propos de l&apos;application</h3>
      <p>
        <strong>Version:</strong> 1.0.0
      </p>
      <p>
        <strong>Description:</strong> Cette application sert de page
        d&apos;accueil pour navigateur, offrant des fonctionnalités avancées
        pour améliorer votre expérience en ligne.
      </p>
      <p>
        <strong>Fonctionnalités:</strong>
      </p>
      <ul className="list-disc pl-5">
        <li>Recherche rapide et efficace</li>
        <li>Permet de choisir son moteur de recherche</li>
        <li>Organisation des favoris par dossier</li>
        <li>Personnalisation du thème</li>
        <li>Synchronisation des paramètres entre différents appareils</li>
        <li>
          Permet d&apos;afficher un message personnalisé pour vous ou pour tous
        </li>
      </ul>
      <h3 className="mt-8 text-lg font-semibold">
        Ce qui se trame pour la suite
      </h3>
      <p>Hey! Voici quelques idées sur lesquelles je travaille :</p>
      <ul className="list-disc pl-5">
        <li>
          Peut-être qu&apos;on va rajouter des chats ? Tout le monde aime les
          chats.
        </li>
        <li>
          Des thèmes encore plus personnalisables, parce que pourquoi pas ?
        </li>
        <li>
          Et si on faisait en sorte que l&apos;appli vous serve un café ? (Je
          travaille encore sur la partie technique...)
        </li>
      </ul>
      <p>
        Je taffe sur l&apos;app quand je peux/veux donc pas de pression. Restez
        à l&apos;écoute !
      </p>
    </div>
  );
};

export default AboutSection;
