<script lang="ts">
    import { X, Download, Check } from "lucide-svelte";
    import { weekHistory, todayTotals } from "$lib/stores";
    import type { JourSemaine } from "$lib/types";

    /** Props du composant */
    interface Props {
        visible: boolean;
        onClose: () => void;
    }

    let { visible, onClose }: Props = $props();

    /** Jour sélectionné */
    let jourSelectionne = $state<JourSemaine>("lundi");

    /** Liste des jours de la semaine */
    const jours: JourSemaine[] = [
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi",
        "dimanche",
    ];

    /** Confirme la sauvegarde */
    let sauvegarde = $state(false);

    /** Sauvegarde les totaux dans le jour sélectionné */
    function sauvegarder() {
        const totaux = {
            calories: Math.round($todayTotals.calories),
            proteines: Math.round($todayTotals.proteines),
            glucides: Math.round($todayTotals.glucides),
            lipides: Math.round($todayTotals.lipides),
        };

        weekHistory.sauvegarderJour(jourSelectionne, totaux);
        sauvegarde = true;

        // Feedback visuel, puis fermeture
        setTimeout(() => {
            sauvegarde = false;
            onClose();
        }, 800);
    }
</script>

{#if visible}
    <!-- Overlay sombre -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 animate-fade-in backdrop-blur-sm"
        onkeydown={(e) => e.key === "Escape" && onClose()}
        onclick={onClose}
    >
        <!-- Contenu du popup -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
            class="bg-white w-full max-w-[380px] rounded-[24px] flex flex-col gap-6 animate-popup shadow-2xl py-6 px-6"
            onclick={(e) => e.stopPropagation()}
        >
            <!-- En-tête -->
            <div class="flex items-center justify-between">
                <h3
                    class="text-[22px] font-extrabold text-[#0f172a] tracking-tight"
                >
                    Sauvegarder le jour
                </h3>
                <button
                    type="button"
                    onclick={onClose}
                    class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Fermer"
                >
                    <X size={22} strokeWidth={2.5} class="text-[#64748b]" />
                </button>
            </div>

            <!-- Résumé des totaux du jour -->
            <div
                class="bg-[#f1fdf9] rounded-[24px] p-5 flex flex-col gap-4 border border-[#e6fcf5]"
            >
                <p class="text-[13px] font-medium text-[#64748b]">
                    Totaux du jour :
                </p>
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="flex flex-col gap-0.5">
                        <p
                            class="text-[20px] font-bold text-[#0f172a] leading-tight"
                        >
                            {Math.round($todayTotals.calories)}
                        </p>
                        <p class="text-[12px] font-medium text-[#94a3b8]">
                            kcal
                        </p>
                    </div>
                    <div class="flex flex-col gap-0.5">
                        <p
                            class="text-[20px] font-bold text-[#0f172a] leading-tight"
                        >
                            {Math.round($todayTotals.proteines)}g
                        </p>
                        <p class="text-[12px] font-medium text-[#94a3b8]">
                            Prot.
                        </p>
                    </div>
                    <div class="flex flex-col gap-0.5">
                        <p
                            class="text-[20px] font-bold text-[#0f172a] leading-tight"
                        >
                            {Math.round($todayTotals.glucides)}g
                        </p>
                        <p class="text-[12px] font-medium text-[#94a3b8]">
                            Gluc.
                        </p>
                    </div>
                    <div class="flex flex-col gap-0.5">
                        <p
                            class="text-[20px] font-bold text-[#0f172a] leading-tight"
                        >
                            {Math.round($todayTotals.lipides)}g
                        </p>
                        <p class="text-[12px] font-medium text-[#94a3b8]">
                            Lip.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Sélection du jour -->
            <div class="flex flex-col gap-4">
                <label
                    for="save-day-select"
                    class="text-[14px] font-semibold text-[#64748b]"
                    >Choisir le jour :</label
                >
                <div class="grid grid-cols-4 gap-2">
                    {#each jours as jour}
                        <button
                            type="button"
                            onclick={() => (jourSelectionne = jour)}
                            class="h-10 rounded-xl text-[13px] font-bold transition-all duration-200
								   {jour === jourSelectionne
                                ? 'bg-[#22c55e] text-white shadow-lg shadow-[#22c55e]/25'
                                : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'}"
                        >
                            {jour.charAt(0).toUpperCase() + jour.slice(1, 3)}.
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Bouton de sauvegarde -->
            <button
                type="button"
                onclick={sauvegarder}
                disabled={sauvegarde}
                class="w-full h-14 bg-[#22c55e] text-white font-bold rounded-xl
					   hover:opacity-95 active:scale-[0.98]
					   disabled:opacity-60
					   shadow-lg shadow-[#22c55e]/20
					   transition-all duration-200 flex items-center justify-center gap-2 text-[17px]"
            >
                {#if sauvegarde}
                    <Check size={24} strokeWidth={3} />
                    <span>Sauvegardé !</span>
                {:else}
                    <Download size={24} strokeWidth={3} />
                    <span>Sauvegarder</span>
                {/if}
            </button>
        </div>
    </div>
{/if}
