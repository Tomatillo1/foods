<!--
  Layout principal de l'application.
  Contient la navbar fixe en bas avec 3 onglets de navigation.
  Structure mobile-first centrée.
-->
<script lang="ts">
    import "./layout.css";
    import { currentPage, isPopupOpen } from "$lib/stores";
    import { History, Home, Utensils } from "lucide-svelte";
    import type { Page } from "$lib/types";

    let { children } = $props();

    /** Navigation vers une page */
    function naviguer(page: Page) {
        currentPage.set(page);
    }
</script>

<!-- Conteneur mobile centré -->
<div
    class="min-h-screen w-full max-w-[480px] mx-auto bg-[#f8fafc] relative pb-20"
>
    <!-- Header global NutriTrack -->
    <header
        class="bg-[#065f46] px-5 pb-4.5 pt-[calc(1.125rem+env(safe-area-inset-top))] mb-4 shadow-md"
    >
        <h1 class="text-2xl font-extrabold text-white tracking-tight">
            NutriTrack
        </h1>
    </header>

    <main class="px-4">
        {@render children()}
    </main>
</div>

<!-- Navbar fixe en bas -->
<nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#f1f5f9] shadow-[0_-2px_10px_rgba(0,0,0,0.04)] transition-transform duration-300 {$isPopupOpen
        ? 'translate-y-full'
        : 'translate-y-0'}"
>
    <div
        class="max-w-[480px] mx-auto flex items-center justify-around h-16 px-4"
    >
        <!-- Bouton Historique -->
        <button
            id="nav-history"
            class="flex flex-col items-center gap-[3px] bg-none border-none cursor-pointer transition-all p-[8px_12px] rounded-[16px] font-['Poppins'] relative hover:text-[#64748b] {$currentPage ===
            'history'
                ? 'text-[#059669] bg-[#dcfce7]'
                : 'text-[#94a3b8]'}"
            onclick={() => naviguer("history")}
        >
            <History size={22} />
            <span class="text-[10px] font-medium">Historique</span>
        </button>

        <!-- Bouton Accueil (centre) -->
        <button
            id="nav-home"
            class="flex flex-col items-center gap-[3px] bg-none border-none cursor-pointer transition-all p-[8px_12px] rounded-[16px] font-['Poppins'] relative hover:text-[#64748b] {$currentPage ===
            'home'
                ? 'text-[#059669] bg-[#dcfce7]'
                : 'text-[#94a3b8]'}"
            onclick={() => naviguer("home")}
        >
            <Home size={22} />
            <span class="text-[10px] font-medium">Accueil</span>
        </button>

        <!-- Bouton Aliments -->
        <button
            id="nav-foods"
            class="flex flex-col items-center gap-[3px] bg-none border-none cursor-pointer transition-all p-[8px_12px] rounded-[16px] font-['Poppins'] relative hover:text-[#64748b] {$currentPage ===
            'foods'
                ? 'text-[#059669] bg-[#dcfce7]'
                : 'text-[#94a3b8]'}"
            onclick={() => naviguer("foods")}
        >
            <Utensils size={22} />
            <span class="text-[10px] font-medium">Aliments</span>
        </button>
    </div>
</nav>
