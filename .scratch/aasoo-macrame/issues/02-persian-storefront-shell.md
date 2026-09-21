# 02: Persian storefront shell

**What to build:** the site-wide frame every page sits in: a right-to-left Persian root layout, the IRAN Sans font, a header and footer carrying the brand and the Instagram and Telegram touchpoints, a contact page that explains how a custom piece works and points at both channels, and a Persian 404 page so a bad link does not look like a broken site. Nothing product-specific lives here — this is the shell the catalog, cart and admin pages all render inside.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The root layout sets `lang="fa"` and `dir="rtl"`, and IRAN Sans loads as a local font so no Persian text falls back to a mismatched system face.
- [ ] Every route renders inside the same header and footer.
- [ ] Header and footer link to the contact page and to the Instagram and Telegram handles.
- [ ] The contact page explains how a custom order request works and links to both channels.
- [ ] An unknown path returns a Persian 404 page, not the framework default.
- [ ] Currency and dates render through Persian-locale formatters wherever they appear in this shell.
- [ ] Route-boundary tests from 01 pass against these pages.
