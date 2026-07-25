<template>
  <div class="mesh-bg relative min-h-screen">
    <div class="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
    <div class="relative z-10 flex min-h-screen flex-col">
      <AppHeader />
      <main class="flex-1">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>
