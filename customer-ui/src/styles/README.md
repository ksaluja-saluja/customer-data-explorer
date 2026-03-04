# ITCSS Styles Architecture

This project uses **ITCSS (Inverted Triangle CSS)** architecture for organizing and managing stylesheets. ITCSS is a scalable, maintainable CSS architecture that organizes styles in layers from generic to specific.

## Folder Structure

```
src/styles/
├── 1-settings/          # Variables and configuration (no CSS output)
│   ├── _breakpoints.scss
│   ├── _colors.scss
│   ├── _typography.scss
│   ├── _spacing.scss
│   ├── _sizing.scss
│   └── _index.scss
├── 2-tools/             # Mixins and functions (no CSS output)
│   ├── _responsive.scss
│   ├── _utility-mixins.scss
│   └── _index.scss
├── 3-generic/           # Reset, normalize, base element styles
│   ├── _normalize.scss
│   ├── _base-elements.scss
│   └── _index.scss
├── 4-objects/           # Layout patterns and non-cosmetic styles
│   ├── _layout.scss
│   └── _index.scss
├── 5-trumps/            # Utilities and overrides (highest specificity)
│   ├── _utilities.scss
│   └── _index.scss
└── index.scss           # Main entry point that imports all layers
```

## Layer Descriptions

### 1. **Settings** (`1-settings/`)

Contains all variables needed throughout the project. **Produces no CSS output.**

- `_breakpoints.scss` - Responsive design breakpoints
- `_colors.scss` - Color palette and semantic color variables
- `_typography.scss` - Font families, sizes, weights, and line heights
- `_spacing.scss` - Spacing scale for margins, paddings, and gaps
- `_sizing.scss` - Size variables for width, height, and structural dimensions

**Usage in components:**

```scss
@use "../../../styles/1-settings/colors" as colors;
@use "../../../styles/1-settings/spacing" as spacing;

.c-button {
  color: colors.$color-primary;
  padding: spacing.$spacing-md;
}
```

### 2. **Tools** (`2-tools/`)

Reusable SCSS mixins and functions. **Produces no CSS output.**

- `_responsive.scss` - Mixins for responsive design using container queries
- `_utility-mixins.scss` - General-purpose utility mixins (flexbox, text, reset utilities)

**Available mixins:**

- `respond-to($breakpoint)` - Mobile-first container query mixin
- `flex-center`, `flex-column`, `flex-between` - Flexbox utilities
- `text-truncate`, `text-ellipsis` - Text utilities
- `reset-button`, `reset-list` - Reset utilities

**Usage in components:**

```scss
@use "../../../styles/2-tools/responsive" as responsive;

.c-component {
  @include responsive.respond-to("mobile-only") {
    font-size: 0.9rem;
  }
}
```

### 3. **Generic** (`3-generic/`)

Reset, normalize, and base element styles. **Starts producing CSS output.**

- `_normalize.scss` - Basic CSS reset (universal selector, box-sizing, smoothing)
- `_base-elements.scss` - Default styles for bare HTML elements (`:root`, `body`, `a`, `h1`, `button`)

These styles are applied globally and affect all instances of HTML elements.

### 4. **Objects** (`4-objects/`)

Layout patterns and reusable, non-cosmetic design patterns.

- `_layout.scss` - Container, flexbox, and viewport minimum height utilities

**Example classes:**

- `.o-container` - Max-width container with auto margins
- `.o-flex` - Flexbox with modifier classes
- `.o-viewport-min-height` - Full viewport height

Objects are classes that can be reused across the codebase and are applied directly to HTML elements.

### 5. **Components** (Managed in component files)

Specific UI components with cosmetic styling. These are component-scoped styles stored alongside component files.

**Naming convention:** `.c-component-name` with BEM modifiers

- `.c-button` - Component
- `.c-button--primary` - Modifier
- `.c-app-header__logo` - Child element (using double underscore)

### 6. **Trumps** (`5-trumps/`)

Low-level utilities and overrides. **Highest specificity layer.**

- `_utilities.scss` - Utility classes for quick fixes and adjustments (may use `!important`)

**Example classes:**

- `.u-hidden` - Hide elements
- `.u-cursor-pointer` - Change cursor
- `.u-text-center` - Text alignment
- `.u-opacity-50` - Opacity utilities

## Key Principles

### 1. Specificity Management

ITCSS organizes styles in increasing specificity:

- Settings & Tools: No output
- Generic: Very low specificity (element selectors)
- Objects: Low specificity (class selectors)
- Components: Medium specificity (scoped component classes)
- Trumps: High specificity (utility classes, may use `!important`)

### 2. BEM Naming Convention

Component classes follow BEM (Block, Element, Modifier):

```scss
.c-component {
} // Block (component)
.c-component__element {
} // Element (part of component)
.c-component--modifier {
} // Modifier (variation)
```

### 3. Component Styling

Each component imports SCSS locally and is organized with the component:

```
components/
└── atoms/
    └── button/
        ├── Button.tsx
        ├── Button.scss
        └── Button.test.tsx
```

### 4. Responsive Design

Uses CSS Container Queries with the `respond-to` mixin:

```scss
@include respond-to("mobile-only") {
  // Styles for max-width: 767px
}

@include respond-to("tablet") {
  // Styles for 768px to 1023px
}

@include respond-to("desktop") {
  // Styles for 1024px and above
}
```

### 5. No Direct Color Values

Colors are defined in `1-settings/_colors.scss` and referenced via variables:

```scss
color: colors.$color-primary;
background: colors.$color-white;
```

Not:

```scss
color: #646cff; // ❌ Avoid hardcoding colors
```

## Updating Styles

### Adding a new color

1. Add to `1-settings/_colors.scss`
2. Reference in components using the variable
3. Update components that use that color (no inline colors)

### Adding a new spacing value

1. Add to `1-settings/_spacing.scss`
2. Use via `spacing.$spacing-xyz` in components

### Adding a new component

1. Create component folder with `.tsx`, `.scss`, and `.test.tsx` files
2. Import `src/styles/1-settings/*` as needed
3. Use `.c-component-name` naming convention
4. Add component SCSS imports to main import in component TypeScript

## Entry Point

The main `src/styles/index.scss` imports all layers in ITCSS order:

```scss
@use "./1-settings/index" as settings;
@use "./2-tools/index" as tools;
@use "./3-generic/index" as generic;
@use "./4-objects/index" as objects;
@use "./5-trumps/index" as trumps;
```

This is imported in `src/index.scss` to load global styles.

## Best Practices

1. **Keep specificity low** - Avoid nesting and ID selectors
2. **Use variables for all values** - Colors, spacing, typography, sizing
3. **Follow the naming convention** - Use `.c-` prefix for components, `.o-` for objects, `.u-` for utilities
4. **Organize styles in layers** - Add new styles to the appropriate ITCSS layer
5. **Avoid `!important`** - Only use in the Trumps layer for genuine overrides
6. **Use container queries** - For responsive design, use the `respond-to` mixin
7. **Component scoping** - Keep component styles with their components, not in global styles

## Resources

- [ITCSS Article by Harry Roberts](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [CSS Architecture Best Practices](https://www.smashingmagazine.com/2012/07/even-better-css-architecture-with-sass/)
