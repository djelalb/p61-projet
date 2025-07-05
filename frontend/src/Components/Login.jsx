import { useState } from 'react';

import * as API from '../lib/API';

export default function Login({ onClose }) {
  const [closingTarget, setClosingTarget] = useState(null);

  const handleClose = (e) => {
    if (e.currentTarget === closingTarget) {
      onClose();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    [...e.target.elements].forEach((el) => el.setAttribute('disabled', 'disabled'));

    API.login(e.target.username.value, e.target.password.value)
      .then(() => onClose())
      .catch(() => {
        [...e.target.elements].forEach((el) => el.removeAttribute('disabled'));
      });
  };

  return (
    <div
      className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 z-9999"
      onClick={handleClose}
      onMouseDown={(e) => setClosingTarget(e.target)}
    >
      <form onSubmit={handleLogin} className="flex flex-col p-4 space-y-2 bg-black rounded-3xl bg-opacity-80">
        <span className="text-white">Login</span>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          className="px-2 py-1 text-lg text-center text-black rounded-xl"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          className="px-2 py-1 text-lg text-center text-black rounded-xl"
          required
        />
        <input type="submit" value="Se connecter" />
      </form>
    </div>
  );
}
