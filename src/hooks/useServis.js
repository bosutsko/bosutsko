import { useCallback, useEffect, useState } from 'react';

// Dohvaća popis iz servisa. osvjezi() ponovno učitava popis nakon dodavanja, izmjene ili brisanja.
export function useServis(servis) {
  const [stavke, setStavke] = useState([]);
  const [ucitano, setUcitano] = useState(false);

  const osvjezi = useCallback(async () => {
    const odgovor = await servis.get();
    setStavke(odgovor.data);
    setUcitano(true);
  }, [servis]);

  useEffect(() => {
    let aktivno = true;
    servis.get().then((odgovor) => {
      if (aktivno) {
        setStavke(odgovor.data);
        setUcitano(true);
      }
    });
    return () => { aktivno = false; };
  }, [servis]);

  return { stavke, ucitano, osvjezi };
}
