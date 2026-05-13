<!--
  Page Historique - Affiche l'historique nutritionnel de la semaine.
  Liste les 7 jours avec leurs totaux (calories, protéines, glucides, lipides).
  Bouton Reset pour remettre toute la semaine à zéro (avec confirmation).
-->
<script lang="ts">
    import { RotateCcw } from "lucide-svelte";
    import { weekHistory, OBJECTIFS } from "$lib/stores";
    import type { JourSemaine } from "$lib/types";

    /** Liste ordonnée des jours de la semaine */
    const jours: { cle: JourSemaine; label: string }[] = [
        { cle: "lundi", label: "Lundi" },
        { cle: "mardi", label: "Mardi" },
        { cle: "mercredi", label: "Mercredi" },
        { cle: "jeudi", label: "Jeudi" },
        { cle: "vendredi", label: "Vendredi" },
        { cle: "samedi", label: "Samedi" },
        { cle: "dimanche", label: "Dimanche" },
    ];

    /** Confirmation avant reset */
    let confirmReset = $state(false);

    /** Réinitialise toute la semaine */
    function resetSemaine() {
        if (!confirmReset) {
            confirmReset = true;
            return;
        }
        weekHistory.reset();
        confirmReset = false;
    }

    /** Annule la confirmation */
    function annulerReset() {
        confirmReset = false;
    }
</script>

<div class="py-2 animate-fade-in">
    <div>
        <div class="flex justify-between items-start mb-8">
            <div class="title-left">
                <h1
                    class="text-[22px] font-extrabold text-[#0f172a] leading-[1.1]"
                >
                    Historique Hebdomadaire
                </h1>
            </div>

            <!-- Bouton Reset -->
            <div class="reset-wrapper">
                {#if confirmReset}
                    <div class="flex gap-2">
                        <button
                            onclick={annulerReset}
                            class="bg-[#059669] text-white border-none px-2 py-2 rounded-xl text-xs font-bold cursor-pointer"
                            >Non</button
                        >
                        <button
                            onclick={resetSemaine}
                            class="bg-[#ef4444] text-white border-none px-2 py-2 rounded-xl text-xs font-bold cursor-pointer"
                            >Oui</button
                        >
                    </div>
                {:else}
                    <button
                        onclick={resetSemaine}
                        class="flex items-center gap-2 bg-[#fef2f2] text-[#ef4444] border-none px-4 py-2 rounded-[14px] text-xs font-bold cursor-pointer transition-all active:scale-95"
                    >
                        <RotateCcw size={14} />
                        <span>Reset</span>
                    </button>
                {/if}
            </div>
        </div>

        <!-- Liste des jours -->
        <div class="flex flex-col gap-5 pb-10">
            {#each jours as { cle, label }, i}
                {@const jour = $weekHistory[cle]}
                <div
                    class="bg-white rounded-[28px] p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04),0_8px_10px_-6px_rgba(0,0,0,0.04)] border border-[#f1f5f9] animate-fade-in-up"
                    style="animation-delay: {i *
                        60}ms; animation-fill-mode: both;"
                >
                    <div class="flex justify-between items-center mb-5">
                        <h3 class="text-xl font-extrabold text-[#0f172a]">
                            {label}
                        </h3>
                        <div class="flex items-baseline gap-1">
                            <span
                                class="text-[22px] font-extrabold {jour.calories >
                                OBJECTIFS.calories
                                    ? 'text-[#ef4444]'
                                    : 'text-[#059669]'}">{jour.calories}</span
                            >
                            <span
                                class="text-[13px] text-[#94a3b8] font-semibold"
                                >kcal</span
                            >
                        </div>
                    </div>

                    <div
                        class="grid grid-cols-3 gap-3 pt-5 border-t border-[#f8fafc]"
                    >
                        <div class="flex flex-col gap-1">
                            <span
                                class="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider"
                                >Protéines</span
                            >
                            <span
                                class="text-base font-extrabold {jour.proteines >
                                OBJECTIFS.proteines
                                    ? 'text-[#ef4444]'
                                    : 'text-sky-600'}">{jour.proteines}g</span
                            >
                        </div>
                        <div class="flex flex-col gap-1">
                            <span
                                class="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider"
                                >Glucides</span
                            >
                            <span
                                class="text-base font-extrabold text-[#334155]"
                                >{jour.glucides}g</span
                            >
                        </div>
                        <div class="flex flex-col gap-1">
                            <span
                                class="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider"
                                >Lipides</span
                            >
                            <span
                                class="text-base font-extrabold text-[#334155]"
                                >{jour.lipides}g</span
                            >
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
