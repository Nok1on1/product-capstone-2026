---
name: High-Contrast Mobility
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006e2d'
  on-secondary: '#ffffff'
  secondary-container: '#7cf994'
  on-secondary-container: '#007230'
  tertiary: '#6c5100'
  on-tertiary: '#ffffff'
  tertiary-container: '#8a6800'
  on-tertiary-container: '#ffeed1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#7ffc97'
  secondary-fixed-dim: '#62df7d'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f7be1d'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-lg:
    fontFamily: Lexend
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

This design system is engineered for the student on the move, prioritizing instant legibility and functional reliability. The brand personality is direct, energetic, and trustworthy, stripped of unnecessary decorative elements to focus on utility. 

The aesthetic style is **Modern Minimalism with High-Contrast accents**. It utilizes heavy whitespace to reduce cognitive load and sharp, bold strokes to ensure the interface remains usable in outdoor environments under direct sunlight. Every element is designed to feel authoritative yet accessible, catering to a student demographic that values efficiency and clarity in their daily digital tools.

## Colors

The palette is anchored by a high-visibility primary blue, chosen for its association with reliability and modern technology. 

- **Primary (#2563EB):** Used for primary actions, active states, and critical wayfinding.
- **Success/Confirmed (#16A34A):** A high-saturation green reserved specifically for 'CONFIRMED' statuses to provide immediate positive reinforcement.
- **Warning/Estimated (#EAB308):** A vibrant yellow for 'ESTIMATED' or pending states, ensuring visibility against the white background without sacrificing legibility.
- **Neutrals:** The system uses a deep navy-black (#0F172A) for text and iconography to achieve maximum contrast ratios against the pure white background.

## Typography

The choice of **Lexend** is central to this design system's mission. Originally designed to reduce visual stress and improve reading speed, its hyper-legible letterforms are perfect for students quickly glancing at their phones while walking across campus.

The type scale is intentionally generous. Headlines are bold and tight-kerned for impact, while body text maintains ample line height to ensure readability in high-glare environments. Labels use increased letter-spacing and heavy weights to remain distinct even at small sizes.

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for mobile web. The spacing rhythm is based on a 4px baseline, with most containers using a 16px (md) or 20px (container-padding) margin to prevent content from crowding the screen edges.

Layout decisions prioritize "Thumb-Zone" ergonomics. Interactive elements are sized to a minimum of 48px in height to accommodate rapid, imprecise tapping. Whitespace is used aggressively to separate logical groups of information rather than relying on thin, hard-to-see divider lines.

## Elevation & Depth

To maintain a clean and minimal aesthetic, depth is communicated through **Bold Borders and Tonal Layers** rather than heavy shadows.

- **Surface Tiers:** Primary content sits on the pure white background. Secondary content or grouped information is housed in containers with a 1px solid border (#E2E8F0) or a very light gray fill (#F8FAFC).
- **Interactive Depth:** On-press states are indicated by a subtle shift in background color or a 2px inset stroke, providing tactile feedback without breaking the flat design language.
- **Shadows:** Only used for floating action buttons or high-priority modals, utilizing a tight, dark, low-blur shadow to maintain the high-contrast feel.

## Shapes

The shape language uses **Rounded** (0.5rem base) geometry. This specific radius strikes a balance between the rigid "corporate" feel of sharp corners and the "juvenile" feel of fully pill-shaped elements.

- **Small Components:** Checkboxes and small badges use the 4px (rounded-sm) radius.
- **Standard Components:** Buttons, input fields, and cards use the 8px (rounded-md) radius.
- **Large Components:** Modals and bottom sheets use a 24px (rounded-xl) top radius to feel integrated with modern mobile OS gestures.

## Components

### Buttons
Primary buttons are solid #2563EB with white text, utilizing a bold weight for the label. Secondary buttons use a 2px stroke of the primary color.

### Badges
Badges are the high-contrast focal points of the system.
- **CONFIRMED:** Solid #16A34A background with white text. Bold, uppercase.
- **ESTIMATED:** Solid #EAB308 background with #0F172A (dark) text for maximum contrast. Bold, uppercase.

### Input Fields
Inputs feature a 1px #CBD5E1 border that thickens to a 2px #2563EB border on focus. Labels are always visible above the field (never floating placeholders only) to ensure context is never lost.

### Iconography
Icons must be simple, geometric, and use a consistent 2px stroke width. Avoid fine details; icons should be recognizable at a distance of an arm's length in bright light.

### Cards
Cards are flat with a 1px #E2E8F0 border. They do not use shadows by default, relying on the border and internal spacing to define their boundaries against the white background.