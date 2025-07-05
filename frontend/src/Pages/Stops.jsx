import React, { useEffect, Fragment } from 'react';
import { useLoaderData, useParams, useNavigate } from 'react-router-dom';
import * as API from '../lib/CTS-API';

export function loader({ params, state }) {
  const lineRef = params.lineRef;
  const includeLinesDestinations = true;

  return Promise.all([API.getLinesDelivery(), API.getStopPoints(lineRef, includeLinesDestinations)]).then(
    ([linesDelivery, stopsDelivery]) => {
      const filteredStopsDelivery = stopsDelivery.AnnotatedStopPointRef.filter((stop) => {
        return stop.Lines.some((line) => line.LineRef === lineRef);
      });

      // Si il y a des arrêts qui ont le même StopName, on en garde qu'un seul
      const filteredStopsDelivery2 = filteredStopsDelivery.reduce((acc, current) => {
        const existingStop = acc.find((item) => item.StopName === current.StopName);
        if (!existingStop) {
          return [...acc, current];
        }
        return acc;
      }, []);

      return {
        linesDelivery, 
        stopsDelivery: {
          AnnotatedStopPointRef: filteredStopsDelivery2,
        },
      };
    }
  );
}


export default function Stops() {
  const { linesDelivery, stopsDelivery } = useLoaderData();
  const lineRef = useParams().lineRef;
  const navigate = useNavigate(); 

  useEffect(() => {
    document.title = 'CTScam - Arrêts';
  }, []);

  if (!stopsDelivery || !Array.isArray(stopsDelivery.AnnotatedStopPointRef)) {
    console.error('Erreur : stopsDelivery ou AnnotatedStopPointRef non défini');
    return <div>Chargement...</div>;
  }

  const annotatedStops = stopsDelivery.AnnotatedStopPointRef;
  const currentLineIndex = linesDelivery.AnnotatedLineRef.findIndex((line) => line.LineRef === lineRef);

  // Fonction pour gérer le changement de ligne (ligne précédente ou suivante par rapport à la ligne actuelle si c'est -1 ou 1)
  const handleLineChange = (lineChange) => {
    console.log('currentLineIndex', currentLineIndex);
    const newLineIndex = currentLineIndex + lineChange;
    console.log('newLineIndex', newLineIndex);
    let newLineRef = '';
    
    if (newLineIndex < 0) {
      newLineRef = linesDelivery.AnnotatedLineRef[linesDelivery.AnnotatedLineRef.length - 1].LineRef;
    } else if (newLineIndex >= linesDelivery.AnnotatedLineRef.length) {
      newLineRef = linesDelivery.AnnotatedLineRef[0].LineRef;
    } else
      newLineRef = linesDelivery.AnnotatedLineRef[newLineIndex].LineRef;
    
    navigate(`/stops/${newLineRef}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-4 text-2xl font-bold">Arrêts de la ligne {lineRef}</h1>

      {/* Liens vers les lignes précédentes et suivantes */}
      <div className="flex justify-between w-1/2 mb-4">
        <button
          className="px-4 py-2 font-bold text-white rounded-lg bg-neutral-950 hover:bg-neutral-900"
          onClick={() => handleLineChange(-1)}
        >
          &lt; Ligne précédente
        </button>
        <button
          className="px-4 py-2 font-bold text-white rounded-lg bg-neutral-950 hover:bg-neutral-900"
          onClick={() => handleLineChange(1)}
        >
          Ligne suivante &gt;
        </button>
      </div>

      <div className="flex flex-col w-1/2 mt-4 overflow-y-auto max-h-96">
        <div className="flex flex-col gap-y-2">
          {annotatedStops.map((annotatedStop, index) => (
            <Fragment key={index}>
              <div className="flex-1 p-2 space-y-1 rounded-lg bg-neutral-950 ">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#000000' }}></div>
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-xl font-bold">{annotatedStop.StopName}</span>
                  </div>
                </div>
              </div>
              {index !== annotatedStops.length - 1 && <hr className="border-white" />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
