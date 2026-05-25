# korzhcom-website

Source for the [korzh.com](https://korzh.com) marketing site. Built with Jekyll + esbuild, deployed by Netlify on every push to `main`.

## Local development

Requirements: Node 20, Ruby 3.3, Bundler.

First-time setup:

```bash
npm install
bundle install
```

Daily dev (one command, runs esbuild watch + Jekyll serve):

```bash
npm run dev
```

Open `http://localhost:4000`. Editing files under `scripts/src/` or `source/` triggers a live reload.

## Production build

```bash
npm run build
bundle exec jekyll build
```

Output lands in `_site/`. Netlify runs these two commands automatically on push.
