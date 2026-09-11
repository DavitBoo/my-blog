# Graph Report - my-blog  (2026-08-30)

## Corpus Check
- 56 files · ~22,928 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 331 nodes · 559 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9047ff9f`
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
- proyectos/page.tsx
- proyectos/[slug]/page.tsx
- layout.tsx
- ThreeBackground.tsx
- clientProjects.ts
- .prettierrc.json
- eslint.config.mjs
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `VidaEngine` - 38 edges
2. `compilerOptions` - 16 edges
3. `fetchPosts()` - 13 edges
4. `VidaScene()` - 9 edges
5. `IPost` - 8 edges
6. `stdMat()` - 7 edges
7. `PostPage()` - 7 edges
8. `processPostContent()` - 7 edges
9. `scripts` - 7 edges
10. `Post()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `VidaScene()` --calls--> `fetchVidaCategorias()`  [EXTRACTED]
  src/app/vida/VidaScene.tsx → src/app/utils/vidaApi.ts
- `VidaScene()` --calls--> `fetchVidaItems()`  [EXTRACTED]
  src/app/vida/VidaScene.tsx → src/app/utils/vidaApi.ts
- `VidaScene()` --calls--> `fetchVidaLibrosPreview()`  [EXTRACTED]
  src/app/vida/VidaScene.tsx → src/app/utils/vidaApi.ts
- `VidaScene()` --calls--> `useSiteTheme()`  [EXTRACTED]
  src/app/vida/VidaScene.tsx → src/app/vida/useSiteTheme.ts
- `Home()` --calls--> `fetchPosts()`  [EXTRACTED]
  src/app/page.tsx → src/app/utils/api.ts

## Import Cycles
- None detected.

## Communities (17 total, 1 thin omitted)

### Community 0 - "VidaScene.tsx"
Cohesion: 0.07
Nodes (48): Loader(), agrupar(), Grupo, LibroConMeta, LibrosPage(), RESUMEN_VACIO, fetchVidaCategorias(), fetchVidaItems() (+40 more)

### Community 1 - "post/[slug]/page.tsx"
Cohesion: 0.09
Nodes (30): BlogCategory(), Blog(), Comment, CommentSection(), HomeHero(), formatRelativeDate(), Post(), readingTime() (+22 more)

### Community 2 - "VidaEngine"
Cohesion: 0.13
Nodes (3): stdMat(), VidaEngine, VidaScene()

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

### Community 7 - "proyectos/page.tsx"
Cohesion: 0.27
Nodes (8): formatRelativeDate(), IProject, IProjectCategory, Project(), SearchInput(), SearchInputProps, Proyectos(), fetchProjects()

### Community 8 - "proyectos/[slug]/page.tsx"
Cohesion: 0.18
Nodes (14): BackButton(), Carousel(), CarouselProps, ProcessedContent(), ProcessedContentProps, generateMetadata(), ProjectPage(), ProjectProps (+6 more)

### Community 9 - "layout.tsx"
Cohesion: 0.15
Nodes (11): DEV_SEQUENCE, DevOverlay(), Tech, Footer(), Header(), ThemeType, NowData, NowModal() (+3 more)

### Community 10 - "ThreeBackground.tsx"
Cohesion: 0.36
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
- **101 isolated node(s):** `MAPA`, `VidaEngineCallbacks`, `Edificio`, `Isla`, `StdMatOpts` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `VidaEngine` connect `VidaEngine` to `VidaScene.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `Loader()` connect `VidaScene.tsx` to `post/[slug]/page.tsx`, `proyectos/page.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `MAPA`, `VidaEngineCallbacks`, `Edificio` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VidaScene.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06779661016949153 - nodes in this community are weakly interconnected._
- **Should `post/[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09061224489795919 - nodes in this community are weakly interconnected._
- **Should `VidaEngine` be split into smaller, more focused modules?**
  _Cohesion score 0.12660028449502134 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._