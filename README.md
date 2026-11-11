# Nekretnine Online

Web aplikacija za oglašavanje nekretnina: kuće, vile, stanovi, zemljišta i poslovni prostori. Posjetitelji pregledavaju
i filtriraju ponudu te šalju upite, a administrator uređuje nekretnine, kategorije i upite te generira XML za pretraživače
i oglasne portale. Izrađena u Reactu i Viteu, bez backenda – podaci se spremaju u `localStorage` preglednika.

## Funkcionalnosti

- **Početna:** brojke (nekretnine, akcije, kategorije) i vodoravni popis izdvojenih nekretnina.
- **Ponuda:** tražilica (naslov, opis, lokacija), filteri po kategoriji (uključuje podkategorije), mjestu, najvišoj cijeni i akciji; prikaz mreža/lista; odabir nekretnina za ispis ili slanje e-mailom.
- **Detalji nekretnine:** opis, cijena (s prekriženom redovnom cijenom na akciji), poveznica na Google kartu, video, ispis i obrazac „Brzi upit" s validacijom.
- **Nekretnine / Kategorije / Upiti:** dodavanje, uređivanje i brisanje preko zajedničke komponente `CrudStranica`. Nekretnina s upitima, kategorija s nekretninama ili podkategorijama ne može se obrisati.
- **Izvoz:** generiranje `sitemap.xml` te XML datoteka za portale Crozilla i Real Estate Croatia.

## Struktura projekta

```
src/
├── data/         konstante (stranice, naziv) i demo podaci (seed.js)
├── services/     store.js (CRUD nad localStorageom), servisi.js (kategorije, nekretnine, upiti)
├── hooks/        useServis (popis + osvježavanje), useHashRoute (routing preko #)
├── utils/        format.js (datum, iznos, e-mail, XML, preuzimanje)
├── components/   CrudStranica, KarticaNekretnine
├── pages/        Pocetna, Ponuda, Nekretnina, Nekretnine, Kategorije, Upiti, Izvoz
├── App.jsx       zaglavlje s izbornikom, stranica prema adresi, podnožje
└── styles.css    stilovi (boje su CSS varijable na vrhu)
```

## Adrese (routing)

| Adresa                | Stranica                          |
| --------------------- | --------------------------------- |
| `#/pocetna`           | Početna                           |
| `#/ponuda`            | Ponuda s filterima                |
| `#/nekretnina/ŠIFRA`  | Detalji nekretnine                |
| `#/uredi`             | Uređivanje nekretnina             |
| `#/kategorije`        | Kategorije i podkategorije        |
| `#/upiti`             | Upiti kupaca                      |
| `#/izvoz`             | Izvoz XML datoteka                |

## Podaci

Spremaju se u `localStorage` pod ključevima `ne_kategorije`, `ne_nekretnine` i `ne_upiti`.

- **kategorija:** `sifra`, `naziv`, `opis`, `roditeljSifra`
- **nekretnina:** `sifra`, `naslov`, `kategorijaSifra`, `grad`, `lokacija`, `povrsina`, `cijena`, `akcijskaCijena`, `izdvojena`, `datumObjave`, `opis`, `video`, `slika`
- **upit:** `sifra`, `nekretninaSifra`, `ime`, `email`, `poruka`, `datum`


