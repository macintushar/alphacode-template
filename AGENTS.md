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
  services/            # API services for Multiwoven backend
  env.ts               # Environment variable validation
  main.tsx             # Application entry point
  styles.css           # Global styles
```

### Key Dependencies

- `@tanstack/react-router` - File-based routing
- `@tanstack/react-query` - Server state management
- `@chakra-ui/react` v3 - Component library (theme: `defaultSystem`)
- `@chakra-ui/charts` + `recharts` - Charts and data visualization
- `axios` - HTTP client for API requests
- `zod` - Schema validation
- `next-themes` - Theme provider for dark/light mode

## Authentication Policy

**CRITICAL: This template does NOT use user authentication or sign-in pages.**

- **DO NOT** create sign-in, sign-up, login, or authentication pages
- **DO NOT** implement user session management or auth flows
- **DO NOT** add auth-related routes (`/sign-in`, `/login`, `/auth`, etc.)

Authentication is handled via environment variables:

- `VITE_API_HOST` - The Multiwoven API server URL
- `VITE_WORKSPACE_ID` - The workspace identifier (pre-configured)

The API client automatically includes the `Workspace-Id` header in all requests. This is an end-user dashboarding application where auth is managed externally.

## API Services (Multiwoven Backend)

This template includes a services layer for interfacing with the Multiwoven EE backend. **Always use these services for API calls.**

### Services Overview

| Service         | Import       | Purpose                            |
| --------------- | ------------ | ---------------------------------- |
| `models.ts`     | `@/services` | Query execution & model management |
| `connectors.ts` | `@/services` | Data source management             |
| `syncs.ts`      | `@/services` | Schema discovery & sync status     |
| `dashboard.ts`  | `@/services` | Workspace activity reports         |

### Using Services

```tsx
// Import from the barrel export
import { querySource, getAllModels, getCatalog, getReport } from '@/services'

// Or import specific services
import { querySource } from '@/services/models'
```

### Query Source API (Primary Data Fetching)

Use `querySource()` to execute SQL queries against data sources:

```tsx
import { useQuery } from '@tanstack/react-query'
import { querySource } from '@/services'

function MyDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sales-data'],
    queryFn: () => querySource('connector-id', 'SELECT * FROM sales LIMIT 100'),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return <MyChart data={data?.data} />
}
```

### Available Service Functions

**Models & Query Execution (`@/services/models`):**

- `querySource(connectorId, sql)` - Execute SQL query against a connector
- `executeModel(modelId)` - Execute a saved model's query
- `getAllModels({ page, perPage, type })` - List all models
- `getModelById(id)` - Get a specific model

**Connectors (`@/services/connectors`):**

- `getUserConnectors(type, page, perPage)` - List connectors by type
- `getAllConnectors()` - List all connectors
- `getConnectorInfo(id)` - Get connector details

**Syncs & Schema Discovery (`@/services/syncs`):**

- `getCatalog(connectorId, refresh)` - Discover schema (tables/columns)
- `fetchSyncs(page, perPage)` - List syncs
- `getSyncById(id)` - Get sync details
- `getSyncRunsBySyncId(syncId, page, perPage)` - Get sync run history

**Dashboard Reports (`@/services/dashboard`):**

- `getReport({ metric, timePeriod, connectorIds })` - Workspace activity metrics

### TanStack Query Integration

Always use TanStack Query for data fetching:

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { querySource, getAllModels } from '@/services'

// Fetching data
const { data: models } = useQuery({
  queryKey: ['models'],
  queryFn: () => getAllModels({ page: 1, perPage: 20 }),
})

// With variables
const { data: results } = useQuery({
  queryKey: ['query-results', connectorId, sql],
  queryFn: () => querySource(connectorId, sql),
  enabled: !!connectorId && !!sql,
})
```

### Error Handling

Services return `ApiResponse<T>` with optional `errors` array:

```tsx
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: async () => {
    const response = await querySource(connectorId, sql)
    if (response.errors) {
      throw new Error(response.errors[0]?.detail || 'Query failed')
    }
    return response.data
  },
})
```

## Charts & Data Visualization

This template uses **Chakra UI Charts** (built on recharts) for data visualization.

### Installation (Already Installed)

```bash
bun add @chakra-ui/charts recharts
```

### Basic Chart Pattern

```tsx
import { Chart, useChart } from '@chakra-ui/charts'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'

function SalesChart({
  data,
}: {
  data: Array<{ month: string; sales: number }>
}) {
  const chart = useChart({
    data,
    series: [{ name: 'sales', color: 'blue.500' }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickFormatter={chart.formatDate({ month: 'short' })}
        />
        <YAxis tickLine={false} axisLine={false} />
        {chart.series.map((item) => (
          <Bar
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
```

### Chart Types Available

- `BarChart` - Bar charts (vertical/horizontal)
- `LineChart` - Line charts with trends
- `AreaChart` - Filled area charts
- `PieChart` - Pie/donut charts
- `RadarChart` - Radar/spider charts
- `ComposedChart` - Mixed chart types

### Integrating with Query Source

```tsx
import { useQuery } from '@tanstack/react-query'
import { querySource } from '@/services'
import { Chart, useChart } from '@chakra-ui/charts'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

function SalesDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['sales-by-month'],
    queryFn: () =>
      querySource(
        'connector-id',
        `
      SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(amount) as sales
      FROM orders
      GROUP BY 1
      ORDER BY 1
    `,
      ),
  })

  const chart = useChart({
    data: data?.data || [],
    series: [{ name: 'sales', color: 'teal.500' }],
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <Chart.Root maxH="md" chart={chart}>
      <BarChart data={chart.data}>
        <XAxis dataKey="month" />
        <YAxis tickFormatter={chart.formatNumber({ notation: 'compact' })} />
        <Bar dataKey="sales" fill={chart.color('teal.500')} />
      </BarChart>
    </Chart.Root>
  )
}
```

### useChart Hook Options

```tsx
const chart = useChart({
  data: [],                    // Chart data array
  series: [                    // Define data series
    { name: 'revenue', color: 'blue.500' },
    { name: 'profit', color: 'green.500' },
  ],
})

// Available methods:
chart.data                     // Access data
chart.series                   // Access series config
chart.color('blue.500')        // Get semantic color
chart.key('revenue')           // Get data key for series
chart.formatNumber({ ... })    // Number formatter for axes
chart.formatDate({ ... })      // Date formatter for axes
```

### Chart Documentation

For advanced chart customization, fetch the Chakra UI charts documentation:

- **Charts Guide**: https://chakra-ui.com/docs/charts/installation

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

**Required Variables:**

```
VITE_API_HOST=https://your-api-host.com    # Multiwoven API server
VITE_WORKSPACE_ID=your-workspace-id         # Workspace identifier
```

**Optional Variables:**

```
VITE_APP_TITLE=My Dashboard                 # Application title
```

### Files to Ignore

- `routeTree.gen.ts` - Auto-generated by TanStack Router
- `dist/` - Build output
- `.env` - Local environment variables
