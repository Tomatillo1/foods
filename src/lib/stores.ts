/**
 * Stores Svelte pour la gestion de l'état de l'application.
 * Gère l'historique du jour, l'historique de la semaine et la navigation.
 * Synchronisation automatique avec localStorage.
 */

import { writable, derived } from "svelte/store";
import type {
  FoodEntry,
  WeekRecord,
  Page,
  JourSemaine,
  DayRecord,
} from "$lib/types";

// ==========================================
// Constantes
// ==========================================

/** Structure des objectifs nutritionnels */
export interface Objectifs {
  calories: number;
  proteines: number;
}

/** Objectifs par défaut */
const DEFAUT_OBJECTIFS: Objectifs = {
  calories: 2200,
  proteines: 130,
};

function createObjectifsStore() {
  const { subscribe, set } = writable<Objectifs>(DEFAUT_OBJECTIFS);

  return {
    subscribe,
    /** Initialise le store depuis localStorage */
    init() {
      const data = chargerDepuisLS<Objectifs>("nutrition-objectifs", DEFAUT_OBJECTIFS);
      set(data);
    },
    /** Modifie les objectifs et sauvegarde dans localStorage */
    modifier(calories: number, proteines: number) {
      const nouveau = { calories, proteines };
      set(nouveau);
      sauvegarderDansLS("nutrition-objectifs", nouveau);
    }
  };
}

export const OBJECTIFS = createObjectifsStore();


/** Clés localStorage */
const LS_ENTRIES = "nutrition-today-entries";
const LS_WEEK = "nutrition-week-history";

/** Jour vide par défaut */
const jourVide: DayRecord = {
  calories: 0,
  proteines: 0,
  glucides: 0,
  lipides: 0,
};

/** Semaine vide par défaut */
const semaineVide: WeekRecord = {
  lundi: { ...jourVide },
  mardi: { ...jourVide },
  mercredi: { ...jourVide },
  jeudi: { ...jourVide },
  vendredi: { ...jourVide },
  samedi: { ...jourVide },
  dimanche: { ...jourVide },
};

// ==========================================
// Utilitaires localStorage
// ==========================================

/** Charge les données depuis localStorage de manière sûre */
function chargerDepuisLS<T>(cle: string, defaut: T): T {
  if (typeof window === "undefined") return defaut;
  try {
    const data = localStorage.getItem(cle);
    return data ? JSON.parse(data) : defaut;
  } catch {
    return defaut;
  }
}

/** Sauvegarde les données dans localStorage */
function sauvegarderDansLS<T>(cle: string, valeur: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    console.error(`Erreur sauvegarde localStorage: ${cle}`);
  }
}

// ==========================================
// Stores principaux
// ==========================================

/** Page courante de l'application */
export const currentPage = writable<Page>("home");

/** État de visibilité des popups (pour masquer la navbar) */
export const isPopupOpen = writable(false);
export const showSettingsPopup = writable(false);

/** Historique des entrées du jour */
function createEntriesStore() {
  const { subscribe, set, update } = writable<FoodEntry[]>([]);

  return {
    subscribe,
    /** Initialise le store depuis localStorage (appelé au montage) */
    init() {
      const data = chargerDepuisLS<FoodEntry[]>(LS_ENTRIES, []);
      set(data);
    },
    /** Ajoute une entrée et sauvegarde */
    ajouter(entry: Omit<FoodEntry, "id">) {
      update((entries) => {
        const nouvelleListe = [
          ...entries,
          { ...entry, id: crypto.randomUUID() },
        ];
        sauvegarderDansLS(LS_ENTRIES, nouvelleListe);
        return nouvelleListe;
      });
    },
    /** Supprime une entrée par son id et sauvegarde */
    supprimer(id: string) {
      update((entries) => {
        const nouvelleListe = entries.filter((e) => e.id !== id);
        sauvegarderDansLS(LS_ENTRIES, nouvelleListe);
        return nouvelleListe;
      });
    },
    /** Vide l'historique du jour */
    vider() {
      set([]);
      sauvegarderDansLS(LS_ENTRIES, []);
    },
  };
}

export const todayEntries = createEntriesStore();

/** Historique de la semaine */
function createWeekStore() {
  const { subscribe, set, update } = writable<WeekRecord>({ ...semaineVide });

  return {
    subscribe,
    /** Initialise le store depuis localStorage */
    init() {
      const data = chargerDepuisLS<WeekRecord>(LS_WEEK, { ...semaineVide });
      set(data);
    },
    /** Sauvegarde les totaux du jour dans un jour de la semaine */
    sauvegarderJour(jour: JourSemaine, totaux: DayRecord) {
      update((week) => {
        const nouveau = { ...week, [jour]: { ...totaux } };
        sauvegarderDansLS(LS_WEEK, nouveau);
        return nouveau;
      });
    },
    /** Remet toute la semaine à zéro */
    reset() {
      const vide = {
        lundi: { ...jourVide },
        mardi: { ...jourVide },
        mercredi: { ...jourVide },
        jeudi: { ...jourVide },
        vendredi: { ...jourVide },
        samedi: { ...jourVide },
        dimanche: { ...jourVide },
      };
      set(vide);
      sauvegarderDansLS(LS_WEEK, vide);
    },
  };
}

export const weekHistory = createWeekStore();

// ==========================================
// Stores dérivés (calculs automatiques)
// ==========================================

/** Totaux nutritionnels du jour (calculés automatiquement) */
export const todayTotals = derived(todayEntries, ($entries) => {
  return $entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      proteines: acc.proteines + entry.proteines,
      glucides: acc.glucides + entry.glucides,
      lipides: acc.lipides + entry.lipides,
    }),
    { calories: 0, proteines: 0, glucides: 0, lipides: 0 },
  );
});

/** Calories restantes (bloqué à 0 si dépassement) */
export const caloriesRestantes = derived([todayTotals, OBJECTIFS], ([$totals, $objectifs]) => ({
  valeur: Math.max(0, $objectifs.calories - $totals.calories),
  depasse: $totals.calories > $objectifs.calories,
}));

/** Protéines restantes (bloqué à 0 si dépassement) */
export const proteinesRestantes = derived([todayTotals, OBJECTIFS], ([$totals, $objectifs]) => ({
  valeur: Math.max(0, $objectifs.proteines - $totals.proteines),
  depasse: $totals.proteines > $objectifs.proteines,
}));
