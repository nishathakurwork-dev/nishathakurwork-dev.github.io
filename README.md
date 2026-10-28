# Nisha Thakur — Portfolio

Personal portfolio site for Nisha Thakur, Full Stack Developer
(WordPress, Shopify, BigCommerce, PHP, Laravel).

Published with GitHub Pages.

## Structure

A standalone static site. No build step, no dependencies — open
`index.html` in a browser and it works.

```
index.html          the whole site: markup, CSS and JS inlined
assets/
  img/              photo, logo and favicons
  fonts/            Inter (400, 500, 600, 700, 800 + 400 italic)
  NishaResume.pdf   downloadable CV
.nojekyll           serve files as-is, no Jekyll processing
```

Styles live in a single `<style>` block at the top of `index.html`,
built on `--nt-*` custom properties for the palette and spacing. The
two scripts at the bottom handle the nav/reveal behaviour and the
contact form.

All paths are relative, so the site works at any base path — a user
page, a project page or a subfolder.

## Contact form

GitHub Pages serves static files only, so there is no backend to accept
a POST. The form opens the visitor's mail client with the fields
pre-filled (`mailto:`), keeping the honeypot and required-field checks.

To take submissions server-side instead, point the form at a form
service such as Formspree or Netlify Forms and remove the handler.
