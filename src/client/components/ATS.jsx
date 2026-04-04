import React from 'react'

function ATS({ score, suggestions }) {
  // Determine gradient background based on score
  const gradientClass = score > 69 
    ? 'from-green-100' 
    : score > 49 
    ? 'from-yellow-100'
    : 'from-red-100'

  // Determine icon based on score
  const icon = score > 69 
    ? '/icons/ats-good.svg'
    : score > 49
    ? '/icons/ats-warning.svg'
    : '/icons/ats-bad.svg'

  return (
    <div className={`bg-gradient-to-br ${gradientClass} to-white rounded-lg p-6 shadow-md`}>
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-6">
        <img src={icon} alt="ATS Status" className="w-12 h-12" />
        <h2 className="text-2xl font-bold">ATS score - {score}/100</h2>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your ATS Performance</h3>
        <p className="text-gray-600">This score reflects how well your resume is optimized for Applicant Tracking Systems.</p>
      </div>

      {/* Suggestions List */}
      <div className="mb-6">
        {suggestions && suggestions.length > 0 && (
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <img 
                  src={suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'} 
                  alt={suggestion.type}
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                />
                <span className="text-gray-700">{suggestion.tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Closing Line */}
      <p className="text-sm text-gray-600 border-t pt-4">Keep improving to maximize your chances with ATS systems!</p>
    </div>
  )
}

export default ATS
