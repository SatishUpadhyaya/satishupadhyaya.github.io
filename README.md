# Personal Website

Source for [satishupadhyaya.github.io](https://satishupadhyaya.github.io/).

A single-page static site — hand-written HTML, one CSS file, and a small vanilla
JS file. No build step, no dependencies, no framework.

### Run locally

```
python3 -m http.server 4000
```

Then open [http://127.0.0.1:4000](http://127.0.0.1:4000).

There's nothing to install and nothing to compile — the files served locally are
byte-for-byte what GitHub Pages serves.

### Layout

```
index.html              the whole page (hero, about, projects, contact)
404.html                not-found page
assets/css/site.css     all styling; design tokens live in :root at the top
assets/js/site.js       nav, scroll-spy, reveal, typewriter, email reveal, copy
assets/SatishUpadhyaya.jpg
assets/icons/           favicon.svg, favicon-96.png, apple-touch-icon.png
favicon.ico             stays at the root — the one path requested without a
                        <link> tag, so moving it would 404 for some crawlers

robots.txt              allows AI answer engines (they cite you), blocks the
                        AI training crawlers; points to the sitemap. Opting a
                        crawler out needs an explicit Disallow — omitting it
                        means allowed, via the wildcard at the top.
sitemap.xml             one entry, since the site is a single page. Bump
                        <lastmod> when you change the content — Google only
                        trusts it while it stays accurate, and ignores it
                        otherwise.
llms.txt                plain-text summary for AI assistants (llmstxt.org)

about/ projects/ contact/
                        redirect stubs. The old Jekyll site published these as
                        real URLs and they're still indexed, so each one
                        canonicals + refreshes to the matching section anchor
                        rather than 404ing. Delete once they drop out of the
                        index.

.nojekyll               tells GitHub Pages to serve files as-is, skipping Jekyll
```

### Making changes

- **Content** is plain HTML in `index.html`. Section order follows the nav.
- **Colors, spacing, fonts** are CSS custom properties in `:root` at the top of
  `site.css`. Changing `--accent` re-themes the whole site.
- **The rotating role text** under the name is the `roles` array in `site.js`.

All animation is gated behind `prefers-reduced-motion`, so keep new motion
inside that pattern.
