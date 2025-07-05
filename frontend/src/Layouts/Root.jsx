import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/fontawesome-free-solid';
import ctscamLogo from '/assets/ctscam.svg';
import Login from '../Components/Login';
import { useAuth } from '../Hooks/useAuth';

import * as API from '../lib/API';

export default function Root() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { user, token } = useAuth();

  const handleAvatarClick = (e) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowUserDropdown(!showUserDropdown);
    }
  };

  const handleLogout = (e) => {
    if (!token) return;

    API.logout().then(() => setShowUserDropdown(false));
  };

  return (
    <>
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)}></Login>}
      <header className="absolute top-0 left-0 right-0 flex justify-center z-999">
        <nav className="px-6 mt-4 text-xl bg-black rounded-full bg-opacity-80">
          <ol className="flex items-center px-5 setTokenenter gap-x-4">
            <li className="mx-4 my-5 duration-200 hover:text-gray-300">
              <Link to="/lines">Lignes</Link>
            </li>
            <li className="mx-4 my-5 duration-200 hover:text-gray-300">
              <Link to="/map">Carte</Link>
            </li>
            <li className="mx-4 my-5 duration-200 hover:text-gray-300">
              <Link to="/sources">Sources</Link>
            </li>
            {user && (
              <li className="mx-4 my-5 duration-200 hover:text-gray-300">
                <Link to="/favorites">Favoris</Link>
              </li>
            )}
            <li
              className="relative cursor-pointer"
              onClick={handleAvatarClick}
              onMouseEnter={() => user && setShowUserDropdown(true)}
              onMouseLeave={() => user && setShowUserDropdown(false)}
            >
              <FontAwesomeIcon className="w-10 h-10" icon={faUserCircle} />
              {showUserDropdown && (
                <ul className="absolute bottom-0 px-3 py-2 text-base translate-y-full bg-black select-none -left-2 rounded-xl whitespace-nowrap">
                  <li onClick={handleLogout}>Se déconnecter</li>
                </ul>
              )}
            </li>
          </ol>
        </nav>
      </header>
      <main className="w-full h-full">
        <Outlet />
      </main>
      <footer className="absolute bottom-0 left-0 right-0 pb-1 text-center z-999">
        <Link to="/">
          <img src={ctscamLogo} alt="ctscam-logo" className="mx-auto mb-2 select-none w-36" draggable="false" />
        </Link>
        <span className="text-lg text-white text-opacity-50">Un projet de Djelal et Edouard ({window.VERSION})</span>
      </footer>
    </>
  );
}
