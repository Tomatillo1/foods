<script lang="ts">
    import { X, Check } from "lucide-svelte";
    import { OBJECTIFS } from "$lib/stores";

    interface Props {
        visible: boolean;
        onClose: () => void;
    }

    let { visible, onClose }: Props = $props();

    // Use internal state for form, initialized with current objective values when popup becomes visible
    let calInput = $state<number | "">("");
    let protInput = $state<number | "">("");
    let success = $state(false);

    $effect(() => {
        if (visible) {
            calInput = $OBJECTIFS.calories;
            protInput = $OBJECTIFS.proteines;
            success = false;
        }
    });

    function valider() {
        const cal = Number(calInput);
        const prot = Number(protInput);

        if (isNaN(cal) || cal <= 0 || isNaN(prot) || prot <= 0) {
            return;
        }

        OBJECTIFS.modifier(cal, prot);
        success = true;

        setTimeout(() => {
            success = false;
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
            class="bg-white w-full max-w-[360px] rounded-[20px] animate-popup shadow-2xl overflow-hidden"
            onclick={(e) => e.stopPropagation()}
        >
            <!-- En-tête -->
            <div class="px-5 py-3.5 flex items-center justify-between border-b border-gray-100">
                <h3 class="text-[17px] font-extrabold text-[#0f172a] tracking-tight">Modifier les objectifs</h3>
                <button
                    type="button"
                    onclick={onClose}
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Fermer"
                >
                    <X size={18} strokeWidth={2.5} class="text-[#64748b]" />
                </button>
            </div>

            <!-- Formulaire -->
            <div class="p-4 flex flex-col gap-3">
                <!-- Calories -->
                <div class="flex flex-col gap-1">
                    <label for="settings-cal" class="text-[12px] font-bold text-[#475569]">Objectif Calories (kcal) *</label>
                    <input
                        id="settings-cal"
                        type="number"
                        bind:value={calInput}
                        placeholder="Ex: 2200"
                        min="1"
                        class="w-full px-3.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]
                               transition-all"
                    />
                </div>

                <!-- Protéines -->
                <div class="flex flex-col gap-1">
                    <label for="settings-prot" class="text-[12px] font-bold text-[#475569]">Objectif Protéines (g) *</label>
                    <input
                        id="settings-prot"
                        type="number"
                        bind:value={protInput}
                        placeholder="Ex: 130"
                        min="1"
                        class="w-full px-3.5 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e]
                               transition-all"
                    />
                </div>

                <!-- Bouton de validation -->
                <button
                    type="button"
                    onclick={valider}
                    disabled={!calInput || !protInput || Number(calInput) <= 0 || Number(protInput) <= 0}
                    class="w-full h-11 bg-[#22c55e] text-white font-bold rounded-[10px]
                           hover:opacity-95 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg shadow-[#22c55e]/20
                           transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                    {#if success}
                        <Check size={18} strokeWidth={3} />
                        <span>Enregistré !</span>
                    {:else}
                        <span>Enregistrer</span>
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}
