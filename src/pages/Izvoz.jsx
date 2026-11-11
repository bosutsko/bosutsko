import { useState } from 'react';
import { useServis } from '../hooks/useServis.js';
import { nekretnineServis, kategorijeServis } from '../services/servisi.js';
import { preuzmi, vrijecaCijena, xmlEscape } from '../utils/format.js';

// Generiranje XML datoteka: karta stranice (sitemap) i izvoz za oglasne portale.
export default function Izvoz() {
  const nekretnine = useServis(nekretnineServis);
  const kategorije = useServis(kategorijeServis);
  const [poruka, setPoruka] = useState('');

  const osnova = `${window.location.origin}${window.location.pathname}`;
  const poveznica = (n) => `${osnova}#/nekretnina/${n.sifra}`;
  const naziv = (s) => kategorije.stavke.find((k) => k.sifra === s)?.naziv ?? '';
  const XML = '<?xml version="1.0" encoding="UTF-8"?>';

  function sitemap() {
    const adrese = [osnova, `${osnova}#/ponuda`, ...nekretnine.stavke.map(poveznica)];
    const stavke = adrese.map((a) => `  <url><loc>${xmlEscape(a)}</loc></url>`).join('\n');
    preuzmi('sitemap.xml', `${XML}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${stavke}\n</urlset>\n`);
    setPoruka(`Generirana karta stranice s ${adrese.length} poveznica.`);
  }

  function portal(imePortala, datoteka) {
    const stavke = nekretnine.stavke.map((n) =>
      `  <nekretnina>
    <id>${n.sifra}</id>
    <naslov>${xmlEscape(n.naslov)}</naslov>
    <kategorija>${xmlEscape(naziv(n.kategorijaSifra))}</kategorija>
    <mjesto>${xmlEscape(n.grad)}</mjesto>
    <lokacija>${xmlEscape(n.lokacija)}</lokacija>
    <povrsina>${n.povrsina}</povrsina>
    <cijena>${vrijecaCijena(n)}</cijena>
    <valuta>EUR</valuta>
    <opis>${xmlEscape(n.opis)}</opis>
    <poveznica>${xmlEscape(poveznica(n))}</poveznica>
  </nekretnina>`).join('\n');
    preuzmi(datoteka, `${XML}\n<!-- Izvoz za portal: ${xmlEscape(imePortala)} -->\n<nekretnine>\n${stavke}\n</nekretnine>\n`);
    setPoruka(`Generiran XML za ${imePortala} s ${nekretnine.stavke.length} nekretnina.`);
  }

  return (
    <>
      <h1>Izvoz</h1>
      <p className="prigusen">Jednim klikom generirajte datoteke za pretraživače i oglasne portale.</p>
      {poruka && <div className="uspjeh">{poruka}</div>}
      <div className="kutije">
        <div className="kutija statistika">
          <b>Karta stranice</b>
          <span>XML sa svim poveznicama aplikacije, za pretraživače.</span>
          <button className="gumb" onClick={sitemap}>Generiraj sitemap.xml</button>
        </div>
        <div className="kutija statistika">
          <b>Crozilla</b>
          <span>XML sa svim nekretninama za oglašavanje.</span>
          <button className="gumb" onClick={() => portal('Crozilla', 'crozilla.xml')}>Generiraj XML</button>
        </div>
        <div className="kutija statistika">
          <b>Real Estate Croatia</b>
          <span>XML sa svim nekretninama za oglašavanje.</span>
          <button className="gumb" onClick={() => portal('Real Estate Croatia', 'realestatecroatia.xml')}>Generiraj XML</button>
        </div>
      </div>
    </>
  );
}
