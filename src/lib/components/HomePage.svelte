<!--
  Page Accueil - Page principale de l'application.
  Design fidèle au mockup fourni.
-->
<script lang="ts">
	import {
		Trash2,
		PlusCircle,
		ChevronDown,
		Calendar,
		Droplet,
		Leaf
	} from 'lucide-svelte';
	import {
		todayEntries,
		todayTotals,
		caloriesRestantes,
		proteinesRestantes,
		OBJECTIFS
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

	/** Jour actuel formaté */
	let jourActuel = $derived(() => {
		const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
		const now = new Date();
		return jours[now.getDay()];
	});

	/** Pourcentage calories consommées */
	let caloriePourcentage = $derived(
		Math.min(100, ($todayTotals.calories / OBJECTIFS.calories) * 100)
	);

	/** Pourcentage protéines consommées */
	let proteinePourcentage = $derived(
		Math.min(100, ($todayTotals.proteines / OBJECTIFS.proteines) * 100)
	);

	/** Valeurs calculées en temps réel pour l'aperçu */
	let apercuValeurs = $derived(() => {
		if (!produitActuel || !quantite || Number(quantite) <= 0) return null;
		const q = Number(quantite);
		const ratio = q / 100;
		return {
			calories: Math.round(produitActuel.valeurs.calories * ratio),
			proteines: Math.round(produitActuel.valeurs.proteines * ratio * 10) / 10
		};
	});

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

<div class="home-page">
	<!-- ==========================================
	     EN-TÊTE : NutriTrack
	     ========================================== -->
	<header class="home-header">
		<h1 class="header-title">NutriTrack</h1>
	</header>

	<!-- ==========================================
	     ZONE 1 : Formulaire d'ajout rapide
	     ========================================== -->
	<section class="card card-form">
		<h2 class="card-title-large">Ajout rapide</h2>

		<div class="form-group">
			<!-- Catégorie -->
			<div class="field">
				<label for="select-categorie" class="field-label">Catégorie</label>
				<div class="select-wrapper">
					<select
						id="select-categorie"
						value={categorieSelectionnee}
						onchange={onCategorieChange}
					>
						<option value="" disabled>Sélectionner...</option>
						{#each categoriesAvecAutre as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
					<ChevronDown size={18} class="select-chevron" />
				</div>
			</div>

			<!-- Produit -->
			<div class="field">
				<label for="select-produit" class="field-label">Produit</label>
				<div class="select-wrapper">
					<select
						id="select-produit"
						value={produitSelectionne}
						onchange={onProduitChange}
						disabled={!categorieSelectionnee || categorieSelectionnee === 'Autre'}
					>
						<option value="" disabled>Ex: Avocat</option>
						{#each produitsDisponibles as produit}
							<option value={produit.nom}>{produit.nom}</option>
						{/each}
					</select>
					<ChevronDown size={18} class="select-chevron" />
				</div>
			</div>

			<!-- Quantité -->
			<div class="field">
				<label for="input-quantite" class="field-label">Quantité (g)</label>
				<input
					id="input-quantite"
					type="number"
					bind:value={quantite}
					placeholder="0"
					min="1"
					disabled={!produitSelectionne}
				/>

				<!-- Résultat dynamique -->
				{#if apercuValeurs()}
					<div class="dynamic-result animate-fade-in">
						<span>Total : <strong>{apercuValeurs()?.calories} kcal</strong></span>
						<span class="dot">•</span>
						<span><strong>{apercuValeurs()?.proteines}g</strong> P</span>
					</div>
				{/if}
			</div>

			<!-- Bouton Valider -->
			<button
				id="btn-valider"
				class="btn-valider"
				onclick={validerFormulaire}
				disabled={!formulaireValide}
			>
				<PlusCircle size={18} />
				Valider
			</button>
		</div>
	</section>

	<!-- ==========================================
	     ZONE 2 : Compteurs nutritionnels (4 cards)
	     ========================================== -->
	<section class="nutrition-grid">
		<!-- Calories -->
		<div class="nutrition-card card-calories">
			<span class="pill-label">Calories</span>
			<span class="pill-value value-green">{Math.round($todayTotals.calories)}</span>
			<span class="pill-unit">kcal</span>
		</div>
		<!-- Protéines -->
		<div class="nutrition-card">
			<span class="pill-label">Protéines</span>
			<span class="pill-value">{Math.round($todayTotals.proteines)}g</span>
		</div>
		<!-- Glucides -->
		<div class="nutrition-card">
			<span class="pill-label">Glucides</span>
			<span class="pill-value">{Math.round($todayTotals.glucides)}g</span>
		</div>
		<!-- Lipides -->
		<div class="nutrition-card">
			<span class="pill-label">Lipides</span>
			<span class="pill-value">{Math.round($todayTotals.lipides)}g</span>
		</div>
	</section>

	<!-- ==========================================
	     ZONE 3 : Sélecteur de jour
	     ========================================== -->
	<button
		class="day-selector"
		onclick={() => showSavePopup = true}
	>
		<div class="day-selector-left">
			<Calendar size={18} class="day-icon" />
			<span>Sauvegarder le jour</span>
		</div>
		<ChevronDown size={18} class="day-chevron" />
	</button>

	<!-- ==========================================
	     ZONE 4 : Historique du jour
	     ========================================== -->
	<section class="history-section">
		<div class="history-header">
			<h2 class="section-title">Historique du jour</h2>
			<button class="btn-voir-tout">Voir tout</button>
		</div>

		{#if $todayEntries.length === 0}
			<div class="card empty-card">
				<p class="empty-history">Aucun aliment ajouté aujourd'hui</p>
			</div>
		{:else}
			<div class="history-list">
				{#each $todayEntries as entry, i (entry.id)}
					<div class="history-item">
						<!-- Icône circulaire -->
						<div class="history-icon">
							{#if i % 2 === 0}
								<Droplet size={18} />
							{:else}
								<Leaf size={18} />
							{/if}
						</div>

						<!-- Infos aliment -->
						<div class="history-info">
							<p class="history-name">{entry.nom}</p>
							<p class="history-details">
								{#if entry.quantite > 0}
									{entry.quantite}g •
								{/if}
								{entry.calories} kcal • {entry.proteines}g P
							</p>
						</div>

						<!-- Bouton suppression -->
						<button
							class="btn-delete"
							onclick={() => supprimerEntree(entry.id)}
							aria-label="Supprimer {entry.nom}"
						>
							<Trash2 size={18} />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- ==========================================
	     ZONE 5 : Résumé des objectifs
	     ========================================== -->
	<section class="card-objectifs">
		<h2 class="objectifs-title">Résumé des objectifs</h2>

		<!-- Calories restantes -->
		<div class="objectif-item">
			<div class="objectif-row">
				<span class="objectif-label">Calories restantes</span>
				<span class="objectif-value value-green">
					{$caloriesRestantes.depasse ? '0' : $caloriesRestantes.valeur} kcal
				</span>
			</div>
			<div class="progress-bar">
				<div
					class="progress-fill fill-green-dark"
					style="width: {caloriePourcentage}%"
				></div>
			</div>
		</div>

		<!-- Protéines restantes -->
		<div class="objectif-item">
			<div class="objectif-row">
				<span class="objectif-label">Protéines restantes</span>
				<span class="objectif-value value-red">
					{$proteinesRestantes.depasse ? '0' : $proteinesRestantes.valeur}g
				</span>
			</div>
			<div class="progress-bar">
				<div
					class="progress-fill fill-red"
					style="width: {proteinePourcentage}%"
				></div>
			</div>
		</div>
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

<style>
	/* ==========================================
	   Page Container
	   ========================================== */
	.home-page {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		background-color: #f8fafc;
		min-height: 100vh;
	}

	/* ==========================================
	   En-tête NutriTrack
	   ========================================== */
	.home-header {
		padding: 10px 0;
	}

	.header-title {
		font-size: 24px;
		font-weight: 800;
		color: #065f46; /* Vert foncé premium */
		letter-spacing: -0.5px;
	}

	/* ==========================================
	   Carte générique
	   ========================================== */
	.card {
		background: #fff;
		border-radius: 24px;
		padding: 24px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
		border: 1px solid rgba(0, 0, 0, 0.03);
	}

	/* ==========================================
	   Zone Ajout Rapide
	   ========================================== */
	.card-form {
		background: #fff;
	}

	.card-title-large {
		font-size: 19px;
		font-weight: 700;
		color: #111827;
		margin-bottom: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-size: 13px;
		font-weight: 500;
		color: #374151;
	}

	.select-wrapper {
		position: relative;
	}

	.select-wrapper select,
	.field input {
		width: 100%;
		padding: 12px 16px;
		background: #f8fafc;
		border: 1px solid #f1f5f9;
		border-radius: 12px;
		font-size: 14px;
		font-family: 'Poppins', sans-serif;
		color: #1f2937;
		appearance: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.select-wrapper select:focus,
	.field input:focus {
		outline: none;
		border-color: #10b981;
		background: #fff;
		box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05);
	}

	/* Résultat dynamique sous la quantité */
	.dynamic-result {
		margin-top: 8px;
		padding: 8px 12px;
		background: #f0fdf4;
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: #065f46;
		border: 1px dashed #bbf7d0;
	}

	.dynamic-result strong {
		font-weight: 700;
	}

	.dynamic-result .dot {
		color: #bbf7d0;
	}

	.select-wrapper :global(.select-chevron) {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: #9ca3af;
		pointer-events: none;
	}

	/* Bouton Valider */
	.btn-valider {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 14px;
		background: #065f46;
		color: #fff;
		font-size: 15px;
		font-weight: 600;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-top: 4px;
	}

	.btn-valider:hover:not(:disabled) {
		background: #047857;
		transform: translateY(-1px);
	}

	.btn-valider:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-valider:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* ==========================================
	   Nutrition Grid
	   ========================================== */
	.nutrition-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.nutrition-card {
		background: #e5e7eb; /* Gris clair par défaut */
		border-radius: 20px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.card-calories {
		background: #f0fdf4;
		border: 1px solid #dcfce7;
	}

	.pill-label {
		font-size: 12px;
		font-weight: 500;
		color: #4b5563;
	}

	.pill-value {
		font-size: 24px;
		font-weight: 800;
		color: #111827;
	}

	.value-green {
		color: #059669;
	}

	.pill-unit {
		font-size: 12px;
		color: #6b7280;
	}

	/* ==========================================
	   Day Selector
	   ========================================== */
	.day-selector {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #e5e7eb;
		border-radius: 16px;
		padding: 14px 20px;
		border: none;
		cursor: pointer;
		font-family: 'Poppins', sans-serif;
	}

	.day-selector-left {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 14px;
		font-weight: 500;
		color: #374151;
	}

	.day-icon {
		color: #059669;
	}

	.day-chevron {
		color: #6b7280;
	}

	/* ==========================================
	   History Section
	   ========================================== */
	.history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.section-title {
		font-size: 18px;
		font-weight: 700;
		color: #111827;
	}

	.btn-voir-tout {
		background: none;
		border: none;
		font-size: 14px;
		font-weight: 600;
		color: #059669;
		cursor: pointer;
		font-family: 'Poppins', sans-serif;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.history-item {
		display: flex;
		align-items: center;
		gap: 14px;
		background: #fff;
		border-radius: 20px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
	}

	.history-icon {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: #dcfce7;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #059669;
		flex-shrink: 0;
	}

	.history-info {
		flex: 1;
		min-width: 0;
	}

	.history-name {
		font-size: 14px;
		font-weight: 700;
		color: #111827;
	}

	.history-details {
		font-size: 12px;
		color: #6b7280;
		margin-top: 2px;
	}

	.btn-delete {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ef4444;
		background: none;
		border: none;
		cursor: pointer;
	}

	.empty-card {
		padding: 30px;
		text-align: center;
		color: #9ca3af;
		font-size: 14px;
	}

	/* ==========================================
	   Résumé des objectifs
	   ========================================== */
	.card-objectifs {
		background: #ecfdf5; /* Très léger vert */
		border-radius: 24px;
		padding: 24px;
		border: 1px solid #d1fae5;
	}

	.objectifs-title {
		font-size: 18px;
		font-weight: 700;
		color: #111827;
		margin-bottom: 20px;
	}

	.objectif-item {
		margin-bottom: 20px;
	}

	.objectif-item:last-child {
		margin-bottom: 0;
	}

	.objectif-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.objectif-label {
		font-size: 14px;
		color: #4b5563;
	}

	.objectif-value {
		font-size: 18px;
		font-weight: 800;
	}

	.value-red {
		color: #b91c1c;
	}

	.progress-bar {
		width: 100%;
		height: 10px;
		background: #f3f4f6;
		border-radius: 10px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 10px;
		transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.fill-green-dark {
		background: #065f46;
	}

	.fill-red {
		background: linear-gradient(90deg, #ef4444, #f87171);
	}
</style>
