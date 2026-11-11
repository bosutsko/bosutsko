import { napraviServis } from './store.js';
import { KATEGORIJE, NEKRETNINE, UPITI } from '../data/seed.js';

export const kategorijeServis = napraviServis('ne_kategorije', KATEGORIJE);
export const nekretnineServis = napraviServis('ne_nekretnine', NEKRETNINE);
export const upitiServis = napraviServis('ne_upiti', UPITI);
