<!--
  Page Aliments - Catalogue complet des aliments par catégorie.
  Affiche les valeurs nutritionnelles pour 100g de chaque aliment.
  Organisé en sections dépliables par catégorie.
-->
<script lang="ts">
	import { ChevronDown, ChevronUp, Search, Utensils, Beef, Carrot, CupSoda, Milk, Wheat, Leaf } from 'lucide-svelte';
	import { foodDatabase } from '$lib/data/foodData';

	/** Recherche */
	let searchQuery = $state('');

	/** Catégories dépliées (toutes fermées par défaut sauf si recherche) */
	let categoriesOuvertes = $state<Record<string, boolean>>({});

	/** Bascule l'état d'une catégorie */
	function toggleCategorie(cat: string) {
		categoriesOuvertes = {
			...categoriesOuvertes,
			[cat]: !categoriesOuvertes[cat]
		};
	}

	/** Icônes par catégorie d'affichage */
	const icons: Record<string, any> = {
		'Protéines': Beef,
		'Féculents & Pains': Wheat,
		'Légumes': Leaf,
		'Laitages': Milk,
		'Boissons': CupSoda,
		'Sucreries': Utensils
	};

	/** Couleurs par catégorie d'affichage */
	const colors: Record<string, string> = {
		'Protéines': 'text-green-700',
		'Féculents & Pains': 'text-green-800',
		'Légumes': 'text-green-600',
		'Laitages': 'text-green-700',
		'Boissons': 'text-green-900',
		'Sucreries': 'text-orange-500'
	};

	/** Regroupement des catégories pour le rendu style screenshot */
	const displayDatabase = $derived.by(() => {
		const query = searchQuery.toLowerCase().trim();
		
		// Mappage des catégories de la DB vers les catégories d'affichage
		const mapping: Record<string, string> = {
			'Protéines animales': 'Protéines',
			'Protéines végétales': 'Protéines',
			'Féculents': 'Féculents & Pains',
			'Pains': 'Féculents & Pains',
			'Légumes': 'Légumes',
			'Fromages': 'Laitages',
			'Boissons': 'Boissons',
			'Sucreries': 'Sucreries'
		};

		const grouped: Record<string, any[]> = {};

		for (const [dbCat, items] of Object.entries(foodDatabase)) {
			const displayCat = mapping[dbCat] || dbCat;
			
			const filtered = items.filter(item => 
				item.nom.toLowerCase().includes(query) || displayCat.toLowerCase().includes(query)
			);

			if (filtered.length > 0) {
				if (!grouped[displayCat]) grouped[displayCat] = [];
				grouped[displayCat].push(...filtered);
			}
		}

		return grouped;
	});

	// Ouvrir toutes les catégories si on recherche
	$effect(() => {
		if (searchQuery.length > 0) {
			const newState: Record<string, boolean> = {};
			Object.keys(displayDatabase).forEach(cat => newState[cat] = true);
			categoriesOuvertes = newState;
		}
	});

</script>

<div class="foods-page">
	<!-- En-tête avec Logo -->
	<header class="header">
		<div class="logo-container">
			<span class="logo-text">Nutri<span class="logo-highlight">Track</span></span>
		</div>
	</header>

	<div class="content-container">
		<h1 class="page-title">Répertoire des Aliments</h1>

		<!-- Barre de recherche -->
		<div class="search-container">
			<div class="search-wrapper">
				<Search size={18} class="search-icon" />
				<input 
					type="text" 
					placeholder="Rechercher un aliment..." 
					bind:value={searchQuery}
					class="search-input"
				/>
			</div>
		</div>

		<!-- Liste par catégorie -->
		<div class="categories-list">
			{#each Object.entries(displayDatabase) as [categorie, aliments]}
				<div class="category-card" class:open={categoriesOuvertes[categorie]}>
					<button
						onclick={() => toggleCategorie(categorie)}
						class="category-header"
					>
						<div class="category-info">
							<div class="icon-wrapper {colors[categorie] || 'text-green-600'}">
								{#if icons[categorie]}
									{@const Icon = icons[categorie]}
									<Icon size={20} strokeWidth={2.5} />
								{:else}
									<Utensils size={20} strokeWidth={2.5} />
								{/if}
							</div>
							<span class="category-name">{categorie}</span>
						</div>
						<div class="header-right">
							{#if categoriesOuvertes[categorie]}
								<ChevronUp size={20} class="chevron" />
							{:else}
								<ChevronDown size={20} class="chevron" />
							{/if}
						</div>
					</button>

					{#if categoriesOuvertes[categorie]}
						<div class="items-list">
							{#each aliments as aliment}
								<div class="food-item">
									<div class="item-details">
										<span class="item-name">{aliment.nom}</span>
										<div class="item-macros">
											<span>P: {aliment.valeurs.proteines}g</span>
											<span>G: {aliment.valeurs.glucides}g</span>
											<span>L: {aliment.valeurs.lipides}g</span>
										</div>
									</div>
									<div class="item-calories">
										{aliment.valeurs.calories} kcal
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.foods-page {
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
		color: #15803d; /* Vert plus sombre pour le logo */
		letter-spacing: -0.5px;
	}

	.logo-highlight {
		color: #16a34a;
	}

	.content-container {
		padding: 0 20px;
	}

	.page-title {
		font-size: 22px;
		font-weight: 700;
		color: #111827;
		margin-bottom: 20px;
	}

	.search-container {
		margin-bottom: 24px;
	}

	.search-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		background: white;
		border-radius: 14px;
		border: 1px solid #e5e7eb;
		padding: 0 16px;
		transition: all 0.2s ease;
	}

	.search-wrapper:focus-within {
		border-color: #10b981;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.05);
	}

	.search-icon {
		color: #9ca3af;
		margin-right: 12px;
	}

	.search-input {
		width: 100%;
		height: 52px;
		border: none;
		background: transparent;
		outline: none;
		font-size: 16px;
		color: #374151;
	}

	.search-input::placeholder {
		color: #9ca3af;
		font-weight: 400;
	}

	.categories-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.category-card {
		background: white;
		border-radius: 18px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		overflow: hidden;
		border: 1px solid #f3f4f6;
	}

	.category-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 20px;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
	}

	.category-info {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.category-name {
		font-size: 18px;
		font-weight: 700;
		color: #1f2937;
	}

	.chevron {
		color: #d1d5db;
	}

	.items-list {
		padding: 0 20px 20px 20px;
		display: flex;
		flex-direction: column;
		gap: 0;
		animation: slideDown 0.3s ease-out;
	}

	.food-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.food-item:last-child {
		border-bottom: none;
	}

	.item-details {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.item-name {
		font-size: 15px;
		font-weight: 600;
		color: #374151;
	}

	.item-macros {
		display: flex;
		gap: 8px;
		font-size: 11px;
		color: #9ca3af;
		font-weight: 500;
	}

	.item-calories {
		font-size: 15px;
		font-weight: 700;
		color: #166534; /* Vert plus sombre comme dans le screenshot */
		white-space: nowrap;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes slideDown {
		from { opacity: 0; max-height: 0; }
		to { opacity: 1; max-height: 2000px; }
	}
</style>


