<!--
  Page principale - routeur conditionnel.
  Affiche la page correspondante selon le store currentPage.
  Initialise les stores depuis localStorage au montage.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { currentPage, todayEntries, weekHistory } from '$lib/stores';
	import HomePage from '$lib/components/HomePage.svelte';
	import HistoryPage from '$lib/components/HistoryPage.svelte';
	import FoodsPage from '$lib/components/FoodsPage.svelte';

	/** Initialisation des stores depuis localStorage */
	onMount(() => {
		todayEntries.init();
		weekHistory.init();
	});
</script>

<svelte:head>
	<title>NutriTrack - Suivi Nutritionnel</title>
</svelte:head>

<!-- Affichage conditionnel des pages -->
{#if $currentPage === 'home'}
	<HomePage />
{:else if $currentPage === 'history'}
	<HistoryPage />
{:else if $currentPage === 'foods'}
	<FoodsPage />
{/if}
