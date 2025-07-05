import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import './index.css';

window.VERSION = 'rev' + __COMMIT_HASH__;

import Root from './Layouts/Root';

import Map, { loader as mapLoader } from './Pages/Map';
import Sources from './Pages/Sources';
import Lines, { loader as linesLoader } from './Pages/Lines';
import Stops, { loader as stopsLoader } from './Pages/Stops';
import Favorites, { loader as favoritesLoader } from './Pages/Favorites';

const router = createBrowserRouter(
  [
    {
      element: <Root />,
      children: [
        {
          index: true,
          path: '/',
          element: <Navigate to="/map" replace />,
        },
        {
          path: 'map',
          loader: mapLoader,
          element: <Map />,
        },
        {
          path: 'sources',
          element: <Sources />,
        },
        {
          path: 'lines',
          loader: linesLoader,
          element: <Lines />,
        },
        {
          path: 'stops/:lineRef', 
          loader: stopsLoader,
          element: <Stops />,
        },
        {
          path: 'favorites',
          loader: favoritesLoader,
          element: <Favorites />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ],
  {
    future: {
      v7_normalizeFormMethod: true,
    },
  },
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
