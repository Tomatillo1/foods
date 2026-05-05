<!--
  Layout principal de l'application.
  Contient la navbar fixe en bas avec 3 onglets de navigation.
  Structure mobile-first centrée.
-->
<script lang="ts">
	import './layout.css';
	import { currentPage } from '$lib/stores';
	import { History, Home, Utensils } from 'lucide-svelte';
	import type { Page } from '$lib/types';

	let { children } = $props();

	/** Navigation vers une page */
	function naviguer(page: Page) {
		currentPage.set(page);
	}
</script>

<!-- Conteneur mobile centré -->
<div class="app-container">
	{@render children()}
</div>

<!-- Navbar fixe en bas -->
<nav class="bottom-nav">
	<div class="nav-inner">
		<!-- Bouton Historique -->
		<button
			id="nav-history"
			class="nav-btn {$currentPage === 'history' ? 'active' : ''}"
			onclick={() => naviguer('history')}
		>
			<History size={22} />
			<span class="nav-label">Historique</span>
		</button>

		<!-- Bouton Accueil (centre) -->
		<button
			id="nav-home"
			class="nav-btn {$currentPage === 'home' ? 'active' : ''}"
			onclick={() => naviguer('home')}
		>
			<Home size={22} />
			<span class="nav-label">Accueil</span>
		</button>

		<!-- Bouton Aliments -->
		<button
			id="nav-foods"
			class="nav-btn {$currentPage === 'foods' ? 'active' : ''}"
			onclick={() => naviguer('foods')}
		>
			<Utensils size={22} />
			<span class="nav-label">Aliments</span>
		</button>
	</div>
</nav>

<style>
	/* Conteneur principal mobile */
	.app-container {
		min-height: 100vh;
		max-width: 480px;
		margin: 0 auto;
		background-color: #f8fafc;
		position: relative;
		padding-bottom: 80px;
	}

	/* Navbar fixe en bas */
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: #fff;
		border-top: 1px solid #f1f5f9;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
	}

	.nav-inner {
		max-width: 480px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 64px;
		padding: 0 16px;
	}

	.nav-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		background: none;
		border: none;
		cursor: pointer;
		color: #94a3b8;
		transition: all 0.2s ease;
		padding: 8px 12px;
		border-radius: 16px;
		font-family: 'Poppins', sans-serif;
		position: relative;
	}

	.nav-btn:hover {
		color: #64748b;
	}

	.nav-btn.active {
		color: #059669;
		background: #dcfce7;
	}

	/* Supprimer l'ancien indicateur dot */
	.nav-btn.active::after {
		display: none;
	}

	.nav-label {
		font-size: 10px;
		font-weight: 500;
	}
</style>
