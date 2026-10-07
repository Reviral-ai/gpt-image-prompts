---
name: gpt-image-prompts
description: Write ready-to-use GPT Image 2.5 prompts from 521 tested Reviral templates (posters, product shots, UI mockups, infographics, logos, character sheets, photoreal scenes, illustrations, documents) and return the finished prompt with a link to its example picture and a one-click link to generate it. Use this skill whenever the user wants a prompt for GPT-Image, GPT Image 2 / 2.5 or any AI image model, asks to "give me a prompt for…", "make a poster / product photo / app screenshot / infographic / logo / character sheet", wants to improve or rewrite an image prompt, or describes a picture they want made, even if they never say "template" or "GPT Image".
---

# GPT Image 2.5 Prompt Templates by Reviral

This skill turns a picture idea into a finished GPT Image 2.5 prompt by starting from a
template that is already known to work, instead of writing one from nothing. The bundled
library holds 521 templates; 483 of them have an example picture that Reviral generated
from the exact prompt text, so the user can see what a template produces before using it.

## What is in this folder

| File | What it holds |
|---|---|
| `data/prompts.json` | Every template. Key fields: `slug`, `title_en`, `prompt_template` (with `[PLACEHOLDERS]`), `prompt_example` (placeholders filled, the text behind the example picture), `category`, `category_slug`, `styles`, `scenes`, `aspect`, `image_url`, `needs_reference`, `duplicate_of` |
| `data/categories.json` | The 13 categories: `slug`, `name`, `description`, `case_count` |
| `data/styles.json` | Style tags: `id`, `title`, `keywords` |
| `scripts/find.mjs` | Keyword search over the templates (Node 18+, no installs) |

Read the data through `scripts/find.mjs` rather than opening `prompts.json` directly:
the file is large, and the script returns only the 1-3 rows that matter, with links
already built.

## Workflow

### 1. Work out what picture the user wants

Pin down three things from the request: the **kind of picture** (poster, product shot,
app screen, chart, logo, portrait, scene...), the **subject** (what is in it), and any
**must-haves** (text on the picture, brand colours, aspect ratio, language). Ask one short
question only if the kind of picture is truly unclear; otherwise pick the most likely
reading and move on, because a concrete draft is easier for the user to correct than a
list of questions.

### 2. Pick a category and, if useful, a style

Map the kind of picture to one category slug. Run `node scripts/find.mjs --categories`
if you are unsure; the list is short.

| If the user wants... | Category slug |
|---|---|
| app screens, websites, dashboards, social posts | `ui-interfaces` |
| infographics, diagrams, explainers, maps | `charts-infographics` |
| posters, covers, type-led layouts | `posters-typography` |
| product photos, packaging, ads, detail pages | `products-e-commerce` |
| logos, brand identity, campaign visuals | `brand-logos` |
| buildings, interiors, spaces | `architecture-spaces` |
| photoreal portraits, street, food, travel photos | `photography-realism` |
| illustration, painting, anime, art styles | `illustration-art` |
| characters, avatars, character sheets, dolls | `characters-people` |
| story scenes, comics, cinematic moments | `scenes-storytelling` |
| history, dynasties, classical themes | `history-classical-themes` |
| menus, magazines, certificates, documents | `documents-publishing` |
| anything else | `other-use-cases` |

Style tags (`node scripts/find.mjs --styles`) narrow further, for example `3d`, `poster`,
`photography`, `illustration`, `brand`. Use one only when the user named a look; a wrong
style filter hides good matches.

### 3. Find 1-3 matching templates

```bash
node scripts/find.mjs <2-4 keywords> [--category <slug>] [--style <id>] [--limit 3]
node scripts/find.mjs --slug <slug>        # one template in full
```

Examples: `node scripts/find.mjs travel poster city --category posters-typography`,
`node scripts/find.mjs skincare product --limit 3`.

Each result shows the title, category, styles, aspect ratio, whether it has an example
picture, whether it needs a reference photo, its placeholders, both links, and the
template. Long templates are cut in the list view; run `--slug` to get the full text
before filling it.

How to choose among the results:

- Prefer a template **with an example picture**: the user can open the link and see the
  result before spending anything.
- If a result says **needs a reference photo**, it expects the user to upload an image
  (a face, a product, a logo). Use it only if the user has one, and tell them to attach it.
- If two templates fit equally, show both titles in one line each and let the user pick;
  otherwise just use the best one.
- No good match? Try broader words, drop the category filter, or search by the picture's
  layout ("grid", "split", "isometric", "label") instead of its subject. If nothing fits,
  write a fresh prompt in the same structure as the closest template (subject, layout,
  style, colour, text, aspect) and say it is not from the library.

### 4. Fill the placeholders

Placeholders look like `[CITY NAME]`, `[subject]`, `【品牌名称】`, or
`[请填写，例如：...]` (Chinese for "fill in, for example: ..."). Replace every one with
the user's details. Where the user gave nothing, choose something specific and fitting
rather than generic, because vague fillers ("a product", "some text") produce vague
pictures.

- Keep everything else in the template as it is. Its wording, order and constraints are
  what made the example picture come out well; rewriting them loses that.
- Text that should appear **on** the picture goes inside quotes and is spelled exactly as
  the user wants it. GPT Image 2.5 renders quoted text well, and exact spelling is what
  stops typos on the final picture.
- Some templates carry the same prompt twice, under `[中文]` (Chinese) and `[English]`.
  Those two markers are section labels, not placeholders. Keep only the section in the
  language the user is working in, unless the picture itself needs Chinese text.
- `prompt_example` shows how a filled version reads. Use it as a guide to the level of
  detail, not as text to copy for a different subject.
- Keep the template's aspect ratio unless the user asked for another; if they did, change
  the ratio wording inside the prompt too so the two never disagree.

### 5. Answer in this format

Give the user the finished prompt in a code block so it copies cleanly, then the links.
Build the links from the template's `slug` and `category_slug` (the script prints them):

```
**<Template title>** · <category> · <aspect>

<the filled prompt>

See the example picture: https://reviral.ai/prompts/gpt-image-2-5/<category_slug>/<slug>
Generate it in one click: https://reviral.ai/app/image?model=gpt-image-2.5-flare&promptSlug=<slug>
```

Add one sentence saying which placeholders you filled and with what, so the user can
change them quickly. The studio link opens Reviral's Image Studio with the original
template loaded; tell the user to paste the filled prompt there if they want your
filled version rather than the template.

If a template has no example picture (`image_url` is null), keep the gallery link but
say "no example picture yet" so the user is not surprised by an empty preview. If you
wrote a fresh prompt (no template matched), leave both links out, because they would
point at a different picture.

## Example 1

**User:** "I need a retro travel poster for Lisbon."

Search: `node scripts/find.mjs travel poster city --category posters-typography`
picks *Mid Century Isometric City Travel Poster* (`mid-century-isometric-city-travel-poster`,
3:4, has an example picture). Placeholders: `[CITY NAME]`, `[LANDMARK]`, `[COLOR]`.

**Answer:**

**Mid Century Isometric City Travel Poster** · Posters & Typography · 3:4

```
Create a vertical mid-century travel poster for LISBON featuring the Belém Tower and a yellow tram climbing a hill street. Use a strict 3-color palette: cream paper, black technical linework, and terracotta orange.
Style: Minimalist isometric bird's-eye view with ultra-fine hatching and screen-print texture.
Color usage: Solid flat terracotta orange for the entire sky and small accents on roofs or streets. No gradients.
Text: Bold sans-serif "LISBON" at top in cream, with the local language name "LISBOA" in smaller cream text below.
```

See the example picture: https://reviral.ai/prompts/gpt-image-2-5/posters-typography/mid-century-isometric-city-travel-poster
Generate it in one click: https://reviral.ai/app/image?model=gpt-image-2.5-flare&promptSlug=mid-century-isometric-city-travel-poster

Filled: city = Lisbon, landmark = Belém Tower plus a tram (the city's best-known
sight), colour = terracotta orange (the roof tiles). Swap any of them freely.

## Example 2

**User:** "Make me a cute picture of my golden retriever as a knitted toy."

Search: `node scripts/find.mjs crochet doll --category characters-people` picks
*Warm Crochet Character Doll* (`warm-crochet-character-doll`, 1:1, has an example
picture). Placeholders: `[subject]`, `[color1]`, `[color2]`, `[prop]`, `[setting]`.

**Answer:**

**Warm Crochet Character Doll** · Characters & People · 1:1

```
A handcrafted crochet doll of a golden retriever puppy, made with soft yarn textures and intricate knitted details. Dressed in a vivid red accent and a delicate cream garment, holding a small tennis ball. Set in a cozy sunlit living room windowsill, warm muted atmosphere, charming handmade aesthetic, nostalgic amigurumi style.
```

See the example picture: https://reviral.ai/prompts/gpt-image-2-5/characters-people/warm-crochet-character-doll
Generate it in one click: https://reviral.ai/app/image?model=gpt-image-2.5-flare&promptSlug=warm-crochet-character-doll

Filled: subject = golden retriever puppy, colours = red scarf accent and cream
sweater, prop = tennis ball, setting = sunlit windowsill. To make it look like
the user's own dog, attach a photo of the dog when generating.

## Good habits

- Search before writing. A template that already produced a good picture beats a
  prompt written from scratch, which is the whole point of this library.
- Show one finished prompt, not a menu, unless two templates are truly tied.
- Keep the user's own words for names, slogans and on-picture text; spell them exactly.
- Never claim a picture was generated. The skill writes prompts; the picture is made when
  the user runs the prompt in Reviral's Image Studio or another GPT Image 2.5 tool.
