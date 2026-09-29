<template>
  <main class="legal-page min-h-[calc(100vh-140px)] bg-[#f5f5ef] text-[#17352c]">
    <section class="legal-shell mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14">
    <p class="text-sm uppercase tracking-[0.35em] text-emerald-800">{{ t('legal.information') }}</p>
    <h1 class="mt-4 text-3xl font-black sm:text-5xl">{{ title }}</h1>
    <p class="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{{ intro }}</p>
    <div class="mt-10 space-y-5">
      <article v-for="section in sections" :key="section.title" class="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-6">
        <h2 class="text-lg font-bold sm:text-xl">{{ section.title }}</h2>
        <p class="mt-3 leading-7 text-slate-600">{{ section.text }}</p>
      </article>
    </div>
    <p class="mt-8 text-sm text-slate-600">{{ t('legal.updated') }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
defineProps<{title:string;intro:string;sections:ReadonlyArray<{title:string;text:string}>}>();
const {t}=useI18n();
</script>

<style scoped>
.legal-shell {
  padding-inline: 0.75rem;
}
</style>
