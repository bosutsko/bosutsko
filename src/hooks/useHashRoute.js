import { useEffect, useState } from 'react';

// Routing preko # u adresi: #/ponuda, #/nekretnina/3 ... Nepoznata stranica vodi na prvu u popisu.
function procitaj(stranice) {
  const [stranica, param] = window.location.hash.replace(/^#\/?/, '').split('/');
  return {
    stranica: stranice.some((s) => s.id === stranica) ? stranica : stranice[0].id,
    param: param ?? null,
  };
}

export function useHashRoute(stranice) {
  const [ruta, setRuta] = useState(() => procitaj(stranice));

  useEffect(() => {
    const naPromjenu = () => setRuta(procitaj(stranice));
    window.addEventListener('hashchange', naPromjenu);
    return () => window.removeEventListener('hashchange', naPromjenu);
  }, [stranice]);

  const idi = (stranica, param) => {
    window.location.hash = param == null ? `#/${stranica}` : `#/${stranica}/${param}`;
  };

  return { ...ruta, idi };
}
