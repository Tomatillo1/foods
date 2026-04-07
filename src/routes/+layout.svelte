<!--
  Layout principal de l'application.
  Contient la navbar fixe en bas avec 3 onglets de navigation.
  Structure mobile-first centrée.
-->
<script lang="ts">
	import './layout.css';
	import { currentPage } from '$lib/stores';
	import { Home, History, UtensilsCrossed } from 'lucide-svelte';
	import type { Page } from '$lib/types';

	let { children } = $props();

	/** Navigation vers une page */
	function naviguer(page: Page) {
		currentPage.set(page);
	}

	/** Vérifie si la page est active */
	function estActive(page: Page, courante: Page): string {
		return page === courante
			? 'text-green-main scale-110'
			: 'text-gray-400';
	}
</script>

<!-- Conteneur mobile centré -->
<div class="min-h-screen max-w-md mx-auto bg-gray-bg relative pb-20">
	{@render children()}
</div>

<!-- Navbar fixe en bas -->
<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
	<div class="max-w-md mx-auto flex items-center justify-around h-16">
		<!-- Bouton Historique -->
		<button
			id="nav-history"
			onclick={() => naviguer('history')}
			class="flex flex-col items-center gap-1 transition-all duration-200 {estActive('history', $currentPage)}"
		>
			<History size={22} />
			<span class="text-[10px] font-medium">Historique</span>
		</button>

		<!-- Bouton Accueil (centre) -->
		<button
			id="nav-home"
			onclick={() => naviguer('home')}
			class="flex flex-col items-center gap-1 transition-all duration-200 {estActive('home', $currentPage)}"
		>
			<Home size={24} />
			<span class="text-[10px] font-medium">Accueil</span>
		</button>

		<!-- Bouton Aliments -->
		<button
			id="nav-foods"
			onclick={() => naviguer('foods')}
			class="flex flex-col items-center gap-1 transition-all duration-200 {estActive('foods', $currentPage)}"
		>
			<UtensilsCrossed size={22} />
			<span class="text-[10px] font-medium">Aliments</span>
		</button>
	</div>
</nav>
