<template><LegalPage :title="document.title" :intro="document.intro" :sections="document.sections" /></template>
<script setup lang="ts">const document=useLegalContent('terms'); useSeoMeta({title:()=>`${document.value.label} | Harlah NU ke-101`,description:()=>document.value.intro});</script>
