import CrudStranica from '../components/CrudStranica.jsx';
import { useServis } from '../hooks/useServis.js';
import { nekretnineServis, kategorijeServis, upitiServis } from '../services/servisi.js';
import { datumHr, eur, danas } from '../utils/format.js';

// Uređivanje nekretnina (sadržaj aplikacije).
export default function Nekretnine() {
  const nekretnine = useServis(nekretnineServis);
  const kategorije = useServis(kategorijeServis);
  const upiti = useServis(upitiServis);
  const nazivKategorije = (s) => kategorije.stavke.find((k) => k.sifra === s)?.naziv ?? '—';

  function validate(v) {
    const g = {};
    if (!(Number(v.povrsina) > 0)) g.povrsina = 'Površina mora biti veća od 0.';
    if (!(Number(v.cijena) > 0)) g.cijena = 'Cijena mora biti veća od 0.';
    if (v.akcijskaCijena !== '' && v.akcijskaCijena !== null &&
        !(Number(v.akcijskaCijena) > 0 && Number(v.akcijskaCijena) < Number(v.cijena))) {
      g.akcijskaCijena = 'Akcijska cijena mora biti veća od 0 i niža od redovne.';
    }
    return g;
  }

  return (
    <CrudStranica
      naslov="Nekretnine (uređivanje sadržaja)"
      novi="Nova nekretnina"
      servis={nekretnineServis}
      stavke={nekretnine.stavke}
      osvjezi={nekretnine.osvjezi}
      prazno="Još nema nekretnina."
      validate={validate}
      fields={[
        { name: 'naslov', label: 'Naslov', required: true },
        { name: 'kategorijaSifra', label: 'Kategorija', type: 'select', asNumber: true, required: true,
          options: kategorije.stavke.map((k) => ({ value: k.sifra, label: k.naziv })) },
        { name: 'grad', label: 'Mjesto', required: true },
        { name: 'lokacija', label: 'Lokacija (za Google kartu)', required: true },
        { name: 'povrsina', label: 'Površina (m²)', type: 'number', required: true },
        { name: 'cijena', label: 'Cijena (€)', type: 'number', required: true },
        { name: 'akcijskaCijena', label: 'Akcijska (snižena) cijena (€)', type: 'number' },
        { name: 'datumObjave', label: 'Datum objave', type: 'date', required: true, default: danas() },
        { name: 'slika', label: 'Slika (adresa, nije obavezno)' },
        { name: 'video', label: 'Video (adresa, nije obavezno)' },
        { name: 'izdvojena', label: 'Izdvojena na početnoj', type: 'checkbox' },
        { name: 'opis', label: 'Opis', type: 'textarea' },
      ]}
      columns={[
        { key: 'naslov', label: 'Naslov' },
        { render: (n) => nazivKategorije(n.kategorijaSifra), label: 'Kategorija' },
        { key: 'grad', label: 'Mjesto' },
        { render: (n) => `${n.povrsina} m²`, label: 'Površina' },
        { render: (n) => (n.akcijskaCijena ? `${eur(n.akcijskaCijena)} (akcija)` : eur(n.cijena)), label: 'Cijena' },
        { render: (n) => datumHr(n.datumObjave), label: 'Objavljeno' },
        { render: (n) => (n.izdvojena ? <span className="oznaka ok">Izdvojena</span> : '—'), label: 'Početna' },
      ]}
      blokirajBrisanje={(n) =>
        upiti.stavke.some((u) => u.nekretninaSifra === n.sifra)
          ? 'Nekretnina ima zabilježene upite i ne može se obrisati. Prvo obrišite njezine upite.'
          : null}
    />
  );
}
