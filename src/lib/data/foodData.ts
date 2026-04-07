/**
 * Base de données des aliments classés par catégorie.
 * Chaque aliment contient ses valeurs nutritionnelles pour 100g.
 * Facilement modifiable : ajouter/supprimer des entrées dans chaque catégorie.
 */

import type { Food } from '$lib/types';

/** Structure complète du catalogue d'aliments par catégorie */
export const foodDatabase: Record<string, Food[]> = {
	'Légumes': [
		{ nom: 'Tomate', valeurs: { calories: 18, proteines: 0.9, glucides: 3.9, lipides: 0.2 } },
		{ nom: 'Concombre', valeurs: { calories: 12, proteines: 0.7, glucides: 1.8, lipides: 0.2 } },
		{ nom: 'Carotte', valeurs: { calories: 36, proteines: 0.8, glucides: 7.6, lipides: 0.2 } },
		{ nom: 'Brocoli', valeurs: { calories: 34, proteines: 2.8, glucides: 7, lipides: 0.4 } },
		{ nom: 'Courgette', valeurs: { calories: 17, proteines: 1.2, glucides: 3.1, lipides: 0.3 } },
		{ nom: 'Épinard', valeurs: { calories: 23, proteines: 2.9, glucides: 3.6, lipides: 0.4 } },
		{ nom: 'Haricots verts', valeurs: { calories: 31, proteines: 1.8, glucides: 7, lipides: 0.1 } },
		{ nom: 'Poivron', valeurs: { calories: 27, proteines: 1, glucides: 5.1, lipides: 0.2 } },
		{ nom: 'Aubergine', valeurs: { calories: 25, proteines: 1, glucides: 6, lipides: 0.2 } },
		{ nom: 'Salade verte', valeurs: { calories: 15, proteines: 1.4, glucides: 2.9, lipides: 0.2 } },
		{ nom: 'Champignon', valeurs: { calories: 22, proteines: 3.1, glucides: 3.3, lipides: 0.3 } },
		{ nom: 'Oignon', valeurs: { calories: 40, proteines: 1.1, glucides: 9.3, lipides: 0.1 } },
	],

	'Féculents': [
		{ nom: 'Riz blanc cuit', valeurs: { calories: 130, proteines: 2.7, glucides: 28, lipides: 0.3 } },
		{ nom: 'Riz complet cuit', valeurs: { calories: 123, proteines: 2.6, glucides: 25.6, lipides: 0.9 } },
		{ nom: 'Pâtes cuites', valeurs: { calories: 131, proteines: 5, glucides: 25, lipides: 1.1 } },
		{ nom: 'Pomme de terre', valeurs: { calories: 77, proteines: 2, glucides: 17, lipides: 0.1 } },
		{ nom: 'Patate douce', valeurs: { calories: 86, proteines: 1.6, glucides: 20, lipides: 0.1 } },
		{ nom: 'Semoule cuite', valeurs: { calories: 112, proteines: 3.8, glucides: 23, lipides: 0.2 } },
		{ nom: 'Quinoa cuit', valeurs: { calories: 120, proteines: 4.4, glucides: 21.3, lipides: 1.9 } },
		{ nom: 'Lentilles cuites', valeurs: { calories: 116, proteines: 9, glucides: 20, lipides: 0.4 } },
		{ nom: 'Boulgour cuit', valeurs: { calories: 83, proteines: 3.1, glucides: 18.6, lipides: 0.2 } },
	],

	'Protéines animales': [
		{ nom: 'Poulet (blanc)', valeurs: { calories: 165, proteines: 31, glucides: 0, lipides: 3.6 } },
		{ nom: 'Dinde (blanc)', valeurs: { calories: 135, proteines: 30, glucides: 0, lipides: 1 } },
		{ nom: 'Bœuf (steak 5%)', valeurs: { calories: 137, proteines: 26, glucides: 0, lipides: 5 } },
		{ nom: 'Bœuf haché (15%)', valeurs: { calories: 250, proteines: 17, glucides: 0, lipides: 20 } },
		{ nom: 'Saumon', valeurs: { calories: 208, proteines: 20, glucides: 0, lipides: 13 } },
		{ nom: 'Thon (conserve)', valeurs: { calories: 116, proteines: 26, glucides: 0, lipides: 1 } },
		{ nom: 'Cabillaud', valeurs: { calories: 82, proteines: 18, glucides: 0, lipides: 0.7 } },
		{ nom: 'Crevettes', valeurs: { calories: 99, proteines: 24, glucides: 0.2, lipides: 0.3 } },
		{ nom: 'Œuf entier', valeurs: { calories: 155, proteines: 13, glucides: 1.1, lipides: 11 } },
		{ nom: 'Blanc d\'œuf', valeurs: { calories: 52, proteines: 11, glucides: 0.7, lipides: 0.2 } },
		{ nom: 'Jambon blanc', valeurs: { calories: 115, proteines: 21, glucides: 1, lipides: 3 } },
	],

	'Protéines végétales': [
		{ nom: 'Tofu', valeurs: { calories: 76, proteines: 8, glucides: 1.9, lipides: 4.8 } },
		{ nom: 'Tempeh', valeurs: { calories: 192, proteines: 20, glucides: 7.6, lipides: 11 } },
		{ nom: 'Pois chiches cuits', valeurs: { calories: 164, proteines: 8.9, glucides: 27, lipides: 2.6 } },
		{ nom: 'Edamame', valeurs: { calories: 121, proteines: 12, glucides: 8.6, lipides: 5.2 } },
		{ nom: 'Seitan', valeurs: { calories: 370, proteines: 75, glucides: 14, lipides: 2 } },
		{ nom: 'Amandes', valeurs: { calories: 579, proteines: 21, glucides: 22, lipides: 49 } },
		{ nom: 'Cacahuètes', valeurs: { calories: 567, proteines: 26, glucides: 16, lipides: 49 } },
		{ nom: 'Graines de chia', valeurs: { calories: 486, proteines: 17, glucides: 42, lipides: 31 } },
	],

	'Fromages': [
		{ nom: 'Emmental', valeurs: { calories: 380, proteines: 28, glucides: 0.4, lipides: 29 } },
		{ nom: 'Comté', valeurs: { calories: 400, proteines: 27, glucides: 0.3, lipides: 32 } },
		{ nom: 'Mozzarella', valeurs: { calories: 280, proteines: 22, glucides: 2.2, lipides: 20 } },
		{ nom: 'Chèvre frais', valeurs: { calories: 200, proteines: 13, glucides: 1, lipides: 16 } },
		{ nom: 'Feta', valeurs: { calories: 264, proteines: 14, glucides: 4.1, lipides: 21 } },
		{ nom: 'Parmesan', valeurs: { calories: 431, proteines: 38, glucides: 4.1, lipides: 29 } },
		{ nom: 'Cottage cheese', valeurs: { calories: 98, proteines: 11, glucides: 3.4, lipides: 4.3 } },
		{ nom: 'Fromage blanc 0%', valeurs: { calories: 43, proteines: 7, glucides: 4, lipides: 0.1 } },
	],

	'Pains': [
		{ nom: 'Pain blanc', valeurs: { calories: 265, proteines: 9, glucides: 49, lipides: 3.2 } },
		{ nom: 'Pain complet', valeurs: { calories: 247, proteines: 13, glucides: 41, lipides: 3.4 } },
		{ nom: 'Pain de mie', valeurs: { calories: 280, proteines: 8, glucides: 52, lipides: 4 } },
		{ nom: 'Baguette', valeurs: { calories: 270, proteines: 9, glucides: 55, lipides: 1.5 } },
		{ nom: 'Pain de seigle', valeurs: { calories: 259, proteines: 8.5, glucides: 48, lipides: 3.3 } },
		{ nom: 'Wrap / Tortilla', valeurs: { calories: 312, proteines: 8, glucides: 52, lipides: 8 } },
		{ nom: 'Galette de riz', valeurs: { calories: 387, proteines: 7, glucides: 85, lipides: 2.8 } },
	],

	'Sucreries': [
		{ nom: 'Chocolat noir 70%', valeurs: { calories: 598, proteines: 7.8, glucides: 46, lipides: 42 } },
		{ nom: 'Chocolat au lait', valeurs: { calories: 535, proteines: 7.6, glucides: 59, lipides: 30 } },
		{ nom: 'Miel', valeurs: { calories: 304, proteines: 0.3, glucides: 82, lipides: 0 } },
		{ nom: 'Confiture', valeurs: { calories: 250, proteines: 0.6, glucides: 63, lipides: 0.1 } },
		{ nom: 'Biscuit sec', valeurs: { calories: 430, proteines: 7, glucides: 75, lipides: 12 } },
		{ nom: 'Glace vanille', valeurs: { calories: 207, proteines: 3.5, glucides: 24, lipides: 11 } },
		{ nom: 'Nutella', valeurs: { calories: 539, proteines: 6.3, glucides: 57, lipides: 31 } },
		{ nom: 'Banane', valeurs: { calories: 89, proteines: 1.1, glucides: 23, lipides: 0.3 } },
		{ nom: 'Pomme', valeurs: { calories: 52, proteines: 0.3, glucides: 14, lipides: 0.2 } },
	],

	'Boissons': [
		{ nom: 'Lait entier', valeurs: { calories: 61, proteines: 3.2, glucides: 4.8, lipides: 3.3 } },
		{ nom: 'Lait demi-écrémé', valeurs: { calories: 46, proteines: 3.2, glucides: 4.8, lipides: 1.6 } },
		{ nom: 'Lait écrémé', valeurs: { calories: 32, proteines: 3.4, glucides: 4.7, lipides: 0.1 } },
		{ nom: 'Jus d\'orange', valeurs: { calories: 45, proteines: 0.7, glucides: 10, lipides: 0.2 } },
		{ nom: 'Coca-Cola', valeurs: { calories: 42, proteines: 0, glucides: 10.6, lipides: 0 } },
		{ nom: 'Bière', valeurs: { calories: 43, proteines: 0.5, glucides: 3.6, lipides: 0 } },
		{ nom: 'Vin rouge', valeurs: { calories: 85, proteines: 0.1, glucides: 2.6, lipides: 0 } },
		{ nom: 'Protéine whey (poudre)', valeurs: { calories: 400, proteines: 80, glucides: 8, lipides: 6 } },
		{ nom: 'Lait d\'avoine', valeurs: { calories: 44, proteines: 0.3, glucides: 6.7, lipides: 1.5 } },
	],
};

/** Liste des catégories disponibles (pour les selects) */
export const categories = Object.keys(foodDatabase);

/** Liste complète incluant "Autre" */
export const categoriesAvecAutre = [...categories, 'Autre'];
