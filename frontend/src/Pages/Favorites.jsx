//page qui affiche et stocke dans un tableau accessible partout les lignes favorites de l'utilisateur
import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import * as API from '../lib/CTS-API';

export function loader({ params, state }) {
    // récupérer les favoris de l'utilisateur dans le local storage
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    console.log('favorites', favorites);

    if (!favorites) {
        return [];
    }
    return favorites;
}

export default function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        document.title = 'CTScam - Favoris';
    }, []);
    
    useEffect(() => {
        // récupérer les favoris de l'utilisateur dans le local storage
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        console.log('favorites', favorites);

        if (!favorites) {
            return [];
        }
        setFavorites(favorites);
        setLoading(false);
    }, []);
    
    if (loading) {
        return <div>Chargement...</div>;
    }
    
    if (error) {
        return <div>Erreur : {error.message}</div>;
    }
    
    if (!Array.isArray(favorites)) {
        console.error('Erreur : favorites non défini');
        return <div>Chargement...</div>;
    }
    
    if (favorites.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-bold">Aucun favori</p>
            <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700" onClick={() => navigate('/map')}>Retour à la map</button>
        </div>
        );
    }
    
    return (
        //afficher les favoris de l'utilisateur sous forme de liste avec un bouton pour supprimer un favori, centré et stylé avec tailwin
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-bold">Favoris</p>
            <div className="flex flex-col w-1/2 mt-4 overflow-y-auto max-h-96">
                <div className="flex flex-col gap-y-2">
                    {favorites.map((favorite, index) => (
                        <Fragment key={index}>
                            <NavLink
                                to={{
                                    pathname: `/stops/${favorite.LineRef}`,
                                    state: { lineRef: favorite.LineRef },
                                }}
                                className="flex-1 p-2 space-y-1 rounded-lg cursor-pointer hover:shadow-lg bg-neutral-950 hover:bg-neutral-900 inline"
                            >                        
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-start justify-center">
                                        <span className="text-xl font-bold">
                                            {favorite.Extension.RouteType.toUpperCase()} {favorite.LineRef}
                                        </span>
                                        <span className="text-sm">{favorite.LineName}</span>
                                    </div>
                                </div>
                            </NavLink>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 font-bold rounded-lg bg-neutral-950 hover:bg-neutral-900 text-red-500"
                                onClick={() => 
                                    {
                                        console.log('Supprimé des favoris :', favorite);
                                        // Récupérer les favoris du local storage
                                        const favorites = JSON.parse(localStorage.getItem('favorites'));
                                        console.log('favorites', favorites);
                                        // Si pas de favoris, initialiser à un tableau vide
                                        if (!favorites) {
                                            localStorage.setItem('favorites', JSON.stringify([]));
                                        }
                                        favorites.splice(favorite, 1);
                                        localStorage.setItem('favorites', JSON.stringify(favorites));

                                        window.location.reload();
                                    }
                                }
                            >
                                Supprimer des favoris 
                            </button>
                            </div>
                        {index !== favorites.length - 1 && <hr className="border-white" />}
                    </Fragment>
                ))}
                </div>
            </div>
            <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700" onClick={() => navigate('/map')}>Retour à la map</button>
        </div>
    );
}