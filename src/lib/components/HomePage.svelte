<!--
  Page Accueil - Page principale de l'application.
  Design fidèle au mockup fourni.
-->
<script lang="ts">
    import {
        Trash2,
        Plus,
        ChevronDown,
        Calendar,
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
    import {
        todayEntries,
        todayTotals,
        caloriesRestantes,
        proteinesRestantes,
        OBJECTIFS,
        isPopupOpen,
    } from "$lib/stores";
    import { foodDatabase, categoriesAvecAutre } from "$lib/data/foodData";
    import type { Food } from "$lib/types";
    import CustomFoodPopup from "./CustomFoodPopup.svelte";
    import SaveDayPopup from "./SaveDayPopup.svelte";
    import type { Categorie } from "$lib/types";

    /** Mapping des icônes par catégorie (identique à la page Aliments) */
    const ICON_MAP: Record<string, any> = {
        Protéines: Beef,
        Féculents: Wheat,
        Légumes: Carrot,
        Laitages: Milk,
        Boissons: CupSoda,
        Sucreries: Candy,
        Fruits: Apple,
        Sauces: Droplet,
        Autre: Utensils,
    };

    // ==========================================
    // État du formulaire
    // ==========================================

    /** Catégorie sélectionnée */
    let categorieSelectionnee = $state("");
    /** Produit sélectionné dans la catégorie */
    let produitSelectionne = $state("");
    /** Quantité en grammes */
    let quantite = $state<number | "">("");

    /** Affichage des popups */
    let showCustomPopup = $state(false);
    let showSavePopup = $state(false);

    /** Sync global popup state */
    $effect(() => {
        isPopupOpen.set(showCustomPopup || showSavePopup);
    });

    // ==========================================
    // Données dérivées
    // ==========================================

    /** Liste des produits de la catégorie sélectionnée */
    let produitsDisponibles = $derived<Food[]>(
        categorieSelectionnee && categorieSelectionnee !== "Autre"
            ? foodDatabase[categorieSelectionnee] || []
            : [],
    );

    /** Le produit actuellement sélectionné (objet Food) */
    let produitActuel = $derived<Food | null>(
        produitsDisponibles.find((p) => p.nom === produitSelectionne) || null,
    );

    /** Vérifie si le formulaire est prêt à être validé */
    let formulaireValide = $derived(
        categorieSelectionnee !== "" &&
            categorieSelectionnee !== "Autre" &&
            produitSelectionne !== "" &&
            Number(quantite) > 0,
    );

    /** Jour actuel formaté */
    let jourActuel = $derived(() => {
        const jours = [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
            "Dimanche",
        ];
        const now = new Date();
        return jours[now.getDay()];
    });

    /** Pourcentage calories consommées */
    let caloriePourcentage = $derived(
        Math.min(100, ($todayTotals.calories / OBJECTIFS.calories) * 100),
    );

    /** Pourcentage protéines consommées */
    let proteinePourcentage = $derived(
        Math.min(100, ($todayTotals.proteines / OBJECTIFS.proteines) * 100),
    );

    let apercuValeurs = $derived(() => {
        if (!produitActuel || !quantite || Number(quantite) <= 0) return null;
        const q = Number(quantite);
        const ratio = q / 100;
        return {
            calories: Math.round(produitActuel.valeurs.calories * ratio),
            proteines:
                Math.round(produitActuel.valeurs.proteines * ratio * 10) / 10,
            glucides:
                Math.round(produitActuel.valeurs.glucides * ratio * 10) / 10,
            lipides:
                Math.round(produitActuel.valeurs.lipides * ratio * 10) / 10,
        };
    });

    // ==========================================
    // Handlers
    // ==========================================

    /** Quand la catégorie change */
    function onCategorieChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        categorieSelectionnee = target.value;
        produitSelectionne = "";
        quantite = "";

        // Si "Autre", ouvrir le popup personnalisé
        if (categorieSelectionnee === "Autre") {
            showCustomPopup = true;
        }
    }

    /** Quand le produit change */
    function onProduitChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        produitSelectionne = target.value;
    }

    /** Validation du formulaire classique */
    function validerFormulaire() {
        if (!formulaireValide || !produitActuel) return;

        const q = Number(quantite);
        const ratio = q / 100;

        // Calcul proportionnel basé sur les valeurs pour 100g
        todayEntries.ajouter({
            nom: produitActuel.nom,
            categorie: categorieSelectionnee as Categorie,
            quantite: q,
            calories: Math.round(produitActuel.valeurs.calories * ratio),
            proteines:
                Math.round(produitActuel.valeurs.proteines * ratio * 10) / 10,
            glucides:
                Math.round(produitActuel.valeurs.glucides * ratio * 10) / 10,
            lipides:
                Math.round(produitActuel.valeurs.lipides * ratio * 10) / 10,
        });

        // Reset du formulaire
        categorieSelectionnee = "";
        produitSelectionne = "";
        quantite = "";
    }

    /** Validation depuis le popup personnalisé */
    function onCustomValidate(data: {
        nom: string;
        calories: number;
        proteines: number;
        glucides: number;
        lipides: number;
    }) {
        todayEntries.ajouter({
            nom: data.nom,
            categorie: "Autre",
            quantite: 0, // Pas de quantité pour un aliment custom
            calories: data.calories,
            proteines: data.proteines,
            glucides: data.glucides,
            lipides: data.lipides,
        });

        // Reset catégorie après ajout custom
        categorieSelectionnee = "";
    }

    /** Suppression d'une entrée */
    function supprimerEntree(id: string) {
        todayEntries.supprimer(id);
    }
</script>

<div class="py-2 animate-fade-in flex flex-col gap-5">
    <!-- ==========================================
	     ZONE 1 : Formulaire d'ajout rapide
	     ========================================== -->
    <section
        class="bg-white rounded-[24px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-black/5"
    >
        <h2 class="text-[19px] font-bold text-[#111827] mb-5">Ajout rapide</h2>

        <div class="flex flex-col gap-4">
            <!-- Catégorie -->
            <div class="flex flex-col gap-1.5">
                <label
                    for="select-categorie"
                    class="text-[13px] font-medium text-[#374151]"
                    >Catégorie</label
                >
                <div class="relative">
                    <select
                        id="select-categorie"
                        value={categorieSelectionnee}
                        onchange={onCategorieChange}
                        class="w-full px-4 py-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl text-sm font-['Poppins'] text-[#1f2937] appearance-none cursor-pointer transition-all focus:outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/5"
                    >
                        <option value="" disabled>Sélectionner...</option>
                        {#each categoriesAvecAutre as cat}
                            <option value={cat}>{cat}</option>
                        {/each}
                    </select>
                    <ChevronDown
                        size={18}
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
                    />
                </div>
            </div>

            <!-- Produit -->
            <div class="flex flex-col gap-1.5">
                <label
                    for="select-produit"
                    class="text-[13px] font-medium text-[#374151]"
                    >Produit</label
                >
                <div class="relative">
                    <select
                        id="select-produit"
                        value={produitSelectionne}
                        onchange={onProduitChange}
                        disabled={!categorieSelectionnee ||
                            categorieSelectionnee === "Autre"}
                        class="w-full px-4 py-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl text-sm font-['Poppins'] text-[#1f2937] appearance-none cursor-pointer transition-all focus:outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="" disabled>Aliment</option>
                        {#each produitsDisponibles as produit}
                            <option value={produit.nom}>{produit.nom}</option>
                        {/each}
                    </select>
                    <ChevronDown
                        size={18}
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
                    />
                </div>
            </div>

            <!-- Quantité -->
            <div class="flex flex-col gap-1.5">
                <label
                    for="input-quantite"
                    class="text-[13px] font-medium text-[#374151]"
                    >Quantité (g/ml)</label
                >
                <input
                    id="input-quantite"
                    type="number"
                    bind:value={quantite}
                    placeholder="0"
                    min="1"
                    disabled={!produitSelectionne}
                    class="w-full px-4 py-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl text-sm font-['Poppins'] text-[#1f2937] transition-all focus:outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <!-- Résultat dynamique -->
                {#if apercuValeurs()}
                    <div
                        class="mt-2 px-3 py-2 bg-[#f0fdf4] rounded-[10px] flex items-center gap-2 text-[13px] text-[#065f46] border border-[#bbf7d0] animate-fade-in"
                    >
                        <span
                            >Total : <strong
                                >{apercuValeurs()?.calories} kcal</strong
                            ></span
                        >
                        <span class="text-[#065f46]">•</span>
                        <span
                            ><strong>{apercuValeurs()?.proteines}g</strong> P</span
                        >
                        <span class="text-[#065f46]">•</span>
                        <span
                            ><strong>{apercuValeurs()?.glucides}g</strong> G</span
                        >
                        <span class="text-[#065f46]">•</span>
                        <span
                            ><strong>{apercuValeurs()?.lipides}g</strong> L</span
                        >
                    </div>
                {/if}
            </div>

            <!-- Bouton Valider -->
            <button
                id="btn-valider"
                class="flex items-center justify-center gap-2.5 w-full p-3.5 bg-[#065f46] text-white text-[15px] font-semibold rounded-xl transition-all mt-1 hover:bg-[#047857] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                onclick={validerFormulaire}
                disabled={!formulaireValide}
            >
                <Plus size={18} />
                Ajouter
            </button>
        </div>
    </section>

    <!-- ==========================================
	     ZONE 2 : Compteurs nutritionnels (4 cards)
	     ========================================== -->
    <section class="grid grid-cols-2 gap-3">
        <!-- Calories -->
        <div
            class="bg-[#f0fdf4] border border-[#dcfce7] rounded-[20px] p-4 flex flex-col items-center gap-1"
        >
            <span class="text-xs font-medium text-[#4b5563]">Calories</span>
            <span class="text-2xl font-extrabold text-[#059669]"
                >{Math.round($todayTotals.calories)}</span
            >
        </div>
        <!-- Protéines -->
        <div
            class="bg-blue-50 rounded-[20px] p-4 flex flex-col items-center gap-1"
        >
            <span class="text-xs font-medium text-[#4b5563]">Protéines</span>
            <span class="text-2xl font-extrabold text-sky-600"
                >{Math.round($todayTotals.proteines)}g</span
            >
        </div>
        <!-- Glucides -->
        <div
            class="bg-[#e5e7eb] rounded-[20px] p-4 flex flex-col items-center gap-1"
        >
            <span class="text-xs font-medium text-[#4b5563]">Glucides</span>
            <span class="text-2xl font-extrabold text-[#111827]"
                >{Math.round($todayTotals.glucides)}g</span
            >
        </div>
        <!-- Lipides -->
        <div
            class="bg-[#e5e7eb] rounded-[20px] p-4 flex flex-col items-center gap-1"
        >
            <span class="text-xs font-medium text-[#4b5563]">Lipides</span>
            <span class="text-2xl font-extrabold text-[#111827]"
                >{Math.round($todayTotals.lipides)}g</span
            >
        </div>
    </section>

    <!-- ==========================================
	     ZONE 3 : Sélecteur de jour
	     ========================================== -->
    <button
        class="flex items-center justify-center bg-[#065f46] rounded-[16px] px-5 py-3.5 border-none cursor-pointer font-['Poppins']"
        onclick={() => (showSavePopup = true)}
    >
        <div class="flex items-center gap-3 text-sm font-medium text-white">
            <Calendar size={18} class="text-white" />
            <span>Sauvegarder le jour</span>
        </div>
    </button>

    <!-- ==========================================
	     ZONE 4 : Historique du jour
	     ========================================== -->
    <section class="history-section">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-[#111827]">Historique du jour</h2>
        </div>

        {#if $todayEntries.length === 0}
            <div
                class="bg-white rounded-[24px] p-[30px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-black/5 text-center text-[#9ca3af] text-sm"
            >
                <p>Aucun aliment ajouté aujourd'hui</p>
            </div>
        {:else}
            <div class="flex flex-col gap-3">
                {#each $todayEntries as entry, i (entry.id)}
                    {@const Icon =
                        ICON_MAP[entry.categorie || "Autre"] || Utensils}
                    <div
                        class="flex items-center gap-3.5 bg-white rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    >
                        <!-- Icône de la catégorie -->
                        <div
                            class="w-11 h-11 rounded-[14px] bg-[#dcfce7] flex items-center justify-center text-[#059669] flex-shrink-0"
                        >
                            <Icon size={18} />
                        </div>

                        <!-- Infos aliment -->
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-[#111827]">
                                {entry.nom}
                            </p>
                            <p class="text-xs text-[#6b7280] mt-0.5">
                                {#if entry.quantite > 0}
                                    {entry.quantite}g •
                                {/if}
                                <span class="text-emerald-600 font-bold"
                                    >{entry.calories} kcal</span
                                >
                                •
                                <span class="text-sky-600 font-bold"
                                    >{entry.proteines}g P</span
                                >
                                • {entry.glucides}g G • {entry.lipides}g L
                            </p>
                        </div>

                        <!-- Bouton suppression -->
                        <button
                            class="w-9 h-9 flex items-center justify-center text-[#ef4444] bg-none border-none cursor-pointer"
                            onclick={() => supprimerEntree(entry.id)}
                            aria-label="Supprimer {entry.nom}"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </section>

    <!-- ==========================================
	     ZONE 5 : Résumé des objectifs
	     ========================================== -->
    <section
        class="bg-white rounded-[24px] p-6 border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.02)"
    >
        <h2 class="text-lg font-bold text-[#111827] mb-5">
            Résumé des objectifs
        </h2>

        <!-- Calories restantes -->
        <div class="mb-5 last:mb-0">
            <div class="flex items-center justify-between mb-2.5">
                <span class="text-sm font-bold text-[#111827]"
                    >Calories restantes</span
                >
                <span
                    class="text-lg font-extrabold {$caloriesRestantes.depasse
                        ? 'text-[#ef4444]'
                        : 'text-[#059669]'}"
                >
                    {$caloriesRestantes.depasse
                        ? "0.0"
                        : $caloriesRestantes.valeur.toFixed(1)} kcal
                </span>
            </div>
            <div
                class="w-full h-2.5 bg-[#f3f4f6] rounded-[10px] overflow-hidden"
            >
                <div
                    class="h-full rounded-[10px] transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] {$caloriesRestantes.depasse
                        ? 'bg-[#ef4444]'
                        : 'bg-[#065f46]'}"
                    style="width: {caloriePourcentage}%"
                ></div>
            </div>
        </div>

        <!-- Protéines restantes -->
        <div class="mb-5 last:mb-0">
            <div class="flex items-center justify-between mb-2.5">
                <span class="text-sm font-bold text-[#111827]"
                    >Protéines restantes</span
                >
                <span
                    class="text-lg font-extrabold {$proteinesRestantes.depasse
                        ? 'text-[#ef4444]'
                        : 'text-sky-600'}"
                >
                    {$proteinesRestantes.depasse
                        ? "0.0"
                        : $proteinesRestantes.valeur.toFixed(1)}g
                </span>
            </div>
            <div
                class="w-full h-2.5 bg-[#f3f4f6] rounded-[10px] overflow-hidden"
            >
                <div
                    class="h-full rounded-[10px] transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] {$proteinesRestantes.depasse
                        ? 'bg-[#ef4444]'
                        : 'bg-sky-800'}"
                    style="width: {proteinePourcentage}%"
                ></div>
            </div>
        </div>
    </section>
</div>

<!-- Popups -->
<CustomFoodPopup
    visible={showCustomPopup}
    onClose={() => {
        showCustomPopup = false;
        categorieSelectionnee = "";
    }}
    onValidate={onCustomValidate}
/>

<SaveDayPopup visible={showSavePopup} onClose={() => (showSavePopup = false)} />
