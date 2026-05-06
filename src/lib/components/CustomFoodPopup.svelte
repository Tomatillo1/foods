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
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 animate-fade-in backdrop-blur-sm"
		onkeydown={(e) => e.key === 'Escape' && fermer()}
		onclick={fermer}
	>
		<!-- Contenu du popup -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-white w-full max-w-[360px] rounded-[20px] animate-popup shadow-2xl overflow-hidden"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- En-tête -->
			<div class="px-5 py-3.5 flex items-center justify-between border-b border-gray-100">
				<h3 class="text-[17px] font-extrabold text-[#0f172a] tracking-tight">Aliment personnalisé</h3>
				<button
					type="button"
					onclick={fermer}
					class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
					aria-label="Fermer"
				>
					<X size={18} strokeWidth={2.5} class="text-[#64748b]" />
				</button>
			</div>

			<!-- Formulaire -->
			<div class="p-4 flex flex-col gap-3">
				<!-- Nom de l'aliment -->
				<div class="flex flex-col gap-1">
					<label for="custom-nom" class="text-[12px] font-bold text-[#475569]">Nom *</label>
					<input
						id="custom-nom"
						type="text"
						bind:value={nom}
						placeholder="Ex: Salade composée"
						class="w-full px-3.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-sm
							   focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]
							   transition-all placeholder:text-gray-400"
					/>
				</div>

				<!-- Calories -->
				<div class="flex flex-col gap-1">
					<label for="custom-cal" class="text-[12px] font-bold text-[#475569]">Calories (kcal) *</label>
					<input
						id="custom-cal"
						type="number"
						bind:value={calories}
						placeholder="0"
						min="0"
						class="w-full px-3.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-sm
							   focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]
							   transition-all"
					/>
				</div>

				<!-- Protéines et Glucides en ligne -->
				<div class="grid grid-cols-2 gap-3">
					<div class="flex flex-col gap-1">
						<label for="custom-prot" class="text-[12px] font-bold text-[#475569]">Protéines (g)</label>
						<input
							id="custom-prot"
							type="number"
							bind:value={proteines}
							placeholder="0"
							min="0"
							class="w-full px-3.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-sm
								   focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]
								   transition-all"
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label for="custom-gluc" class="text-[12px] font-bold text-[#475569]">Glucides (g)</label>
						<input
							id="custom-gluc"
							type="number"
							bind:value={glucides}
							placeholder="0"
							min="0"
							class="w-full px-3.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-sm
								   focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]
								   transition-all"
						/>
					</div>
				</div>

				<!-- Lipides -->
				<div class="flex flex-col gap-1">
					<label for="custom-lip" class="text-[12px] font-bold text-[#475569]">Lipides (g)</label>
					<input
						id="custom-lip"
						type="number"
						bind:value={lipides}
						placeholder="0"
						min="0"
						class="w-full px-3.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-sm
							   focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]
							   transition-all"
					/>
				</div>

				<!-- Bouton de validation -->
				<button
					type="button"
					onclick={valider}
					disabled={!nom.trim()}
					class="w-full h-11 bg-[#22c55e] text-white font-bold rounded-[10px]
						   hover:opacity-95 active:scale-[0.98]
						   disabled:opacity-50 disabled:cursor-not-allowed
						   shadow-lg shadow-[#22c55e]/20
						   transition-all duration-200 flex items-center justify-center gap-2 text-sm"
				>
					<span class="text-lg font-light mb-0.5">+</span>
					<span>Ajouter</span>
				</button>
			</div>
		</div>
	</div>
{/if}
