export const NAZIV = 'Nekretnine Online';
export const AUTOR = 'Krunoslav Pucek';

// Stranice aplikacije. izbornik: prikazuje se u izborniku, uredjivanje: dio za uređivanje sadržaja (kurziv).
export const STRANICE = [
  { id: 'pocetna', naziv: 'Početna', izbornik: true },
  { id: 'ponuda', naziv: 'Ponuda', izbornik: true },
  { id: 'nekretnina', naziv: 'Nekretnina', izbornik: false },
  { id: 'uredi', naziv: 'Nekretnine', izbornik: true, uredjivanje: true },
  { id: 'kategorije', naziv: 'Kategorije', izbornik: true, uredjivanje: true },
  { id: 'upiti', naziv: 'Upiti', izbornik: true, uredjivanje: true },
  { id: 'izvoz', naziv: 'Izvoz', izbornik: true, uredjivanje: true },
];
