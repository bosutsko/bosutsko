// Demo podaci koji se učitaju kad u localStorageu još nema zapisa.
export const KATEGORIJE = [
  { sifra: 1, naziv: 'Kuće', opis: 'Samostojeće kuće i kuće u nizu.', roditeljSifra: null },
  { sifra: 2, naziv: 'Vile', opis: 'Luksuzne vile s bazenom.', roditeljSifra: 1 },
  { sifra: 3, naziv: 'Stanovi', opis: 'Stanovi u zgradama.', roditeljSifra: null },
  { sifra: 4, naziv: 'Zemljišta', opis: 'Građevinska i poljoprivredna zemljišta.', roditeljSifra: null },
  { sifra: 5, naziv: 'Poslovni prostori', opis: 'Uredi, lokali, barovi i restorani.', roditeljSifra: null },
];

export const NEKRETNINE = [
  { sifra: 1, naslov: 'Obiteljska kuća s vrtom (demo)', kategorijaSifra: 1, grad: 'Osijek', lokacija: 'Osijek, Tvrđa', povrsina: 180, cijena: 245000, akcijskaCijena: 229000, izdvojena: true, datumObjave: '2026-10-20', opis: 'Prostrana kuća s uređenim vrtom i garažom.', video: '', slika: '' },
  { sifra: 2, naslov: 'Vila s bazenom (demo)', kategorijaSifra: 2, grad: 'Zadar', lokacija: 'Zadar, Diklo', povrsina: 320, cijena: 890000, akcijskaCijena: null, izdvojena: true, datumObjave: '2026-10-25', opis: 'Moderna vila s pogledom na more i bazenom.', video: '', slika: '' },
  { sifra: 3, naslov: 'Trosoban stan u centru (demo)', kategorijaSifra: 3, grad: 'Osijek', lokacija: 'Osijek, Europska avenija', povrsina: 78, cijena: 139000, akcijskaCijena: null, izdvojena: true, datumObjave: '2026-10-28', opis: 'Renoviran stan na trećem katu, blizu centra.', video: '', slika: '' },
  { sifra: 4, naslov: 'Građevinsko zemljište (demo)', kategorijaSifra: 4, grad: 'Đakovo', lokacija: 'Đakovo, Kuševac', povrsina: 950, cijena: 38000, akcijskaCijena: 34500, izdvojena: false, datumObjave: '2026-09-30', opis: 'Ravno zemljište s priključcima na rubu naselja.', video: '', slika: '' },
  { sifra: 5, naslov: 'Poslovni prostor uz glavnu ulicu (demo)', kategorijaSifra: 5, grad: 'Osijek', lokacija: 'Osijek, Županijska ulica', povrsina: 65, cijena: 98000, akcijskaCijena: null, izdvojena: false, datumObjave: '2026-10-10', opis: 'Lokal pogodan za ured ili kafić.', video: '', slika: '' },
  { sifra: 6, naslov: 'Dvosoban stan uz more (demo)', kategorijaSifra: 3, grad: 'Pula', lokacija: 'Pula, Veruda', povrsina: 56, cijena: 175000, akcijskaCijena: null, izdvojena: false, datumObjave: '2026-10-05', opis: 'Stan s balkonom, 300 m od plaže.', video: '', slika: '' },
];

export const UPITI = [
  { sifra: 1, nekretninaSifra: 1, ime: 'Ana Horvat (demo)', email: 'ana@example.com', poruka: 'Zanima me je li moguć razgled u subotu.', datum: '2026-10-29' },
  { sifra: 2, nekretninaSifra: 3, ime: 'Marko Kovač (demo)', email: 'marko@example.com', poruka: 'Može li se pregovarati o cijeni?', datum: '2026-10-30' },
];
