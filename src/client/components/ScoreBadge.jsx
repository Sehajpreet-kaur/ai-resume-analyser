import React from 'react'

function ScoreBadge({ score }) {
  const isStrong = score > 70
  const isGoodStart = score > 49

  const badgeClass = isStrong
    ? 'bg-badge-green text-green-600'
    : isGoodStart
    ? 'bg-badge-yellow text-yellow-600'
    : 'bg-badge-red text-red-600'

  const label = isStrong ? 'Strong' : isGoodStart ? 'Good Start' : 'Needs work'

  return (
    <div className={`rounded-full px-4 py-2 inline-block ${badgeClass}`}>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  )
}

export default ScoreBadge
