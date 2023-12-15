<script>
  import { locale, locales } from '@svelte-dev/i18n';
  import '../app.css'
</script>

<nav>
  {#each $locales as locale}
    <a href={`/${locale}`}>{locale}</a>
  {/each}
</nav>

<slot />
