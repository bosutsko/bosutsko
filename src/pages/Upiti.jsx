import CrudStranica from '../components/CrudStranica.jsx';
import { useServis } from '../hooks/useServis.js';
import { upitiServis, nekretnineServis } from '../services/servisi.js';
import { datumHr, danas, EMAIL_RE } from '../utils/format.js';

// Upiti kupaca: najnoviji su na vrhu.
export default function Upiti() {
  const upiti = useServis(upitiServis);
  const nekretnine = useServis(nekretnineServis);
  const naslov = (s) => nekretnine.stavke.find((n) => n.sifra === s)?.naslov ?? 'Opći upit';
  const poredani = [...upiti.stavke].sort((a, b) => b.datum.localeCompare(a.datum) || b.sifra - a.sifra);

  return (
    <CrudStranica
      naslov="Upiti kupaca"
      novi="Novi upit"
      servis={upitiServis}
      stavke={poredani}
      osvjezi={upiti.osvjezi}
      prazno="Još nema upita."
      validate={(v) => (EMAIL_RE.test(String(v.email).trim()) ? {} : { email: 'Unesite ispravan e-mail.' })}
      fields={[
        { name: 'nekretninaSifra', label: 'Nekretnina', type: 'select', asNumber: true,
          praznoOznaka: '— opći upit —',
          options: nekretnine.stavke.map((n) => ({ value: n.sifra, label: n.naslov })) },
        { name: 'ime', label: 'Ime', required: true },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true, default: danas() },
        { name: 'poruka', label: 'Poruka', type: 'textarea', required: true },
      ]}
      columns={[
        { render: (u) => datumHr(u.datum), label: 'Datum' },
        { render: (u) => naslov(u.nekretninaSifra), label: 'Nekretnina' },
        { key: 'ime', label: 'Ime' },
        { key: 'email', label: 'E-mail' },
        { key: 'poruka', label: 'Poruka' },
      ]}
    />
  );
}
