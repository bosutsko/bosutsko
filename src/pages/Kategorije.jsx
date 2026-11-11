import CrudStranica from '../components/CrudStranica.jsx';
import { useServis } from '../hooks/useServis.js';
import { kategorijeServis, nekretnineServis } from '../services/servisi.js';

// Kategorije i podkategorije (jedna razina: roditeljSifra pokazuje na nadkategoriju).
export default function Kategorije() {
  const kategorije = useServis(kategorijeServis);
  const nekretnine = useServis(nekretnineServis);
  const naziv = (s) => kategorije.stavke.find((k) => k.sifra === s)?.naziv;
  const brojNekretnina = (s) => nekretnine.stavke.filter((n) => n.kategorijaSifra === s).length;

  return (
    <CrudStranica
      naslov="Kategorije i podkategorije"
      novi="Nova kategorija"
      servis={kategorijeServis}
      stavke={kategorije.stavke}
      osvjezi={kategorije.osvjezi}
      prazno="Još nema kategorija."
      validate={(v, uredjuje) =>
        uredjuje && Number(v.roditeljSifra) === uredjuje.sifra
          ? { roditeljSifra: 'Kategorija ne može biti sama sebi nadkategorija.' }
          : {}}
      fields={[
        { name: 'naziv', label: 'Naziv', required: true },
        { name: 'roditeljSifra', label: 'Nadkategorija', type: 'select', asNumber: true,
          praznoOznaka: '— glavna kategorija —',
          options: kategorije.stavke.map((k) => ({ value: k.sifra, label: k.naziv })) },
        { name: 'opis', label: 'Opis', type: 'textarea' },
      ]}
      columns={[
        { render: (k) => (k.roditeljSifra ? `${naziv(k.roditeljSifra) ?? '—'} › ${k.naziv}` : k.naziv), label: 'Kategorija' },
        { render: (k) => k.opis || '—', label: 'Opis' },
        { render: (k) => brojNekretnina(k.sifra), label: 'Nekretnina' },
      ]}
      blokirajBrisanje={(k) =>
        brojNekretnina(k.sifra) > 0
          ? 'Kategorija ima nekretnine i ne može se obrisati.'
          : kategorije.stavke.some((x) => x.roditeljSifra === k.sifra)
            ? 'Kategorija ima podkategorije i ne može se obrisati.'
            : null}
    />
  );
}
