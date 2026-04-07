<!--
  Page Accueil - Page principale de l'application.
  Composée de 4 zones :
  1. Formulaire d'ajout d'aliment (haut)
  2. Historique du jour (liste, milieu)
  3. Compteurs nutritionnels (droite/milieu)
  4. Résumé restant (bas)
-->
<script lang="ts">
	import { Trash2, Plus, ChevronDown, BookmarkPlus } from 'lucide-svelte';
	import {
		todayEntries,
		todayTotals,
		caloriesRestantes,
		proteinesRestantes
	} from '$lib/stores';
	import { foodDatabase, categoriesAvecAutre } from '$lib/data/foodData';
	import type { Food } from '$lib/types';
	import CustomFoodPopup from './CustomFoodPopup.svelte';
	import SaveDayPopup from './SaveDayPopup.svelte';

	// ==========================================
	// État du formulaire
	// ==========================================

	/** Catégorie sélectionnée */
	let categorieSelectionnee = $state('');
	/** Produit sélectionné dans la catégorie */
	let produitSelectionne = $state('');
	/** Quantité en grammes */
	let quantite = $state<number | ''>('');

	/** Affichage des popups */
	let showCustomPopup = $state(false);
	let showSavePopup = $state(false);

	// ==========================================
	// Données dérivées
	// ==========================================

	/** Liste des produits de la catégorie sélectionnée */
	let produitsDisponibles = $derived<Food[]>(
		categorieSelectionnee && categorieSelectionnee !== 'Autre'
			? foodDatabase[categorieSelectionnee] || []
			: []
	);

	/** Le produit actuellement sélectionné (objet Food) */
	let produitActuel = $derived<Food | null>(
		produitsDisponibles.find((p) => p.nom === produitSelectionne) || null
	);

	/** Vérifie si le formulaire est prêt à être validé */
	let formulaireValide = $derived(
		categorieSelectionnee !== '' &&
		categorieSelectionnee !== 'Autre' &&
		produitSelectionne !== '' &&
		Number(quantite) > 0
	);

	// ==========================================
	// Handlers
	// ==========================================

	/** Quand la catégorie change */
	function onCategorieChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		categorieSelectionnee = target.value;
		produitSelectionne = '';
		quantite = '';

		// Si "Autre", ouvrir le popup personnalisé
		if (categorieSelectionnee === 'Autre') {
			showCustomPopup = true;
		}
	}

	/** Quand le produit change */
	function onProduitChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		produitSelectionne = target.value;
	}

	/** Validation du formulaire classique */
	function validerFormulaire() {
		if (!formulaireValide || !produitActuel) return;

		const q = Number(quantite);
		const ratio = q / 100;

		// Calcul proportionnel basé sur les valeurs pour 100g
		todayEntries.ajouter({
			nom: produitActuel.nom,
			quantite: q,
			calories: Math.round(produitActuel.valeurs.calories * ratio),
			proteines: Math.round(produitActuel.valeurs.proteines * ratio * 10) / 10,
			glucides: Math.round(produitActuel.valeurs.glucides * ratio * 10) / 10,
			lipides: Math.round(produitActuel.valeurs.lipides * ratio * 10) / 10
		});

		// Reset du formulaire
		categorieSelectionnee = '';
		produitSelectionne = '';
		quantite = '';
	}

	/** Validation depuis le popup personnalisé */
	function onCustomValidate(data: { nom: string; calories: number; proteines: number; glucides: number; lipides: number }) {
		todayEntries.ajouter({
			nom: data.nom,
			quantite: 0, // Pas de quantité pour un aliment custom
			calories: data.calories,
			proteines: data.proteines,
			glucides: data.glucides,
			lipides: data.lipides
		});

		// Reset catégorie après ajout custom
		categorieSelectionnee = '';
	}

	/** Suppression d'une entrée */
	function supprimerEntree(id: string) {
		todayEntries.supprimer(id);
	}
</script>

<div class="px-5 py-6 space-y-6 animate-fade-in-up sm:px-6 sm:py-8 sm:space-y-8">
	<!-- ==========================================
	     ZONE 1 : Formulaire d'ajout
	     ========================================== -->
	<section class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sm:p-6">
		<h2 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
			<Plus size={16} class="text-green-main" />
			Ajouter un aliment
		</h2>

		<div class="space-y-3">
			<!-- Sélection de la catégorie -->
			<div class="relative">
				<select
					id="select-categorie"
					value={categorieSelectionnee}
					onchange={onCategorieChange}
					class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
						   appearance-none cursor-pointer
						   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
						   transition-all"
				>
					<option value="" disabled>Catégorie...</option>
					{#each categoriesAvecAutre as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
				<ChevronDown size={16} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
			</div>

			<!-- Sélection du produit (désactivé si pas de catégorie ou si "Autre") -->
			<div class="relative">
				<select
					id="select-produit"
					value={produitSelectionne}
					onchange={onProduitChange}
					disabled={!categorieSelectionnee || categorieSelectionnee === 'Autre'}
					class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
						   appearance-none cursor-pointer
						   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
						   disabled:opacity-50 disabled:cursor-not-allowed
						   transition-all"
				>
					<option value="" disabled>Produit...</option>
					{#each produitsDisponibles as produit}
						<option value={produit.nom}>{produit.nom}</option>
					{/each}
				</select>
				<ChevronDown size={16} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
			</div>

			<!-- Quantité + bouton valider -->
			<div class="flex gap-2">
				<input
					id="input-quantite"
					type="number"
					bind:value={quantite}
					placeholder="Grammes"
					min="1"
					disabled={!produitSelectionne}
					class="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
						   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
						   disabled:opacity-50 disabled:cursor-not-allowed
						   transition-all"
				/>
				<button
					id="btn-valider"
					onclick={validerFormulaire}
					disabled={!formulaireValide}
					class="px-5 py-2.5 bg-green-main text-white font-semibold rounded-xl text-sm
						   hover:bg-green-dark active:scale-95
						   disabled:opacity-40 disabled:cursor-not-allowed
						   transition-all duration-200"
				>
					Valider
				</button>
			</div>

			<!-- Aperçu nutritionnel si produit sélectionné -->
			{#if produitActuel && Number(quantite) > 0}
				{@const ratio = Number(quantite) / 100}
				<div class="bg-green-50 rounded-xl p-2.5 flex justify-around text-center animate-fade-in">
					<div>
						<p class="text-xs font-bold text-gray-700">{Math.round(produitActuel.valeurs.calories * ratio)}</p>
						<p class="text-[10px] text-gray-400">kcal</p>
					</div>
					<div>
						<p class="text-xs font-bold text-gray-700">{(produitActuel.valeurs.proteines * ratio).toFixed(1)}g</p>
						<p class="text-[10px] text-gray-400">Prot.</p>
					</div>
					<div>
						<p class="text-xs font-bold text-gray-700">{(produitActuel.valeurs.glucides * ratio).toFixed(1)}g</p>
						<p class="text-[10px] text-gray-400">Gluc.</p>
					</div>
					<div>
						<p class="text-xs font-bold text-gray-700">{(produitActuel.valeurs.lipides * ratio).toFixed(1)}g</p>
						<p class="text-[10px] text-gray-400">Lip.</p>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- ==========================================
	     ZONE 3 : Compteurs nutritionnels
	     ========================================== -->
	<section class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sm:p-6">
		<h2 class="text-sm font-semibold text-gray-700 mb-3">📊 Totaux du jour</h2>

		<div class="grid grid-cols-4 gap-2 text-center">
			<!-- Calories -->
			<div class="bg-orange-50 rounded-xl p-2.5">
				<p class="text-lg font-bold text-orange-600">{Math.round($todayTotals.calories)}</p>
				<p class="text-[10px] text-gray-400 font-medium">kcal</p>
			</div>
			<!-- Protéines -->
			<div class="bg-blue-50 rounded-xl p-2.5">
				<p class="text-lg font-bold text-blue-600">{Math.round($todayTotals.proteines)}</p>
				<p class="text-[10px] text-gray-400 font-medium">Prot. (g)</p>
			</div>
			<!-- Glucides -->
			<div class="bg-amber-50 rounded-xl p-2.5">
				<p class="text-lg font-bold text-amber-600">{Math.round($todayTotals.glucides)}</p>
				<p class="text-[10px] text-gray-400 font-medium">Gluc. (g)</p>
			</div>
			<!-- Lipides -->
			<div class="bg-purple-50 rounded-xl p-2.5">
				<p class="text-lg font-bold text-purple-600">{Math.round($todayTotals.lipides)}</p>
				<p class="text-[10px] text-gray-400 font-medium">Lip. (g)</p>
			</div>
		</div>

		<!-- Bouton sauvegarder le jour -->
		<button
			onclick={() => showSavePopup = true}
			class="w-full mt-3 py-2.5 bg-green-50 text-green-main font-medium rounded-xl text-sm
				   border border-green-100
				   hover:bg-green-100 active:scale-[0.98]
				   transition-all duration-200 flex items-center justify-center gap-2"
		>
			<BookmarkPlus size={16} />
			Sauvegarder ce jour
		</button>
	</section>

	<!-- ==========================================
	     ZONE 4 : Résumé restant (objectifs)
	     ========================================== -->
	<section class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sm:p-6">
		<div class="grid grid-cols-2 gap-3">
			<!-- Calories restantes -->
			<div class="text-center p-3 rounded-xl {$caloriesRestantes.depasse ? 'bg-red-light' : 'bg-green-50'}">
				<p class="text-[10px] uppercase tracking-wide font-medium {$caloriesRestantes.depasse ? 'text-red-alert' : 'text-gray-400'}">
					Calories restantes
				</p>
				<p class="text-2xl font-bold mt-1 {$caloriesRestantes.depasse ? 'text-red-alert' : 'text-green-dark'}">
					{$caloriesRestantes.depasse ? '0' : $caloriesRestantes.valeur}
				</p>
				<p class="text-[10px] {$caloriesRestantes.depasse ? 'text-red-alert' : 'text-gray-400'}">
					/ 2250 kcal
				</p>
				{#if $caloriesRestantes.depasse}
					<p class="text-[10px] text-red-alert font-semibold mt-1">⚠ Dépassé !</p>
				{/if}
			</div>

			<!-- Protéines restantes -->
			<div class="text-center p-3 rounded-xl {$proteinesRestantes.depasse ? 'bg-red-light' : 'bg-blue-50'}">
				<p class="text-[10px] uppercase tracking-wide font-medium {$proteinesRestantes.depasse ? 'text-red-alert' : 'text-gray-400'}">
					Protéines restantes
				</p>
				<p class="text-2xl font-bold mt-1 {$proteinesRestantes.depasse ? 'text-red-alert' : 'text-blue-600'}">
					{$proteinesRestantes.depasse ? '0' : $proteinesRestantes.valeur}
				</p>
				<p class="text-[10px] {$proteinesRestantes.depasse ? 'text-red-alert' : 'text-gray-400'}">
					/ 130g
				</p>
				{#if $proteinesRestantes.depasse}
					<p class="text-[10px] text-red-alert font-semibold mt-1">⚠ Dépassé !</p>
				{/if}
			</div>
		</div>
	</section>

	<!-- ==========================================
	     ZONE 2 : Historique du jour
	     ========================================== -->
	<section class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sm:p-6">
		<h2 class="text-sm font-semibold text-gray-700 mb-3">🍽️ Historique du jour</h2>

		{#if $todayEntries.length === 0}
			<p class="text-center text-sm text-gray-400 py-6">
				Aucun aliment ajouté aujourd'hui
			</p>
		{:else}
			<div class="space-y-2">
				{#each $todayEntries as entry (entry.id)}
					<div class="flex items-center justify-between bg-gray-50 rounded-xl p-3 animate-slide-in">
						<!-- Infos aliment -->
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-gray-700 truncate">{entry.nom}</p>
							<div class="flex items-center gap-2 mt-0.5">
								{#if entry.quantite > 0}
									<span class="text-[10px] text-gray-400">{entry.quantite}g</span>
									<span class="text-[10px] text-gray-300">•</span>
								{/if}
								<span class="text-[10px] text-orange-500 font-medium">{entry.calories} kcal</span>
								<span class="text-[10px] text-blue-500">P:{entry.proteines}g</span>
								<span class="text-[10px] text-amber-500">G:{entry.glucides}g</span>
								<span class="text-[10px] text-purple-500">L:{entry.lipides}g</span>
							</div>
						</div>

						<!-- Bouton suppression -->
						<button
							onclick={() => supprimerEntree(entry.id)}
							class="p-2 rounded-lg hover:bg-red-50 transition-colors group ml-2 flex-shrink-0"
						>
							<Trash2 size={16} class="text-gray-300 group-hover:text-red-alert transition-colors" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<!-- Popups -->
<CustomFoodPopup
	visible={showCustomPopup}
	onClose={() => { showCustomPopup = false; categorieSelectionnee = ''; }}
	onValidate={onCustomValidate}
/>

<SaveDayPopup
	visible={showSavePopup}
	onClose={() => showSavePopup = false}
/>
