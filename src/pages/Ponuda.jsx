import { useState } from 'react';
import KarticaNekretnine from '../components/KarticaNekretnine.jsx';
import { useServis } from '../hooks/useServis.js';
import { nekretnineServis, kategorijeServis } from '../services/servisi.js';
import { eur, vrijecaCijena } from '../utils/format.js';

// Javna ponuda: filteri, prikaz mreža/lista, odabir nekretnina za ispis ili slanje e-mailom.
export default function Ponuda({ idi }) {
  const nekretnine = useServis(nekretnineServis);
  const kategorije = useServis(kategorijeServis);
  const [trazi, setTrazi] = useState('');
  const [kategorija, setKategorija] = useState('');
  const [grad, setGrad] = useState('');
  const [maxCijena, setMaxCijena] = useState('');
  const [samoAkcija, setSamoAkcija] = useState(false);
  const [prikaz, setPrikaz] = useState('mreza');
  const [odabrane, setOdabrane] = useState([]);

  const naziv = (s) => kategorije.stavke.find((k) => k.sifra === s)?.naziv ?? '—';
  const gradovi = [...new Set(nekretnine.stavke.map((n) => n.grad))].sort();

  // odabrana kategorija obuhvaća i svoje podkategorije
  const uKategoriji = (n) => {
    if (!kategorija) return true;
    const sifra = Number(kategorija);
    const podkategorije = kategorije.stavke.filter((k) => k.roditeljSifra === sifra).map((k) => k.sifra);
    return n.kategorijaSifra === sifra || podkategorije.includes(n.kategorijaSifra);
  };

  const t = trazi.trim().toLowerCase();
  const rezultati = nekretnine.stavke
    .filter(uKategoriji)
    .filter((n) => !grad || n.grad === grad)
    .filter((n) => !maxCijena || vrijecaCijena(n) <= Number(maxCijena))
    .filter((n) => !samoAkcija || n.akcijskaCijena)
    .filter((n) => !t || `${n.naslov} ${n.opis} ${n.lokacija}`.toLowerCase().includes(t));

  const preklopiOdabir = (s) =>
    setOdabrane((o) => (o.includes(s) ? o.filter((x) => x !== s) : [...o, s]));

  // za ispis i e-mail: ako je nešto odabrano, to; inače svi rezultati pretrage
  const zaIzvoz = odabrane.length > 0 ? nekretnine.stavke.filter((n) => odabrane.includes(n.sifra)) : rezultati;

  const mailto = () => {
    const tijelo = zaIzvoz.map((n) => `- ${n.naslov}, ${n.grad}, ${eur(vrijecaCijena(n))}`).join('\n');
    return `mailto:?subject=Odabrane%20nekretnine&body=${encodeURIComponent(tijelo)}`;
  };

  return (
    <>
      <div className="bez-ispisa">
        <h1>Ponuda</h1>
        <div className="kutija filtri">
          <label>Tražilica
            <input type="search" placeholder="Naslov, opis ili lokacija…" value={trazi} onChange={(e) => setTrazi(e.target.value)} />
          </label>
          <label>Kategorija
            <select value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
              <option value="">Sve</option>
              {kategorije.stavke.map((k) => (
                <option key={k.sifra} value={k.sifra}>{k.roditeljSifra ? '— ' : ''}{k.naziv}</option>
              ))}
            </select>
          </label>
          <label>Mjesto
            <select value={grad} onChange={(e) => setGrad(e.target.value)}>
              <option value="">Sva</option>
              {gradovi.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label>Najviša cijena (€)
            <input type="number" value={maxCijena} onChange={(e) => setMaxCijena(e.target.value)} />
          </label>
          <label className="kvacica-filtar">
            <input type="checkbox" checked={samoAkcija} onChange={(e) => setSamoAkcija(e.target.checked)} /> Samo akcija
          </label>
        </div>

        <div className="alat">
          <span className="prigusen">{rezultati.length} nekretnina</span>
          <div className="prekidac">
            <button className={prikaz === 'mreza' ? 'aktivna' : ''} onClick={() => setPrikaz('mreza')}>Mreža</button>
            <button className={prikaz === 'lista' ? 'aktivna' : ''} onClick={() => setPrikaz('lista')}>Lista</button>
          </div>
          <button className="gumb sporedni" onClick={() => window.print()}>
            Ispis {odabrane.length > 0 ? `odabranih (${odabrane.length})` : 'rezultata'}
          </button>
          <a className="gumb sporedni" href={mailto()}>
            Pošalji mailom {odabrane.length > 0 ? `(${odabrane.length})` : ''}
          </a>
          {odabrane.length > 0 && <button className="veza" onClick={() => setOdabrane([])}>Poništi odabir</button>}
        </div>

        {rezultati.length === 0 ? (
          <p className="prigusen">Nijedna nekretnina ne odgovara pretrazi.</p>
        ) : (
          <div className={prikaz === 'mreza' ? 'mreza-nek' : 'lista-nek'}>
            {rezultati.map((n) => (
              <KarticaNekretnine
                key={n.sifra}
                n={n}
                kategorija={naziv(n.kategorijaSifra)}
                lista={prikaz === 'lista'}
                odabrana={odabrane.includes(n.sifra)}
                onOdabir={preklopiOdabir}
                onOtvori={(s) => idi('nekretnina', s)}
              />
            ))}
          </div>
        )}
      </div>

      {/* vidi se samo pri ispisu (@media print) */}
      <section className="ispis-samo">
        <h1>Nekretnine Online: ispis ponude</h1>
        {zaIzvoz.map((n) => (
          <div className="ispis-stavka" key={n.sifra}>
            <h3>{n.naslov}</h3>
            <p>{naziv(n.kategorijaSifra)} · {n.lokacija} · {n.povrsina} m²</p>
            <p><b>{eur(vrijecaCijena(n))}</b>{n.akcijskaCijena ? ` (redovna cijena ${eur(n.cijena)})` : ''}</p>
            <p>{n.opis}</p>
          </div>
        ))}
      </section>
    </>
  );
}
