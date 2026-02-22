# Design System — Academy

This document defines the visual design for the Academy frontend: pastel colors combined with black.

## Palette: Pastel + Black

### Base colors

- **Black:** Primary anchor for UI (buttons, headers, sidebar, text). Use for contrast and hierarchy.
- **Background (light):** Near-white with a slight warmth — `oklch(0.985 0.004 90)`.
- **Foreground (light):** Black for body text — `oklch(0.145 0 0)`.
- **Background (dark):** Black — `oklch(0.145 0 0)`.
- **Foreground (dark):** Off-white — `oklch(0.97 0 0)`.

### Pastel accents (OKLCH)

Use for cards, borders, highlights, and secondary actions. Keep chroma low for a pastel look.

| Token        | OKLCH              | Hex (approx) | Usage                    |
|-------------|--------------------|--------------|---------------------------|
| pastel-rose | oklch(0.88 0.06 15) | #f5d5d8      | Alerts, highlights        |
| pastel-lavender | oklch(0.82 0.07 280) | #d4cee8  | Sidebar accent, links     |
| pastel-mint | oklch(0.88 0.06 165) | #d4ebe4  | Success, positive states  |
| pastel-peach | oklch(0.90 0.05 75) | #f5e6d3  | Warm cards, tags          |
| pastel-blue | oklch(0.82 0.06 240) | #c8d4e8  | Info, secondary buttons   |

### Semantic mapping (CSS variables)

- **primary:** Black (buttons, main CTAs).
- **secondary / accent:** Pastel (e.g. lavender or mint) for secondary buttons and hover states.
- **muted:** Light gray (light mode) or dark gray (dark mode) for subtle backgrounds.
- **card / popover:** Slight tint (e.g. pastel) or neutral surface.
- **border / input:** Light gray or pastel-tinted border.
- **destructive:** Red for errors and destructive actions.

## Typography

- **Sans (UI):** Geist Sans — `var(--font-geist-sans)`. Body and UI.
- **Mono:** Geist Mono — `var(--font-geist-mono)`. Code and IDs.

### Scale

| Element | Class / token   | Use case      |
|--------|------------------|---------------|
| H1     | text-3xl font-semibold | Page titles   |
| H2     | text-2xl font-semibold | Section titles |
| H3     | text-xl font-medium    | Card titles   |
| H4     | text-lg font-medium    | Subsections   |
| Body   | text-base             | Default text  |
| Small  | text-sm text-muted-foreground | Captions, hints |
| Caption | text-xs text-muted-foreground | Labels, metadata |

## Components

- **Buttons:** Primary = black background, light text. Secondary = pastel background (e.g. lavender), black text. Use `rounded-lg` (--radius).
- **Cards:** Light pastel or neutral background, border subtle (pastel or gray). Use `card`, `card-header`, `card-content`.
- **Inputs:** Border uses `border` color; focus ring uses `ring` (black or pastel).
- **Tables:** Header row with muted background; borders use `border`. Alternating rows optional with muted.
- **States:** Hover = slightly darker/lighter than default. Disabled = muted foreground and reduced opacity. Error = destructive color and border.

## Usage in code

- **Tailwind:** Use semantic tokens — `bg-background`, `text-foreground`, `bg-primary`, `bg-secondary`, `border-border`, `text-muted-foreground`, etc. Pastels are available as `pastel-*` in `tailwind.config` or via custom CSS variables.
- **ShadCN:** Theme is wired via `globals.css` CSS variables; components use the same tokens (e.g. `background`, `primary`, `card`).
- **Custom pastel:** Use classes like `bg-pastel-lavender` or `var(--pastel-lavender)` if exposed in `globals.css` and `@theme inline`.

## Dark mode

- Add `.dark` on a parent (e.g. `<html className="dark">`) to switch.
- Background becomes black; foreground off-white; primary can stay black or switch to light; pastels stay as accents with reduced chroma or as border/card tints.
