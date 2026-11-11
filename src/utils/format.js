// Datum iz oblika 2026-10-20 u 20. 10. 2026.
export const datumHr = (d) => (d ? d.split('-').reverse().join('. ') + '.' : '');

export const eur = (iznos) =>
  new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(iznos);

export const danas = () => new Date().toISOString().slice(0, 10);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Cijena koja vrijedi: akcijska ako postoji, inače redovna
export const vrijecaCijena = (n) => (n.akcijskaCijena ? n.akcijskaCijena : n.cijena);

// Za XML: zamjena posebnih znakova
export const xmlEscape = (v) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Preuzimanje generirane datoteke u pregledniku
export function preuzmi(imeDatoteke, sadrzaj) {
  const url = URL.createObjectURL(new Blob([sadrzaj], { type: 'application/xml;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = imeDatoteke;
  a.click();
  URL.revokeObjectURL(url);
}
