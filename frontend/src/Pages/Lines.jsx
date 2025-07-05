import React, { useState, useEffect, Fragment } from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import * as API from '../lib/CTS-API';

export function loader() {
  return Promise.all([API.getLinesDelivery()]).then(([linesDelivery]) => ({
    linesDelivery,
  }));
}

export default function Lines() {
  const { linesDelivery } = useLoaderData();

  useEffect(() => {
    document.title = 'CTScam - Lignes';
  }, []);

  // Vérifier que linesDelivery est défini et qu'AnnotatedLineRef est un tableau
  if (!linesDelivery || !Array.isArray(linesDelivery.AnnotatedLineRef)) {
    console.error('Erreur : linesDelivery ou AnnotatedLineRef non défini');
    return <div>Chargement...</div>;
  }

  const annotatedLines = linesDelivery.AnnotatedLineRef;

  // État local pour la valeur de la recherche
  const [searchValue, setSearchValue] = useState('');

  // Fonction de filtre pour les lignes en fonction de la recherche
  const filteredLines = annotatedLines.filter(
    (line) =>
      line.LineRef.toLowerCase().includes(searchValue.toLowerCase()) ||
      line.LineName.toLowerCase().includes(searchValue.toLowerCase()) ||
      line.Extension.RouteType.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // Fonction pour afficher les détails d'une ligne sélectionnée
  const showLineDetails = (line) => {
    console.log('Détails de la ligne :', line);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <input
        type="text"
        placeholder="Rechercher une ligne"
        className="w-1/2 px-4 py-2 text-xl bg-transparent border-2 border-white rounded-full focus:outline-none focus:border-blue-500"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="flex flex-col w-1/2 mt-4 overflow-y-auto max-h-96">
        <div className="flex flex-col gap-y-2">
          {filteredLines.map((annotatedLine, index) => (
            <Fragment key={index}>
              <NavLink
                to={{
                  pathname: `/stops/${annotatedLine.LineRef}`,
                  state: { lineRef: annotatedLine.LineRef },
                }}
                className="flex-1 p-2 space-y-1 rounded-lg cursor-pointer hover:shadow-lg bg-neutral-950 hover:bg-neutral-900"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `#${annotatedLine.Extension.RouteColor}` }}
                  ></div>
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-xl font-bold">
                      {annotatedLine.Extension.RouteType.toUpperCase()} {annotatedLine.LineRef}
                    </span>
                    <span className="text-sm">{annotatedLine.LineName}</span>
                  </div>
                </div>
              </NavLink>

              <div className="flex justify-end">
                <button
                      className="px-4 py-2 font-bold rounded-lg bg-neutral-950 hover:bg-neutral-900 text-yellow-500"
                      onClick={() => 
                        {
                          console.log('Ajouté aux favoris :', annotatedLine);
                          // Récupérer les favoris du local storage
                          const favorites = JSON.parse(localStorage.getItem('favorites'));
                          console.log('favorites', favorites);
                          // Si pas de favoris, initialiser à un tableau vide
                          if (!favorites) {
                            localStorage.setItem('favorites', JSON.stringify([]));
                          }
                          if (favorites.find((favorite) => favorite.LineRef === annotatedLine.LineRef)) {
                            console.log('Déjà dans les favoris');
                          } else {
                            favorites.push(annotatedLine);
                            localStorage.setItem('favorites', JSON.stringify(favorites));

                          }
                        }
                      }
                    >
                      Ajouter aux favoris 
                </button>
              </div>
              {index !== filteredLines.length - 1 && <hr className="border-white" />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
