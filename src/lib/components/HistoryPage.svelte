<!--
  Page Historique - Affiche l'historique nutritionnel de la semaine.
  Liste les 7 jours avec leurs totaux (calories, protéines, glucides, lipides).
  Bouton Reset pour remettre toute la semaine à zéro (avec confirmation).
-->
<script lang="ts">
	import { RotateCcw, Flame, Beef, Wheat, Droplets } from 'lucide-svelte';
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

	/** Vérifie si un jour a des données */
	function jourRempli(jour: JourSemaine): boolean {
		const d = $weekHistory[jour];
		return d.calories > 0 || d.proteines > 0 || d.glucides > 0 || d.lipides > 0;
	}
</script>

<div class="px-5 py-6 space-y-6 animate-fade-in-up sm:px-6 sm:py-8 sm:space-y-8">
	<!-- En-tête -->
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold text-gray-800">📅 Historique</h1>

		<!-- Bouton Reset -->
		{#if confirmReset}
			<div class="flex items-center gap-2">
				<button
					onclick={annulerReset}
					class="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg
						   hover:bg-gray-200 transition-all"
				>
					Annuler
				</button>
				<button
					onclick={resetSemaine}
					class="px-3 py-1.5 text-xs font-medium text-white bg-red-alert rounded-lg
						   hover:bg-red-500 active:scale-95 transition-all"
				>
					Confirmer
				</button>
			</div>
		{:else}
			<button
				onclick={resetSemaine}
				class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500
					   bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all"
			>
				<RotateCcw size={14} />
				Reset
			</button>
		{/if}
	</div>

	<!-- Liste des jours -->
	<div class="space-y-2">
		{#each jours as { cle, label }, i}
			{@const jour = $weekHistory[cle]}
			<div
				class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up sm:p-6"
				style="animation-delay: {i * 50}ms"
			>
				<!-- Nom du jour et indicateur -->
				<div class="flex items-center justify-between mb-2.5">
					<h3 class="text-sm font-semibold text-gray-700">{label}</h3>
					{#if jourRempli(cle)}
						<span class="w-2 h-2 rounded-full bg-green-main"></span>
					{:else}
						<span class="text-[10px] text-gray-300">—</span>
					{/if}
				</div>

				<!-- Valeurs nutritionnelles -->
				<div class="grid grid-cols-4 gap-2">
					<div class="flex items-center gap-1.5">
						<Flame size={12} class="text-orange-400" />
						<div>
							<p class="text-sm font-bold text-gray-700">{jour.calories}</p>
							<p class="text-[9px] text-gray-400">kcal</p>
						</div>
					</div>
					<div class="flex items-center gap-1.5">
						<Beef size={12} class="text-blue-400" />
						<div>
							<p class="text-sm font-bold text-gray-700">{jour.proteines}g</p>
							<p class="text-[9px] text-gray-400">Prot.</p>
						</div>
					</div>
					<div class="flex items-center gap-1.5">
						<Wheat size={12} class="text-amber-400" />
						<div>
							<p class="text-sm font-bold text-gray-700">{jour.glucides}g</p>
							<p class="text-[9px] text-gray-400">Gluc.</p>
						</div>
					</div>
					<div class="flex items-center gap-1.5">
						<Droplets size={12} class="text-purple-400" />
						<div>
							<p class="text-sm font-bold text-gray-700">{jour.lipides}g</p>
							<p class="text-[9px] text-gray-400">Lip.</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
