<!--
  Popup de saisie manuelle d'un aliment personnalisé.
  S'affiche quand la catégorie "Autre" est sélectionnée.
  Permet de saisir nom, calories, protéines, glucides, lipides manuellement.
-->
<script lang="ts">
	import { X } from 'lucide-svelte';

	/** Props du composant */
	interface Props {
		visible: boolean;
		onClose: () => void;
		onValidate: (data: { nom: string; calories: number; proteines: number; glucides: number; lipides: number }) => void;
	}

	let { visible, onClose, onValidate }: Props = $props();

	/** Champs du formulaire */
	let nom = $state('');
	let calories = $state<number | ''>('');
	let proteines = $state<number | ''>('');
	let glucides = $state<number | ''>('');
	let lipides = $state<number | ''>('');

	/** Réinitialise les champs */
	function resetChamps() {
		nom = '';
		calories = '';
		proteines = '';
		glucides = '';
		lipides = '';
	}

	/** Validation et soumission */
	function valider() {
		// Le nom et les calories sont obligatoires
		if (!nom.trim()) return;
		const cal = Number(calories) || 0;

		onValidate({
			nom: nom.trim(),
			calories: cal,
			proteines: Number(proteines) || 0,
			glucides: Number(glucides) || 0,
			lipides: Number(lipides) || 0
		});

		resetChamps();
		onClose();
	}

	/** Fermeture du popup */
	function fermer() {
		resetChamps();
		onClose();
	}
</script>

{#if visible}
	<!-- Overlay sombre -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
		onkeydown={(e) => e.key === 'Escape' && fermer()}
		onclick={fermer}
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
				<h3 class="text-lg font-semibold text-gray-800">Aliment personnalisé</h3>
				<button
					type="button"
					onclick={fermer}
					class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
				>
					<X size={20} class="text-gray-400" />
				</button>
			</div>

			<!-- Formulaire -->
			<div class="space-y-3">
				<!-- Nom de l'aliment -->
				<div>
					<label for="custom-nom" class="block text-xs font-medium text-gray-500 mb-1">Nom *</label>
					<input
						id="custom-nom"
						type="text"
						bind:value={nom}
						placeholder="Ex: Salade composée"
						class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
							   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
							   transition-all"
					/>
				</div>

				<!-- Grille 2x2 pour les macros -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="custom-cal" class="block text-xs font-medium text-gray-500 mb-1">Calories (kcal) *</label>
						<input
							id="custom-cal"
							type="number"
							bind:value={calories}
							placeholder="0"
							min="0"
							class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
								   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
								   transition-all"
						/>
					</div>
					<div>
						<label for="custom-prot" class="block text-xs font-medium text-gray-500 mb-1">Protéines (g)</label>
						<input
							id="custom-prot"
							type="number"
							bind:value={proteines}
							placeholder="0"
							min="0"
							class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
								   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
								   transition-all"
						/>
					</div>
					<div>
						<label for="custom-gluc" class="block text-xs font-medium text-gray-500 mb-1">Glucides (g)</label>
						<input
							id="custom-gluc"
							type="number"
							bind:value={glucides}
							placeholder="0"
							min="0"
							class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
								   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
								   transition-all"
						/>
					</div>
					<div>
						<label for="custom-lip" class="block text-xs font-medium text-gray-500 mb-1">Lipides (g)</label>
						<input
							id="custom-lip"
							type="number"
							bind:value={lipides}
							placeholder="0"
							min="0"
							class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
								   focus:outline-none focus:ring-2 focus:ring-green-main/30 focus:border-green-main
								   transition-all"
						/>
					</div>
				</div>
			</div>

			<!-- Bouton de validation -->
			<button
				type="button"
				onclick={valider}
				disabled={!nom.trim()}
				class="w-full mt-6 py-3 bg-green-main text-white font-semibold rounded-xl
					   hover:bg-green-dark active:scale-[0.98]
					   disabled:opacity-40 disabled:cursor-not-allowed
					   transition-all duration-200"
			>
				Ajouter
			</button>
		</div>
	</div>
{/if}
