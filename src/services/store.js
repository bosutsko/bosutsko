// Mali "servis" za jednu vrstu zapisa. Podaci se čuvaju u localStorageu pod zadanim ključem;
// sučelje je asinkrono (kao da je pravi API) pa se kasnije može zamijeniti pozivima na poslužitelj.

async function ucitaj(kljuc, pocetno) {
  try {
    const tekst = localStorage.getItem(kljuc);
    if (tekst) {
      const podaci = JSON.parse(tekst);
      if (Array.isArray(podaci)) return podaci;
    }
  } catch {
    // oštećen zapis ili blokiran localStorage: koristimo demo podatke
  }
  return structuredClone(pocetno);
}

async function spremi(kljuc, podaci) {
  try {
    localStorage.setItem(kljuc, JSON.stringify(podaci));
    return true;
  } catch {
    return false; // npr. privatni način rada ili puna kvota
  }
}

export function napraviServis(kljuc, pocetno) {
  let stavke = [];
  let ucitavanje = null;

  // podaci se učitaju samo jednom, pri prvom pozivu
  function osiguraj() {
    ucitavanje ??= ucitaj(kljuc, pocetno).then((p) => { stavke = p; });
    return ucitavanje;
  }

  async function get() {
    await osiguraj();
    return { data: [...stavke] };
  }

  async function getBySifra(sifra) {
    await osiguraj();
    return { data: stavke.find((s) => s.sifra === parseInt(sifra)) };
  }

  async function dodaj(zapis) {
    await osiguraj();
    const sifra = stavke.reduce((max, s) => Math.max(max, s.sifra), 0) + 1;
    stavke = [...stavke, { ...zapis, sifra }];
    return spremi(kljuc, stavke);
  }

  async function promijeni(sifra, izmjene) {
    await osiguraj();
    stavke = stavke.map((s) => (s.sifra === parseInt(sifra) ? { ...s, ...izmjene } : s));
    return spremi(kljuc, stavke);
  }

  async function obrisi(sifra) {
    await osiguraj();
    stavke = stavke.filter((s) => s.sifra !== parseInt(sifra));
    return spremi(kljuc, stavke);
  }

  return { get, getBySifra, dodaj, promijeni, obrisi };
}
