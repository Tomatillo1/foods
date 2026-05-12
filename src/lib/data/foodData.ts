/**
 * Base de données des aliments classés par catégorie.
 * Chaque aliment contient ses valeurs nutritionnelles pour 100g.
 * Facilement modifiable : ajouter/supprimer des entrées dans chaque catégorie.
 */

import type { Food } from "$lib/types";

/** Structure complète du catalogue d'aliments par catégorie */
export const foodDatabase: Record<string, Food[]> = {
  Légumes: [
    {
      nom: "Maïs",
      valeurs: { calories: 73, proteines: 2.7, glucides: 11, lipides: 1.4 },
    },
    {
      nom: "Carotte",
      valeurs: { calories: 41, proteines: 0.9, glucides: 7.6, lipides: 0.2 },
    },
    {
      nom: "Aubergine",
      valeurs: { calories: 25, proteines: 1.0, glucides: 4.9, lipides: 0.2 },
    },
    {
      nom: "Concombre",
      valeurs: { calories: 14, proteines: 0.7, glucides: 2.4, lipides: 0.2 },
    },
    {
      nom: "Tomate",
      valeurs: { calories: 18, proteines: 0.9, glucides: 2.6, lipides: 0.2 },
    },
    {
      nom: "Courgette",
      valeurs: { calories: 17, proteines: 1.2, glucides: 3.1, lipides: 0.3 },
    },
    {
      nom: "Avocat",
      valeurs: { calories: 160, proteines: 2.0, glucides: 1.8, lipides: 14.7 },
    },
    {
      nom: "Poivron rouge",
      valeurs: { calories: 31, proteines: 1.0, glucides: 4.6, lipides: 0.3 },
    },
    {
      nom: "Salade (laitue)",
      valeurs: { calories: 15, proteines: 1.4, glucides: 2.9, lipides: 0.2 },
    },
    {
      nom: "Champignon de Paris",
      valeurs: { calories: 22, proteines: 3.1, glucides: 3.3, lipides: 0.3 },
    },
    {
      nom: "Oignon",
      valeurs: { calories: 40, proteines: 1.1, glucides: 8.3, lipides: 0.1 },
    },
    {
      nom: "Butternut",
      valeurs: { calories: 45, proteines: 1.0, glucides: 10.5, lipides: 0.1 },
    },
    {
      nom: "Asperge",
      valeurs: { calories: 20, proteines: 2.2, glucides: 3.9, lipides: 0.1 },
    },
    {
      nom: "Chou-fleur",
      valeurs: { calories: 25, proteines: 1.9, glucides: 4.9, lipides: 0.3 },
    },
    {
      nom: "Haricot vert",
      valeurs: { calories: 31, proteines: 1.8, glucides: 6.9, lipides: 0.1 },
    },
    {
      nom: "Lentille",
      valeurs: { calories: 353, proteines: 24.6, glucides: 63.4, lipides: 1.1 },
    },
    {
      nom: "Petit pois",
      valeurs: { calories: 81, proteines: 5.4, glucides: 14.5, lipides: 0.4 },
    },
  ],

  Fruits: [
    {
      nom: "Banane",
      valeurs: { calories: 89, proteines: 1.1, glucides: 20.5, lipides: 0.3 },
    },
    {
      nom: "Abricot",
      valeurs: { calories: 48, proteines: 1.4, glucides: 9.0, lipides: 0.4 },
    },
    {
      nom: "Pomme",
      valeurs: { calories: 52, proteines: 0.3, glucides: 11.6, lipides: 0.2 },
    },
    {
      nom: "Poire",
      valeurs: { calories: 57, proteines: 0.4, glucides: 12.4, lipides: 0.1 },
    },
    {
      nom: "Pêche",
      valeurs: { calories: 39, proteines: 0.9, glucides: 8.3, lipides: 0.3 },
    },
    {
      nom: "Melon",
      valeurs: { calories: 34, proteines: 0.8, glucides: 7.9, lipides: 0.2 },
    },
    {
      nom: "Pastèque",
      valeurs: { calories: 30, proteines: 0.6, glucides: 6.0, lipides: 0.2 },
    },
    {
      nom: "Raisin",
      valeurs: { calories: 69, proteines: 0.7, glucides: 15.5, lipides: 0.2 },
    },
    {
      nom: "Fraise",
      valeurs: { calories: 32, proteines: 0.7, glucides: 6.0, lipides: 0.3 },
    },
    {
      nom: "Framboise",
      valeurs: { calories: 52, proteines: 1.2, glucides: 5.6, lipides: 0.7 },
    },
    {
      nom: "Myrtille",
      valeurs: { calories: 57, proteines: 0.7, glucides: 10.0, lipides: 0.3 },
    },
    {
      nom: "Mandarine",
      valeurs: { calories: 53, proteines: 0.8, glucides: 11.7, lipides: 0.3 },
    },
    {
      nom: "Orange",
      valeurs: { calories: 47, proteines: 0.9, glucides: 8.3, lipides: 0.1 },
    },
    {
      nom: "Mangue",
      valeurs: { calories: 60, proteines: 0.8, glucides: 13.7, lipides: 0.4 },
    },
    {
      nom: "Kiwi",
      valeurs: { calories: 61, proteines: 1.1, glucides: 11.7, lipides: 0.5 },
    },
    {
      nom: "Ananas",
      valeurs: { calories: 50, proteines: 0.5, glucides: 12.0, lipides: 0.1 },
    },
    {
      nom: "Prune",
      valeurs: { calories: 46, proteines: 0.7, glucides: 10.0, lipides: 0.3 },
    },
  ],

  Féculents: [
    {
      nom: "Pates",
      valeurs: { calories: 356, proteines: 14.5, glucides: 69.5, lipides: 1.6 },
    },
    {
      nom: "Riz",
      valeurs: { calories: 353, proteines: 8, glucides: 78, lipides: 0.8 },
    },
    {
      nom: "Farine",
      valeurs: { calories: 337, proteines: 9.4, glucides: 71, lipides: 1.1 },
    },
    {
      nom: "Patate douce",
      valeurs: { calories: 86, proteines: 1.6, glucides: 20.1, lipides: 0.1 },
    },
    {
      nom: "Pomme de terre",
      valeurs: { calories: 77, proteines: 2.0, glucides: 17.0, lipides: 0.1 },
    },
    {
      nom: "Pain petit épeautre",
      valeurs: { calories: 240, proteines: 9.5, glucides: 46, lipides: 2.5 },
    },
    {
      nom: "Pain (baguette)",
      valeurs: { calories: 270, proteines: 8.5, glucides: 57, lipides: 1.2 },
    },
    {
      nom: "Semoule",
      valeurs: { calories: 361, proteines: 13, glucides: 72, lipides: 1.8 },
    },
  ],

  Protéine: [
    {
      nom: "Thon",
      valeurs: { calories: 109, proteines: 25, glucides: 0, lipides: 1 },
    },
    {
      nom: "Oeufs",
      valeurs: { calories: 140, proteines: 13, glucides: 0, lipides: 9.8 },
    },
    {
      nom: "Filet de poulet",
      valeurs: { calories: 110, proteines: 23, glucides: 0, lipides: 1.5 },
    },
    {
      nom: "Steak haché 5%",
      valeurs: { calories: 137, proteines: 21, glucides: 0, lipides: 5 },
    },
    {
      nom: "Pavé de saumon",
      valeurs: { calories: 208, proteines: 20, glucides: 0, lipides: 13 },
    },
    {
      nom: "Rôti de porc",
      valeurs: { calories: 143, proteines: 21, glucides: 0, lipides: 6 },
    },
    {
      nom: "Rôti de porc (froid)",
      valeurs: { calories: 170, proteines: 27, glucides: 0, lipides: 7 },
    },
    {
      nom: "Jambon blanc",
      valeurs: { calories: 110, proteines: 20, glucides: 1.5, lipides: 3 },
    },
  ],

  Laitages: [
    {
      nom: "Fromage blanc (3%)",
      valeurs: { calories: 82, proteines: 5.7, glucides: 6.6, lipides: 3.2 },
    },
    {
      nom: "Parmesan",
      valeurs: { calories: 402, proteines: 32, glucides: 0, lipides: 30 },
    },
  ],

  Sucreries: [
    {
      nom: "Miel",
      valeurs: { calories: 304, proteines: 0.3, glucides: 82, lipides: 0 },
    },
    {
      nom: "Chocolat noir (53%)",
      valeurs: { calories: 548, proteines: 6, glucides: 50.7, lipides: 34 },
    },
    {
      nom: "Beurre de cacahuète",
      valeurs: { calories: 628, proteines: 27, glucides: 12, lipides: 51 },
    },
  ],

  Boissons: [
    {
      nom: "Lait d’avoine",
      valeurs: { calories: 45, proteines: 0.5, glucides: 7, lipides: 1.5 },
    },
    {
      nom: "Coca",
      valeurs: { calories: 42, proteines: 0, glucides: 10.6, lipides: 0 },
    },
    {
      nom: "Coca (0%)",
      valeurs: { calories: 0.3, proteines: 0, glucides: 0, lipides: 0 },
    },
  ],

  Sauces: [
    {
      nom: "Sauce tomate",
      valeurs: { calories: 27, proteines: 1.2, glucides: 4.5, lipides: 0.5 },
    },
    {
      nom: "Crème de coco",
      valeurs: { calories: 247, proteines: 2.6, glucides: 3.6, lipides: 25 },
    },
  ],
};

/** Liste des catégories disponibles (pour les selects) */
export const categories = Object.keys(foodDatabase);

/** Liste complète incluant "Autre" */
export const categoriesAvecAutre = [...categories, "Autre"];
