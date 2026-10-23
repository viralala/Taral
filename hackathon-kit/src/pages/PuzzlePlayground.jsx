import { useParams } from 'react-router-dom'
import { Button, Container } from '../components/ui'
import { PUZZLES } from '../puzzles'

export default function PuzzlePlayground() {
  const { id } = useParams()
  const puzzle = PUZZLES.find((p) => p.id === id)

  if (!puzzle) {
    return (
      <Container className="py-16">
        <h1 className="display-lg">No such puzzle</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {PUZZLES.map((p) => (
            <Button key={p.id} to={`/puzzle/${p.id}`} variant="outline">
              {p.title}
            </Button>
          ))}
        </div>
      </Container>
    )
  }
  const Puzzle = puzzle.component
  return (
    <Container className="max-w-[720px] py-8 md:py-12">
      <Puzzle key={puzzle.id} onSolve={(r) => console.log('solved', r)} onFail={(r) => console.log('failed', r)} />
    </Container>
  )
}
