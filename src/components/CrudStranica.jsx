import { useState } from 'react';

// Opća stranica za uređivanje jedne vrste zapisa: tablica + obrazac za novi zapis i uređivanje.
// Koriste je Nekretnine, Kategorije i Upiti; razlikuju se samo po popisu polja i stupaca.
export default function CrudStranica({
  naslov, novi, servis, stavke, osvjezi, fields, columns, validate, blokirajBrisanje, prazno, alat,
}) {
  const pocetnaVrijednost = (f) => f.default ?? (f.type !== 'checkbox' && '');
  const prazniObrazac = Object.fromEntries(fields.map((f) => [f.name, pocetnaVrijednost(f)]));

  const [vrijednosti, setVrijednosti] = useState(prazniObrazac);
  const [uredjuje, setUredjuje] = useState(null); // zapis koji se uređuje, null = novi zapis
  const [greske, setGreske] = useState({});
  const [otvoren, setOtvoren] = useState(false);
  const [poruka, setPoruka] = useState('');

  const otvoriNovi = () => {
    setUredjuje(null); setVrijednosti(prazniObrazac); setGreske({}); setPoruka(''); setOtvoren(true);
  };

  const otvoriUredjivanje = (zapis) => {
    setUredjuje(zapis);
    setVrijednosti(Object.fromEntries(fields.map((f) => [f.name, zapis[f.name] ?? pocetnaVrijednost(f)])));
    setGreske({}); setPoruka(''); setOtvoren(true);
  };

  const zatvori = () => { setOtvoren(false); setUredjuje(null); setGreske({}); };

  const promjena = (e) => setVrijednosti({ ...vrijednosti, [e.target.name]: e.target.value });

  async function spremi(e) {
    e.preventDefault();
    const g = {};
    fields.forEach((f) => {
      if (f.required && !String(vrijednosti[f.name]).trim()) g[f.name] = 'Obavezno polje';
    });
    // dodatna pravila provjeravaju se tek kad su obavezna polja ispunjena
    if (Object.keys(g).length === 0 && validate) Object.assign(g, validate(vrijednosti, uredjuje));
    setGreske(g);
    if (Object.keys(g).length) return;

    const zapis = {};
    fields.forEach((f) => {
      const v = vrijednosti[f.name];
      if (f.type === 'number' || f.asNumber) zapis[f.name] = v === '' ? null : Number(v);
      else zapis[f.name] = typeof v === 'string' ? v.trim() : v;
    });

    const uspjeh = uredjuje ? await servis.promijeni(uredjuje.sifra, zapis) : await servis.dodaj(zapis);
    await osvjezi();
    if (uspjeh) zatvori();
    else setPoruka('Spremanje nije uspjelo. Preglednik možda blokira spremanje podataka.');
  }

  async function obrisi(zapis) {
    const razlog = blokirajBrisanje && blokirajBrisanje(zapis);
    if (razlog) { setPoruka(razlog); return; }
    if (!window.confirm('Jeste li sigurni da želite obrisati zapis?')) return;
    const uspjeh = await servis.obrisi(zapis.sifra);
    await osvjezi();
    setPoruka(uspjeh ? '' : 'Brisanje nije uspjelo. Preglednik možda blokira spremanje podataka.');
  }

  return (
    <section>
      <div className="glava">
        <h1>{naslov}</h1>
        {!otvoren && <button className="gumb" onClick={otvoriNovi}>+ {novi}</button>}
      </div>

      {poruka && <div className="upozorenje">{poruka}</div>}

      {otvoren && (
        <form className="kutija obrazac" onSubmit={spremi} noValidate>
          <h2>{uredjuje ? 'Uredi zapis' : novi}</h2>
          <div className="mreza-obrasca">
            {fields.map((f) => (
              <label key={f.name} className={f.type === 'textarea' ? 'puna' : f.type === 'checkbox' ? 'kvacica' : ''}>
                {f.type === 'checkbox' ? (
                  <>
                    <input
                      name={f.name}
                      type="checkbox"
                      checked={!!vrijednosti[f.name]}
                      onChange={(e) => setVrijednosti({ ...vrijednosti, [f.name]: e.target.checked })}
                    />
                    {f.label}
                  </>
                ) : (
                  <>
                    {f.label}
                    {f.type === 'select' ? (
                      <select name={f.name} value={vrijednosti[f.name]} onChange={promjena}>
                        <option value="">{f.praznoOznaka ?? '— odaberite —'}</option>
                        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea name={f.name} rows={3} value={vrijednosti[f.name]} onChange={promjena} />
                    ) : (
                      <input name={f.name} type={f.type || 'text'} step={f.step} value={vrijednosti[f.name]} onChange={promjena} />
                    )}
                  </>
                )}
                {greske[f.name] && <em>{greske[f.name]}</em>}
              </label>
            ))}
          </div>
          <div className="akcije">
            <button className="gumb" type="submit">Spremi</button>
            <button className="gumb sporedni" type="button" onClick={zatvori}>Odustani</button>
          </div>
        </form>
      )}

      {alat}

      <div className="kutija tablica-omot">
        {stavke.length === 0 ? (
          <p className="prigusen popuna">{prazno}</p>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((c) => <th key={c.label}>{c.label}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {stavke.map((s) => (
                <tr key={s.sifra}>
                  {columns.map((c) => <td key={c.label}>{c.render ? c.render(s) : s[c.key]}</td>)}
                  <td className="akcije-reda">
                    <button className="veza" onClick={() => otvoriUredjivanje(s)}>Uredi</button>
                    <button className="veza opasno" onClick={() => obrisi(s)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
