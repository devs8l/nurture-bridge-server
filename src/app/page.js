import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          M-CHAT-R Assessment
        </h1>
        <p className="text-xl text-gray-600 mb-4 leading-relaxed">
          Modified Checklist for Autism in Toddlers, Revised
        </p>
        <p className="text-gray-500 mb-12 leading-relaxed">
          A simple, voice-guided screening tool to help identify children who might benefit from more detailed evaluation for autism spectrum disorder. The assessment takes about 5-10 minutes and can be completed from the comfort of your home.
        </p>
        
        <Link 
          href="/chat"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-200"
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Start Assessment
        </Link>
        
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
            This screening tool is for informational purposes only and does not replace professional medical advice. Please consult with your pediatrician for proper evaluation and diagnosis.
          </p>
        </div>
      </div>
    </div>
  )
}

export default page