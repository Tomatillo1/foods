<!--
  Page Aliments - Catalogue complet des aliments par catégorie.
  Affiche les valeurs nutritionnelles pour 100g de chaque aliment.
  Organisé en sections dépliables par catégorie.
-->
<script lang="ts">
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { foodDatabase } from '$lib/data/foodData';

	/** Catégories dépliées (toutes ouvertes par défaut) */
	let categoriesOuvertes = $state<Record<string, boolean>>(
		Object.fromEntries(Object.keys(foodDatabase).map((cat) => [cat, false]))
	);

	/** Bascule l'état d'une catégorie */
	function toggleCategorie(cat: string) {
		categoriesOuvertes = {
			...categoriesOuvertes,
			[cat]: !categoriesOuvertes[cat]
		};
	}

	/** Icônes par catégorie */
	const iconeCategorie: Record<string, string> = {
		'Légumes': '🥬',
		'Féculents': '🍚',
		'Protéines animales': '🥩',
		'Protéines végétales': '🌱',
		'Fromages': '🧀',
		'Pains': '🍞',
		'Sucreries': '🍫',
		'Boissons': '🥛'
	};
</script>

<div class="px-5 py-6 space-y-5 animate-fade-in-up sm:px-6 sm:py-8 sm:space-y-6">
	<!-- En-tête -->
	<h1 class="text-xl font-bold text-gray-800">🥗 Aliments</h1>
	<p class="text-xs text-gray-400 -mt-2">Valeurs nutritionnelles pour 100g</p>

	<!-- Liste par catégorie -->
	{#each Object.entries(foodDatabase) as [categorie, aliments], i}
		<div
			class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up"
			style="animation-delay: {i * 40}ms"
		>
			<!-- En-tête de catégorie (cliquable) -->
			<button
				onclick={() => toggleCategorie(categorie)}
				class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors sm:p-6"
			>
				<div class="flex items-center gap-3">
					<span class="text-lg">{iconeCategorie[categorie] || '🍽️'}</span>
					<span class="text-sm font-semibold text-gray-700">{categorie}</span>
					<span class="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
						{aliments.length}
					</span>
				</div>
				{#if categoriesOuvertes[categorie]}
					<ChevronUp size={16} class="text-gray-400" />
				{:else}
					<ChevronDown size={16} class="text-gray-400" />
				{/if}
			</button>

			<!-- Contenu dépliable -->
			{#if categoriesOuvertes[categorie]}
				<div class="border-t border-gray-100 animate-fade-in">
					<!-- En-tête du tableau -->
					<div class="grid grid-cols-5 px-4 py-2 text-[9px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50">
						<span class="col-span-1">Aliment</span>
						<span class="text-center">Cal</span>
						<span class="text-center">Prot.</span>
						<span class="text-center">Gluc.</span>
						<span class="text-center">Lip.</span>
					</div>

					<!-- Lignes d'aliments -->
					{#each aliments as aliment, j}
						<div
							class="grid grid-cols-5 items-center px-4 py-2.5 text-xs
								   {j % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
								   border-t border-gray-50"
						>
							<span class="col-span-1 font-medium text-gray-700 truncate pr-2">{aliment.nom}</span>
							<span class="text-center text-orange-600 font-semibold">{aliment.valeurs.calories}</span>
							<span class="text-center text-blue-600">{aliment.valeurs.proteines}</span>
							<span class="text-center text-amber-600">{aliment.valeurs.glucides}</span>
							<span class="text-center text-purple-600">{aliment.valeurs.lipides}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>
