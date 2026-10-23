import { Plus } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useFetch } from '../lib/useFetch'
import { Badge, Button, Card, Container, DotIcon, Skeleton } from '../components/ui'

export default function Account() {
  const { user, logout } = useAuth()
  const { data: subs, loading } = useFetch('/submissions')

  return (
    <Container className="py-6 md:py-10">
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card tone="ink" className="flex flex-col justify-between gap-10 p-8">
          <DotIcon name="user" tone="primary" />
          <div>
            <p className="text-sm opacity-60">Signed in as</p>
            <h1 className="display-md mt-1">{user.name}</h1>
            <p className="mt-2 text-sm opacity-70">{user.email}</p>
            <Button variant="light" size="sm" className="mt-6" onClick={logout}>
              Sign out
            </Button>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="display-sm">Your requests</h2>
            <Button to="/apply" size="sm">
              <Plus size={16} /> New request
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : subs?.length ? (
            <ul className="flex flex-col gap-2">
              {subs.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-tile bg-surface-2 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.topic}</p>
                    <p className="text-[13px] text-muted">
                      {s.id.toUpperCase()} · {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="outline">{s.priority}</Badge>
                    <Badge tone="success">{s.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dotted flex flex-col items-center gap-4 rounded-panel px-6 py-14 text-center">
              <DotIcon name="grid" />
              <p className="font-medium">Nothing here yet</p>
              <p className="max-w-xs text-sm text-muted">Requests you submit will show up here with their status.</p>
              <Button to="/apply" variant="outline" size="sm">
                Make your first request
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Container>
  )
}
