import { eur } from '../utils/format.js';

// Kartica nekretnine (mreža, lista i traka "Izdvojene nekretnine" na početnoj).
// onOdabir je zadan samo na stranici Ponuda: kvačica "Za ispis ili e-mail".
export default function KarticaNekretnine({ n, kategorija, lista, odabrana, onOdabir, onOtvori }) {
  return (
    <article className={`kartica-nek ${lista ? 'lista' : ''}`}>
      <button className="kartica-slika" onClick={() => onOtvori(n.sifra)} aria-label={`Otvori ${n.naslov}`}>
        {n.slika ? <img src={n.slika} alt={n.naslov} /> : <span>{kategorija}</span>}
        {n.akcijskaCijena ? <b className="traka">Akcija</b> : null}
      </button>
      <div className="kartica-tijelo">
        <h3>{n.naslov}</h3>
        <p className="prigusen">{n.grad} · {n.povrsina} m² · {kategorija}</p>
        <p className="cijena">
          {n.akcijskaCijena ? (
            <>
              <s className="prigusen">{eur(n.cijena)}</s> {eur(n.akcijskaCijena)}
            </>
          ) : eur(n.cijena)}
        </p>
        <div className="kartica-akcije">
          <button className="veza" onClick={() => onOtvori(n.sifra)}>Brzi pogled</button>
          {onOdabir && (
            <label className="odabir">
              <input type="checkbox" checked={odabrana} onChange={() => onOdabir(n.sifra)} /> Za ispis ili e-mail
            </label>
          )}
        </div>
      </div>
    </article>
  );
}
