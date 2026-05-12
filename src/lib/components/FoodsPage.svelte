<!--
  Page Aliments - Catalogue complet des aliments par catégorie.
  Affiche les valeurs nutritionnelles pour 100g de chaque aliment.
  Organisé en sections dépliables par catégorie.
-->
<script lang="ts">
    import {
        ChevronDown,
        ChevronUp,
        Search,
        Apple,
        Carrot,
        Beef,
        Milk,
        CupSoda,
        Wheat,
        Candy,
        Droplet,
        Utensils,
    } from "lucide-svelte";
    import { foodDatabase } from "$lib/data/foodData";

    /** Recherche */
    let searchQuery = $state("");

    /** Catégories dépliées (toutes fermées par défaut sauf si recherche) */
    let categoriesOuvertes = $state<Record<string, boolean>>({});

    /** Bascule l'état d'une catégorie */
    function toggleCategorie(cat: string) {
        categoriesOuvertes = {
            ...categoriesOuvertes,
            [cat]: !categoriesOuvertes[cat],
        };
    }

    /** Icônes par catégorie d'affichage */
    const icons: Record<string, any> = {
        Protéines: Beef,
        Féculents: Wheat,
        Légumes: Carrot,
        Laitages: Milk,
        Boissons: CupSoda,
        Sucreries: Candy,
        Fruits: Apple,
        Sauces: Droplet,
    };

    /** Couleurs par catégorie d'affichage */
    const colors: Record<string, string> = {
        Protéines: "text-green-700",
        Féculents: "text-green-700",
        Légumes: "text-green-700",
        Fruits: "text-green-700",
        Laitages: "text-green-700",
        Boissons: "text-green-700",
        Sucreries: "text-green-700",
        Sauces: "text-green-700",
    };

    /** Regroupement des catégories pour le rendu style screenshot */
    const displayDatabase = $derived.by(() => {
        const query = searchQuery.toLowerCase().trim();

        // Mappage des catégories de la DB vers les catégories d'affichage
        const mapping: Record<string, string> = {
            Protéines: "Protéines",
            Féculents: "Féculents",
            Légumes: "Légumes",
            Fruits: "Fruits",
            Fromages: "Laitages",
            Boissons: "Boissons",
            Sucreries: "Sucreries",
            Sauces: "Sauces",
        };

        const grouped: Record<string, any[]> = {};

        for (const [dbCat, items] of Object.entries(foodDatabase)) {
            const displayCat = mapping[dbCat] || dbCat;

            const filtered = items.filter(
                (item) =>
                    item.nom.toLowerCase().includes(query) ||
                    displayCat.toLowerCase().includes(query),
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
            Object.keys(displayDatabase).forEach(
                (cat) => (newState[cat] = true),
            );
            categoriesOuvertes = newState;
        }
    });
</script>

<div class="py-2 animate-fade-in">
    <div>
        <h1 class="text-[22px] font-bold text-[#111827] mb-5">
            Répertoire des Aliments
        </h1>

        <!-- Barre de recherche -->
        <div class="mb-6">
            <div
                class="relative flex items-center bg-white rounded-xl border border-[#e5e7eb] px-4 transition-all focus-within:border-[#10b981] focus-within:ring-4 focus-within:ring-[#10b981]/5"
            >
                <Search size={18} class="text-[#9ca3af] mr-3" />
                <input
                    type="text"
                    placeholder="Rechercher un aliment..."
                    bind:value={searchQuery}
                    class="w-full h-[52px] border-none bg-transparent outline-none text-base text-[#374151] placeholder:text-[#9ca3af] placeholder:font-normal"
                />
            </div>
        </div>

        <!-- Liste par catégorie -->
        <div class="flex flex-col gap-4">
            {#each Object.entries(displayDatabase) as [categorie, aliments]}
                <div
                    class="bg-white rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden border border-[#f3f4f6]"
                >
                    <button
                        onclick={() => toggleCategorie(categorie)}
                        class="w-full flex items-center justify-between p-[18px_20px] bg-none border-none cursor-pointer text-left"
                    >
                        <div class="flex items-center gap-3.5">
                            <div
                                class="flex items-center justify-center {colors[
                                    categorie
                                ] || 'text-green-600'}"
                            >
                                {#if icons[categorie]}
                                    {@const Icon = icons[categorie]}
                                    <Icon size={20} strokeWidth={2.5} />
                                {:else}
                                    <Utensils size={20} strokeWidth={2.5} />
                                {/if}
                            </div>
                            <span class="text-lg font-bold text-[#1f2937]"
                                >{categorie}</span
                            >
                        </div>
                        <div class="header-right">
                            {#if categoriesOuvertes[categorie]}
                                <ChevronUp size={20} class="text-[#d1d5db]" />
                            {:else}
                                <ChevronDown size={20} class="text-[#d1d5db]" />
                            {/if}
                        </div>
                    </button>

                    {#if categoriesOuvertes[categorie]}
                        <div
                            class="px-5 pb-5 flex flex-col gap-0 animate-slide-down"
                        >
                            {#each aliments as aliment}
                                <div
                                    class="flex justify-between items-center py-3.5 border-b border-[#f3f4f6] last:border-none"
                                >
                                    <div class="flex flex-col gap-0.5">
                                        <span
                                            class="text-[15px] font-semibold text-[#374151]"
                                            >{aliment.nom}</span
                                        >
                                        <div
                                            class="flex gap-2 text-[11px] text-[#9ca3af] font-medium"
                                        >
                                            <span
                                                >P: {aliment.valeurs
                                                    .proteines}g</span
                                            >
                                            <span
                                                >G: {aliment.valeurs
                                                    .glucides}g</span
                                            >
                                            <span
                                                >L: {aliment.valeurs
                                                    .lipides}g</span
                                            >
                                        </div>
                                    </div>
                                    <div
                                        class="text-[15px] font-bold text-[#166534] whitespace-nowrap"
                                    >
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
