<!--
  Page Historique - Affiche l'historique nutritionnel de la semaine.
  Liste les 7 jours avec leurs totaux (calories, protéines, glucides, lipides).
  Bouton Reset pour remettre toute la semaine à zéro (avec confirmation).
-->
<script lang="ts">
	import { RotateCcw } from 'lucide-svelte';
	import { weekHistory } from '$lib/stores';
	import type { JourSemaine } from '$lib/types';

	/** Liste ordonnée des jours de la semaine */
	const jours: { cle: JourSemaine; label: string }[] = [
		{ cle: 'lundi', label: 'Lundi' },
		{ cle: 'mardi', label: 'Mardi' },
		{ cle: 'mercredi', label: 'Mercredi' },
		{ cle: 'jeudi', label: 'Jeudi' },
		{ cle: 'vendredi', label: 'Vendredi' },
		{ cle: 'samedi', label: 'Samedi' },
		{ cle: 'dimanche', label: 'Dimanche' }
	];

	/** Confirmation avant reset */
	let confirmReset = $state(false);

	/** Réinitialise toute la semaine */
	function resetSemaine() {
		if (!confirmReset) {
			confirmReset = true;
			return;
		}
		weekHistory.reset();
		confirmReset = false;
	}

	/** Annule la confirmation */
	function annulerReset() {
		confirmReset = false;
	}
</script>

<div class="history-page">
	<!-- En-tête avec Logo -->
	<header class="header">
		<div class="logo-container">
			<span class="logo-text">Nutri<span class="logo-highlight">Track</span></span>
		</div>
	</header>

	<div class="content-container">
		<div class="title-section">
			<div class="title-left">
				<p class="subtitle">Aperçu</p>
				<h1 class="page-title">Historique Hebdomadaire</h1>
			</div>
			
			<!-- Bouton Reset -->
			<div class="reset-wrapper">
				{#if confirmReset}
					<div class="confirm-actions">
						<button onclick={annulerReset} class="btn-cancel">Non</button>
						<button onclick={resetSemaine} class="btn-reset-confirm">Oui</button>
					</div>
				{:else}
					<button onclick={resetSemaine} class="btn-reset">
						<RotateCcw size={16} />
						<span>Reset</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Liste des jours -->
		<div class="days-list">
			{#each jours as { cle, label }, i}
				{@const jour = $weekHistory[cle]}
				<div class="day-card" style="animation-delay: {i * 60}ms">
					<div class="card-header">
						<h3 class="day-label">{label}</h3>
						<div class="calories-info">
							<span class="calories-value">{jour.calories}</span>
							<span class="calories-unit">kcal</span>
						</div>
					</div>

					<div class="card-stats">
						<div class="stat-row">
							<span class="stat-label">Protéines</span>
							<span class="stat-value">{jour.proteines}g</span>
						</div>
						<div class="stat-row">
							<span class="stat-label">Glucides</span>
							<span class="stat-value">{jour.glucides}g</span>
						</div>
						<div class="stat-row">
							<span class="stat-label">Lipides</span>
							<span class="stat-value" class:over={jour.lipides > 80}>{jour.lipides}g</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.history-page {
		padding: 20px 0;
		animation: fadeIn 0.4s ease-out;
	}

	.header {
		padding: 0 20px;
		margin-bottom: 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo-text {
		font-size: 24px;
		font-weight: 800;
		color: #15803d;
		letter-spacing: -0.5px;
	}

	.logo-highlight {
		color: #16a34a;
	}

	.content-container {
		padding: 0 20px;
	}

	.title-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 24px;
	}

	.subtitle {
		font-size: 13px;
		font-weight: 600;
		color: #16a34a;
		margin-bottom: 4px;
	}

	.page-title {
		font-size: 24px;
		font-weight: 700;
		color: #111827;
		line-height: 1.2;
	}

	.btn-reset {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #fee2e2;
		color: #ef4444;
		border: none;
		padding: 8px 14px;
		border-radius: 10px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-reset:active {
		transform: scale(0.95);
	}

	.confirm-actions {
		display: flex;
		gap: 8px;
	}

	.btn-cancel {
		background: #f3f4f6;
		color: #4b5563;
		border: none;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-reset-confirm {
		background: #ef4444;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.days-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.day-card {
		background: white;
		border-radius: 20px;
		padding: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
		border: 1px solid #f3f4f6;
		animation: slideIn 0.4s ease-out both;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.day-label {
		font-size: 18px;
		font-weight: 700;
		color: #1f2937;
	}

	.calories-info {
		display: flex;
		align-items: baseline;
		gap: 4px;
	}

	.calories-value {
		font-size: 20px;
		font-weight: 800;
		color: #166534;
	}

	.calories-unit {
		font-size: 12px;
		color: #6b7280;
		font-weight: 500;
	}

	.card-stats {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 16px;
		border-top: 1px solid #f9fafb;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat-label {
		font-size: 12px;
		color: #6b7280;
		font-weight: 500;
	}

	.stat-value {
		font-size: 14px;
		font-weight: 700;
		color: #1f2937;
	}

	.stat-value.over {
		color: #ef4444;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateY(15px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>


