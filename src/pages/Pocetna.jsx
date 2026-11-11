import KarticaNekretnine from '../components/KarticaNekretnine.jsx';
import { useServis } from '../hooks/useServis.js';
import { nekretnineServis, kategorijeServis } from '../services/servisi.js';

// Naslovnica: kratki opis, brojke i izdvojene nekretnine.
export default function Pocetna({ idi }) {
  const nekretnine = useServis(nekretnineServis);
  const kategorije = useServis(kategorijeServis);
  const nazivKategorije = (s) => kategorije.stavke.find((k) => k.sifra === s)?.naziv ?? '—';
  const izdvojene = nekretnine.stavke.filter((n) => n.izdvojena);
  const naAkciji = nekretnine.stavke.filter((n) => n.akcijskaCijena).length;

  return (
    <>
      <section className="naslovnica">
        <h1>Nekretnine Online</h1>
        <p className="prigusen">
          Kuće, stanovi, zemljišta i poslovni prostori. Pregledajte ponudu, pretražujte po karakteristikama i pošaljite upit.
        </p>
        <button className="gumb" onClick={() => idi('ponuda')}>Pretraži ponudu</button>
      </section>

      <div className="kutije">
        <button className="kutija statistika" onClick={() => idi('ponuda')}>
          <b>{nekretnine.stavke.length}</b><span>Nekretnina u ponudi</span>
        </button>
        <button className="kutija statistika" onClick={() => idi('ponuda')}>
          <b>{naAkciji}</b><span>Na akcijskoj cijeni</span>
        </button>
        <button className="kutija statistika" onClick={() => idi('ponuda')}>
          <b>{kategorije.stavke.length}</b><span>Kategorija i podkategorija</span>
        </button>
      </div>

      <h2>Izdvojene nekretnine</h2>
      {izdvojene.length === 0 ? (
        <p className="prigusen">Nema izdvojenih nekretnina.</p>
      ) : (
        <div className="pomicna-lista">
          {izdvojene.map((n) => (
            <KarticaNekretnine
              key={n.sifra}
              n={n}
              kategorija={nazivKategorije(n.kategorijaSifra)}
              onOtvori={(s) => idi('nekretnina', s)}
            />
          ))}
        </div>
      )}
    </>
  );
}
