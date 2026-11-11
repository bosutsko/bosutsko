import { useState } from 'react';
import { useServis } from '../hooks/useServis.js';
import { nekretnineServis, kategorijeServis, upitiServis } from '../services/servisi.js';
import { datumHr, eur, danas, EMAIL_RE } from '../utils/format.js';

// Detalji nekretnine s obrascem "Brzi upit".
export default function Nekretnina({ sifra, idi }) {
  const nekretnine = useServis(nekretnineServis);
  const kategorije = useServis(kategorijeServis);
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [poruka, setPoruka] = useState('');
  const [greske, setGreske] = useState({});
  const [poslano, setPoslano] = useState(false);

  if (!nekretnine.ucitano) return <p className="prigusen">Učitavanje...</p>;

  const n = nekretnine.stavke.find((x) => x.sifra === Number(sifra));
  if (!n) {
    return (
      <p>Nekretnina nije pronađena. <button className="veza" onClick={() => idi('ponuda')}>Natrag na ponudu</button></p>
    );
  }

  const kategorija = kategorije.stavke.find((k) => k.sifra === n.kategorijaSifra)?.naziv ?? '—';
  const karta = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.lokacija)}`;

  async function posalji(e) {
    e.preventDefault();
    const g = {};
    if (ime.trim().length < 2) g.ime = 'Unesite ime.';
    if (!EMAIL_RE.test(email.trim())) g.email = 'Unesite ispravan e-mail.';
    if (poruka.trim().length < 10) g.poruka = 'Poruka mora imati najmanje 10 znakova.';
    setGreske(g);
    if (Object.keys(g).length) return;
    await upitiServis.dodaj({ nekretninaSifra: n.sifra, ime: ime.trim(), email: email.trim(), poruka: poruka.trim(), datum: danas() });
    setIme(''); setEmail(''); setPoruka('');
    setPoslano(true);
  }

  return (
    <article>
      <div className="bez-ispisa">
        <button className="veza" onClick={() => idi('ponuda')}>← Natrag na ponudu</button>
      </div>
      <div className="glava">
        <h1>{n.naslov}</h1>
        <button className="gumb sporedni bez-ispisa" onClick={() => window.print()}>Ispis</button>
      </div>
      <p className="prigusen">{kategorija} · {n.lokacija} · {n.povrsina} m² · objavljeno {datumHr(n.datumObjave)}</p>

      <div className="kutija detalj-slika">
        {n.slika ? <img src={n.slika} alt={n.naslov} /> : <span>{kategorija}</span>}
      </div>

      <p className="cijena veliko">
        {n.akcijskaCijena ? (
          <>
            <s className="prigusen">{eur(n.cijena)}</s> {eur(n.akcijskaCijena)} <b className="traka u-redu">Akcija</b>
          </>
        ) : eur(n.cijena)}
      </p>
      <p>{n.opis}</p>
      <p className="bez-ispisa">
        <a className="veza" href={karta} target="_blank" rel="noreferrer">Lokacija na Google karti</a>
        {n.video && (
          <> · <a className="veza" href={n.video} target="_blank" rel="noreferrer">Video prikaz</a></>
        )}
      </p>

      <section className="kutija obrazac bez-ispisa">
        <h2>Brzi upit</h2>
        {poslano && <div className="uspjeh">Hvala, upit je zabilježen. Javit ćemo vam se.</div>}
        <form onSubmit={posalji} noValidate className="mreza-obrasca">
          <label>Ime
            <input value={ime} onChange={(e) => setIme(e.target.value)} />
            {greske.ime && <em>{greske.ime}</em>}
          </label>
          <label>E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            {greske.email && <em>{greske.email}</em>}
          </label>
          <label className="puna">Poruka
            <textarea rows={3} value={poruka} onChange={(e) => setPoruka(e.target.value)} />
            {greske.poruka && <em>{greske.poruka}</em>}
          </label>
          <div className="akcije">
            <button className="gumb" type="submit">Pošalji upit</button>
          </div>
        </form>
      </section>
    </article>
  );
}
