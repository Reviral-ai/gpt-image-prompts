# GPT Image 2.5 Prompt Templates by Reviral

521 ready-to-use prompt templates for GPT Image 2.5, sorted into 13 categories: posters,
product shots, app and website mockups, infographics, logos, character sheets, photoreal
scenes, illustrations, documents and more. 483 of them come with an example picture that
[Reviral](https://reviral.ai) generated from that exact prompt, so you can see the result
before you use it. Where a template has `[PLACEHOLDERS]`, swap in your own subject, brand,
city or text.

## Browse the gallery

See every template with its example picture at **[reviral.ai/prompts](https://reviral.ai/prompts)**.
Open any prompt and press **Use this prompt** to load it into Reviral's Image Studio, change
the placeholders and generate.

## Install as an agent skill

The `gpt-image-prompts` skill lets your coding agent pick the right template, fill the
placeholders for you, and answer with the finished prompt plus a link to its example
picture and a one-click link to generate it.

Install it for Claude Code and Codex:

```bash
npx skills add Reviral-ai/gpt-image-prompts --skill gpt-image-prompts --agent claude-code codex --global --yes --copy
```

Or install it for every supported agent:

```bash
npx skills add Reviral-ai/gpt-image-prompts --all
```

Then just ask, for example: *"give me a prompt for a retro travel poster of Lisbon"* or
*"I need a product shot for my new candle brand"*.

Or add it as a plugin from inside your agent:

```text
/plugin marketplace add Reviral-ai/gpt-image-prompts
/plugin install gpt-image-prompts@reviral
```

## Categories

| Category | Templates | Gallery |
|---|---:|---|
| UI & Interfaces | 68 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/ui-interfaces) |
| Charts & Infographics | 45 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/charts-infographics) |
| Posters & Typography | 90 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/posters-typography) |
| Products & E-commerce | 42 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/products-e-commerce) |
| Brand & Logos | 27 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/brand-logos) |
| Architecture & Spaces | 11 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/architecture-spaces) |
| Photography & Realism | 77 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/photography-realism) |
| Illustration & Art | 56 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/illustration-art) |
| Characters & People | 31 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/characters-people) |
| Scenes & Storytelling | 21 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/scenes-storytelling) |
| History & Classical Themes | 16 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/history-classical-themes) |
| Documents & Publishing | 11 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/documents-publishing) |
| Other Use Cases | 26 | [Browse](https://reviral.ai/prompts/gpt-image-2-5/other-use-cases) |

## Data format

All data is plain JSON in [`data/`](data) (the skill carries its own copy in
[`skills/gpt-image-prompts/data/`](skills/gpt-image-prompts/data)).

`data/prompts.json` is a list of templates. Each entry has:

| Field | Meaning |
|---|---|
| `slug` | Unique id, also used in the gallery link |
| `title_en` | Template name |
| `prompt_template` | The prompt with `[PLACEHOLDERS]` to fill |
| `prompt_example` | The same prompt with placeholders filled: the exact text behind the example picture |
| `category`, `category_slug` | One of the 13 categories |
| `styles`, `scenes` | Style and topic tags |
| `aspect` | Aspect ratio, for example `4:5` or `16:9` |
| `image_url`, `image_alt`, `width`, `height` | The example picture, or `null` when there is none yet |
| `needs_reference` | `true` when the template expects you to attach a photo (a face, product or logo) |
| `duplicate_of` | Slug of the main template when this entry is a near-duplicate, otherwise `null` |
| `rendered_at` | When the example picture was generated |

The file has 541 entries: 521 templates plus 20 near-duplicates that point to their main
template through `duplicate_of`.

`data/categories.json` lists the categories (`slug`, `name`, `description`, `case_count`)
and `data/styles.json` the style tags (`id`, `title`, `keywords`).

Each template's gallery page is
`https://reviral.ai/prompts/gpt-image-2-5/<category_slug>/<slug>`, and its one-click
generate link is
`https://reviral.ai/app/image?model=gpt-image-2.5-flare&promptSlug=<slug>`.

## Licence

Example pictures © 2026 Reviral AI. Prompt data is MIT licensed, see LICENSE.
