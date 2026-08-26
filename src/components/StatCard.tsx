type StatCardProps = {
  title: string
  value: number
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <article className="stat-card">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  )
}

export default StatCard