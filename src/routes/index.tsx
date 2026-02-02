import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <div style={{ textAlign: 'center' }}>AlphaCode Template</div>
}
