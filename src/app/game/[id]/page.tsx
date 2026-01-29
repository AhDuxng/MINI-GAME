interface GamePageProps {
  params: {
    id: string
  }
}

export default function GamePage({ params }: GamePageProps) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-primary">
        Game: {params.id}
      </h1>
    </main>
  )
}
