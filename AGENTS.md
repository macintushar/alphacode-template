# Agent Guidelines for bolt-template

This is a **React + TypeScript + Vite** project using TanStack Router, TanStack Query, and Chakra UI v3.

## Build/Test/Lint Commands

Do not use any other commands. Just use the commands listed below.

```bash
# Build
bun run build            # Build for production (vite build + tsc)

# Linting & Formatting
bun run lint             # Run ESLint (uses @tanstack/eslint-config)
bun run format           # Run Prettier
bun run check            # Format + lint --fix
```

## Code Style Guidelines

### Formatting

- **No semicolons** (Prettier: `semi: false`)
- **Single quotes** for strings
- **Trailing commas** in arrays/objects
- Run `bun run check` before committing

### Imports

- Use **path alias `@/`** for src imports (e.g., `import { env } from "@/env"`)
- Group imports: React, external libs, internal (@/), relative
- Use `* as React from "react"` for React namespace imports
- Follow `verbatimModuleSyntax: true` - use `import type` for type-only imports

### TypeScript Conventions

- **Strict mode enabled** - no implicit any, strict null checks
- Enable `noUnusedLocals` and `noUnusedParameters` - remove unused code
- Prefer `interface` for public component props (e.g., `export interface AlertProps`)
- Use explicit return types on component functions when wrapping with `forwardRef`
- File-based routing in `src/routes/` using TanStack Router conventions

### Component Patterns

- Wrap UI components with `React.forwardRef` for ref forwarding
- Export props interfaces (e.g., `export interface AlertProps`)
- Use Chakra UI v3 patterns: `ChakraComponent.Root`, `ChakraComponent.Indicator`
- Prefer composition pattern: destructure props with `...rest` spread
- Re-export Chakra components directly when not customizing: `export const DialogRoot = ChakraDialog.Root`

### Naming Conventions

- **Components**: PascalCase (e.g., `Alert`, `DialogContent`)
- **Files**: kebab-case for components (e.g., `color-picker.tsx`)
- **Interfaces**: PascalCase with Props suffix (e.g., `AlertProps`)
- **Routes**: Match filename to route path (e.g., `index.tsx` for `/`, `about.tsx` for `/about`)
- **Environment variables**: `VITE_` prefix for client-side vars

### Error Handling

- Validate environment variables using Zod in `src/env.ts`
- Use T3Env pattern: `createEnv({ clientPrefix: 'VITE_', client: {...}, runtimeEnv: import.meta.env })`
- Components should handle missing/optional props gracefully with defaults

### Project Structure

```
src/
  components/ui/       # Chakra UI component wrappers
  integrations/        # Third-party integrations (tanstack-query)
  routes/              # File-based routes (auto-generated)
  routes/__root.tsx    # Root layout route
  env.ts               # Environment variable validation
  main.tsx             # Application entry point
  styles.css           # Global styles
```

### Key Dependencies

- `@tanstack/react-router` - File-based routing
- `@tanstack/react-query` - Server state management
- `@chakra-ui/react` v3 - Component library (theme: `defaultSystem`)
- `zod` - Schema validation
- `next-themes` - Theme provider for dark/light mode

## Styling Rules

- **ALL styling MUST be done through Chakra UI** - Use Chakra's style props, `css` prop, or `sx` prop
- Use Chakra UI tokens (e.g., `bg="blue.500"`, `px={4}`) instead of arbitrary CSS values
- Refer to the LLMS Styling documentation for Chakra UI's styling patterns

## Chakra UI v3 Specific Rules

### Import Sources

**From `@chakra-ui/react`:**

- Alert, Avatar, Button, Card, Field, Table, Input, NativeSelect, Tabs, Textarea
- Separator, useDisclosure, Box, Flex, Stack, HStack, VStack, Text, Heading, Icon

**From `components/ui` (project snippets):**

- Provider, Toaster, ColorModeProvider, Tooltip, PasswordInput, Checkbox, Drawer, Radio, Menu, Dialog

### Component Patterns (v3 Migration)

**Toast System:**

```tsx
// Use toaster.create() - NOT useToast()
import { toaster } from '@/components/ui/toaster'
toaster.create({
  title: 'Title',
  type: 'error',
  meta: { closable: true },
  placement: 'top-end',
})
```

**Button with Icons:**

```tsx
// Icons are children, not props
<Button>
  <Mail /> Email <ChevronRight />
</Button>
// NOT: <Button leftIcon={<Mail />} rightIcon={<ChevronRight />}>
```

**Dialog (Modal):**

```tsx
// Modal → Dialog
<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
  <Dialog.Backdrop />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>Content</Dialog.Body>
  </Dialog.Content>
</Dialog.Root>
```

**Alert Structure:**

```tsx
<Alert.Root>
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Title</Alert.Title>
    <Alert.Description>Description</Alert.Description>
  </Alert.Content>
</Alert.Root>
```

### Prop Name Changes (v2 → v3)

- `isOpen` → `open`
- `isDisabled` → `disabled`
- `isInvalid` → `invalid`
- `isRequired` → `required`
- `isLoading` → `loading`
- `isChecked` → `checked`
- `colorScheme` → `colorPalette`
- `spacing` → `gap`

### Styling System Changes

**Nested Styles:**

```tsx
// sx → css, & is required for selectors
<Box css={{ '& svg': { color: 'red.500' } }} />
// NOT: <Box sx={{ svg: { color: "red.500" } }} />
```

**Gradients:**

```tsx
<Box bgGradient="to-r" gradientFrom="red.200" gradientTo="pink.500" />
// NOT: <Box bgGradient="linear(to-r, red.200, pink.500)" />
```

## Chakra UI v3 LLMS Documentation

When working with Chakra UI components, fetch the appropriate LLMS.txt file:

- **Components**: https://chakra-ui.com/llms-components.txt  
  Use when: Creating or modifying UI components (Button, Dialog, Alert, etc.)
- **Styling**: https://chakra-ui.com/llms-styling.txt  
  Use when: Writing styles, using style props, or customizing component appearance. **CRITICAL**: See styling rules above.
- **Theming**: https://chakra-ui.com/llms-theming.txt  
  Use when: Working with themes, dark/light mode, or customizing the theme configuration

### Routes & Navigation

- Create routes by adding files to `src/routes/` (auto-generated)
- Use `Link` from `@tanstack/react-router` for SPA navigation
- Use `createRootRouteWithContext<QueryClient>()` for typing router context
- Layout in `__root.tsx` with `<Outlet />` for nested routes

### Environment Variables

- Define in `src/env.ts` using T3Env/Zod
- Client variables must use `VITE_` prefix
- Access via `import { env } from "@/env"`

### Files to Ignore

- `routeTree.gen.ts` - Auto-generated by TanStack Router
- `dist/` - Build output
- `.env` - Local environment variables
