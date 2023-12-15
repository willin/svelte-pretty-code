import { fallbackLng } from '$lib/i18n.js';
import type { Handle } from '@sveltejs/kit';
import { locale } from '@svelte-dev/i18n';

export const handle: Handle = async ({ event, resolve }) => {
  const { lang = fallbackLng } = event.params;
  locale.set(lang);
  const resp = await resolve(event);
  return resp;
};
