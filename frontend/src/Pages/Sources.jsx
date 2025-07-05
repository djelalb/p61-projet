import { useEffect } from 'react';

export default function Sources() {
  useEffect(() => {
    document.title = 'CTScam - Sources';
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl font-bold">Source - Evian 😉</p>
        <img src="assets/evian.jpg" alt="Evian" className="object-center h-auto mt-3 rounded-full w-96" />
      </div>
    </>
  );
}
