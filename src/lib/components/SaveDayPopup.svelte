<!--
  Popup de sauvegarde des données du jour.
  Permet de choisir un jour de la semaine (lundi → dimanche)
  et d'y sauvegarder les totaux nutritionnels du jour.
-->
<script lang="ts">
	import { X, Save } from 'lucide-svelte';
	import { weekHistory, todayTotals } from '$lib/stores';
	import type { JourSemaine } from '$lib/types';

	/** Props du composant */
	interface Props {
		visible: boolean;
		onClose: () => void;
	}

	let { visible, onClose }: Props = $props();

	/** Jour sélectionné */
	let jourSelectionne = $state<JourSemaine>('lundi');

	/** Liste des jours de la semaine */
	const jours: JourSemaine[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

	/** Confirme la sauvegarde */
	let sauvegarde = $state(false);

	/** Sauvegarde les totaux dans le jour sélectionné */
	function sauvegarder() {
		const totaux = {
			calories: Math.round($todayTotals.calories),
			proteines: Math.round($todayTotals.proteines),
			glucides: Math.round($todayTotals.glucides),
			lipides: Math.round($todayTotals.lipides)
		};

		weekHistory.sauvegarderJour(jourSelectionne, totaux);
		sauvegarde = true;

		// Feedback visuel, puis fermeture
		setTimeout(() => {
			sauvegarde = false;
			onClose();
		}, 800);
	}
</script>

{#if visible}
	<!-- Overlay sombre -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		onclick={onClose}
	>
		<!-- Contenu du popup -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-white w-full max-w-md rounded-2xl p-6 animate-popup"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- En-tête -->
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-lg font-semibold text-gray-800">Sauvegarder le jour</h3>
				<button
					type="button"
					onclick={onClose}
					class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
				>
					<X size={20} class="text-gray-400" />
				</button>
			</div>

			<!-- Résumé des totaux du jour -->
			<div class="bg-green-50 rounded-xl p-3 mb-4">
				<p class="text-xs text-gray-500 mb-2">Totaux du jour :</p>
				<div class="grid grid-cols-4 gap-2 text-center">
					<div>
						<p class="text-sm font-bold text-gray-800">{Math.round($todayTotals.calories)}</p>
						<p class="text-[10px] text-gray-400">kcal</p>
					</div>
					<div>
						<p class="text-sm font-bold text-gray-800">{Math.round($todayTotals.proteines)}g</p>
						<p class="text-[10px] text-gray-400">Prot.</p>
					</div>
					<div>
						<p class="text-sm font-bold text-gray-800">{Math.round($todayTotals.glucides)}g</p>
						<p class="text-[10px] text-gray-400">Gluc.</p>
					</div>
					<div>
						<p class="text-sm font-bold text-gray-800">{Math.round($todayTotals.lipides)}g</p>
						<p class="text-[10px] text-gray-400">Lip.</p>
					</div>
				</div>
			</div>

			<!-- Sélection du jour -->
			<div class="mb-4">
				<label for="save-day-select" class="block text-xs font-medium text-gray-500 mb-2">Choisir le jour :</label>
				<div class="grid grid-cols-4 gap-2">
					{#each jours as jour}
						<button
							type="button"
							onclick={() => jourSelectionne = jour}
							class="py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200
								   {jour === jourSelectionne
								     ? 'bg-green-main text-white shadow-md'
								     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
						>
							{jour.charAt(0).toUpperCase() + jour.slice(1, 3)}.
						</button>
					{/each}
				</div>
			</div>

			<!-- Bouton de sauvegarde -->
			<button
				type="button"
				onclick={sauvegarder}
				disabled={sauvegarde}
				class="w-full mt-6 py-3 bg-green-main text-white font-semibold rounded-xl
					   hover:bg-green-dark active:scale-[0.98]
					   disabled:opacity-60
					   transition-all duration-200 flex items-center justify-center gap-2"
			>
				{#if sauvegarde}
					<span>✓ Sauvegardé !</span>
				{:else}
					<Save size={18} />
					<span>Sauvegarder</span>
				{/if}
			</button>
		</div>
	</div>
{/if}
