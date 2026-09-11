# Graph Report - my-blog  (2026-08-30)

## Corpus Check
- 56 files · ~22,914 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 330 nodes · 567 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c14720ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VidaScene.tsx
- post/[slug]/page.tsx
- VidaEngine
- dependencies
- compilerOptions
- devDependencies
- sobre-mi/page.tsx
- blog/page.tsx
- proyectos/[slug]/page.tsx
- layout.tsx
- HomeHero.tsx
- clientProjects.ts
- .prettierrc.json
- eslint.config.mjs
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `VidaEngine` - 42 edges
2. `compilerOptions` - 16 edges
3. `fetchPosts()` - 13 edges
4. `VidaItem` - 12 edges
5. `VidaScene()` - 9 edges
6. `IPost` - 8 edges
7. `scripts` - 7 edges
8. `PostPage()` - 7 edges
9. `processPostContent()` - 7 edges
10. `VidaCategoria` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Blog()` --calls--> `fetchPosts()`  [EXTRACTED]
  src/app/blog/page.tsx → src/app/utils/api.ts
- `VidaEngineCallbacks` --references--> `VidaItem`  [EXTRACTED]
  src/app/vida/vidaEngine.ts → src/app/utils/vidaApi.ts
- `Home()` --calls--> `fetchPosts()`  [EXTRACTED]
  src/app/page.tsx → src/app/utils/api.ts
- `Image()` --calls--> `fetchPostBySlug()`  [EXTRACTED]
  src/app/post/[slug]/opengraph-image.tsx → src/app/utils/api.ts
- `generateMetadata()` --calls--> `fetchPostBySlug()`  [EXTRACTED]
  src/app/post/[slug]/page.tsx → src/app/utils/api.ts

## Import Cycles
- None detected.

## Communities (18 total, 1 thin omitted)

### Community 0 - "VidaScene.tsx"
Cohesion: 0.08
Nodes (41): agrupar(), Grupo, LibroConMeta, LibrosPage(), RESUMEN_VACIO, fetchVidaCategorias(), fetchVidaItems(), fetchVidaLibros() (+33 more)

### Community 1 - "post/[slug]/page.tsx"
Cohesion: 0.09
Nodes (29): BlogCategory(), Comment, CommentSection(), HomeHero(), formatRelativeDate(), Post(), readingTime(), TableOfContents() (+21 more)

### Community 2 - "VidaEngine"
Cohesion: 0.12
Nodes (4): VidaItem, VidaLibroDestacado, VidaEngine, Tema

### Community 3 - "dependencies"
Cohesion: 0.07
Nodes (29): date-fns, html-entities, next, dependencies, date-fns, html-entities, next, photoswipe (+21 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 5 - "devDependencies"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, eslint-plugin-sonarjs, devDependencies, eslint, eslint-config-next (+15 more)

### Community 6 - "sobre-mi/page.tsx"
Cohesion: 0.13
Nodes (16): collectThemes(), deriveProjects(), Event, events, formatDate(), getStats(), kindLabels, normalizaTipo() (+8 more)

### Community 7 - "blog/page.tsx"
Cohesion: 0.17
Nodes (13): Blog(), Loader(), formatRelativeDate(), IProject, IProjectCategory, Project(), SearchInput(), SearchInputProps (+5 more)

### Community 8 - "proyectos/[slug]/page.tsx"
Cohesion: 0.18
Nodes (14): BackButton(), Carousel(), CarouselProps, ProcessedContent(), ProcessedContentProps, generateMetadata(), ProjectPage(), ProjectProps (+6 more)

### Community 9 - "layout.tsx"
Cohesion: 0.15
Nodes (11): DEV_SEQUENCE, DevOverlay(), Tech, Footer(), Header(), ThemeType, NowData, NowModal() (+3 more)

### Community 10 - "HomeHero.tsx"
Cohesion: 0.33
Nodes (7): ThreeBackground(), ThreeBackgroundProps, useThreeScene(), createFloatingGeometries(), createGeometry(), createMaterials(), getCSSColor()

### Community 11 - "clientProjects.ts"
Cohesion: 0.28
Nodes (6): metadata, clientProjects, IClientProject, ITech, ITechCategory, techCategories

### Community 12 - ".prettierrc.json"
Cohesion: 0.33
Nodes (5): printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 13 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): compat, __dirname, __filename

## Knowledge Gaps
- **99 isolated node(s):** `singleQuote`, `semi`, `trailingComma`, `printWidth`, `tabWidth` (+94 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Loader()` connect `blog/page.tsx` to `VidaScene.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `VidaEngine` connect `VidaEngine` to `VidaScene.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `VidaItem` connect `VidaEngine` to `VidaScene.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `singleQuote`, `semi`, `trailingComma` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VidaScene.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `post/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09158186864014801 - nodes in this community are weakly interconnected._
- **Should `VidaEngine` be split into smaller, more focused modules?**
  _Cohesion score 0.1241565452091768 - nodes in this community are weakly interconnected._