/**
 * Types principaux de l'application de suivi nutritionnel.
 * Définit les structures de données pour les aliments, les entrées et l'historique.
 */

/** Valeurs nutritionnelles pour 100g d'un aliment */
export interface NutritionPer100g {
	calories: number;
	proteines: number;
	glucides: number;
	lipides: number;
}

/** Aliment référencé dans le catalogue */
export interface Food {
	nom: string;
	/** Valeurs nutritionnelles pour 100g */
	valeurs: NutritionPer100g;
}

/** Entrée dans l'historique du jour (un aliment consommé) */
export interface FoodEntry {
	id: string;
	nom: string;
	quantite: number; // en grammes
	calories: number;
	proteines: number;
	glucides: number;
	lipides: number;
}

/** Données sauvegardées pour un jour de la semaine */
export interface DayRecord {
	calories: number;
	proteines: number;
	glucides: number;
	lipides: number;
}

/** Historique de la semaine (lundi → dimanche) */
export interface WeekRecord {
	lundi: DayRecord;
	mardi: DayRecord;
	mercredi: DayRecord;
	jeudi: DayRecord;
	vendredi: DayRecord;
	samedi: DayRecord;
	dimanche: DayRecord;
}

/** Jours de la semaine */
export type JourSemaine = keyof WeekRecord;

/** Catégories d'aliments disponibles */
export type Categorie =
	| 'Légumes'
	| 'Féculents'
	| 'Protéines animales'
	| 'Protéines végétales'
	| 'Fromages'
	| 'Pains'
	| 'Sucreries'
	| 'Boissons'
	| 'Autre';

/** Pages de l'application */
export type Page = 'home' | 'history' | 'foods';
