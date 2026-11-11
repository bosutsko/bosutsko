import Pocetna from './pages/Pocetna.jsx';
import Ponuda from './pages/Ponuda.jsx';
import Nekretnina from './pages/Nekretnina.jsx';
import Nekretnine from './pages/Nekretnine.jsx';
import Kategorije from './pages/Kategorije.jsx';
import Upiti from './pages/Upiti.jsx';
import Izvoz from './pages/Izvoz.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { STRANICE, NAZIV, AUTOR } from './data/constants.js';

// Zaglavlje s izbornikom, stranica prema adresi (#/ponuda ...) i podnožje.
export default function App() {
  const { stranica, param, idi } = useHashRoute(STRANICE);
  const izbornik = STRANICE.filter((s) => s.izbornik);

  let sadrzaj;
  switch (stranica) {
    case 'ponuda': sadrzaj = <Ponuda idi={idi} />; break;
    case 'nekretnina': sadrzaj = <Nekretnina sifra={param} idi={idi} />; break;
    case 'uredi': sadrzaj = <Nekretnine />; break;
    case 'kategorije': sadrzaj = <Kategorije />; break;
    case 'upiti': sadrzaj = <Upiti />; break;
    case 'izvoz': sadrzaj = <Izvoz />; break;
    default: sadrzaj = <Pocetna idi={idi} />;
  }

  return (
    <>
      <header className="zaglavlje bez-ispisa">
        <button className="logo" onClick={() => idi('pocetna')}>
          {NAZIV}
          <span className="autor">{AUTOR}</span>
        </button>
        <nav className="izbornik">
          {izbornik.map((s) => (
            <button
              key={s.id}
              className={`${s.id === stranica ? 'aktivna' : ''} ${s.uredjivanje ? 'cms' : ''}`}
              onClick={() => idi(s.id)}
            >
              {s.naziv}
            </button>
          ))}
        </nav>
      </header>
      <main className="sadrzaj">{sadrzaj}</main>
      <footer className="podnozje bez-ispisa">© {NAZIV}</footer>
    </>
  );
}
