'use client';

export default function MicButton({ isMicOn, onToggle }) {
  return (
    <div className="flex items-center space-x-4">
      {/* Mic Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isMicOn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-sm text-gray-600 font-medium">
          {isMicOn ? 'Listening...' : 'Mic Off'}
        </span>
      </div>

      {/* Main Mic Button */}
      <button
        onClick={onToggle}
        className={`relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
          isMicOn
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
        }`}
        aria-label={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
      >
        {/* Mic Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isMicOn ? (
            // Microphone On Icon
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0v-1h2z"/>
              <path d="M12 18v4m-4 0h8"/>
            </svg>
          ) : (
            // Microphone Off Icon
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0v-1h2z"/>
              <path d="M12 18v4m-4 0h8"/>
              <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        
        {/* Ripple Effect when Active */}
        {isMicOn && (
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping"></div>
        )}
      </button>

      {/* Secondary Controls */}
      <div className="flex space-x-2">
        {/* Stop/End Call Button */}
        <button
          className="w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="End call"
          onClick={() => console.log('End call clicked')}
        >
          <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.5 9.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-11 0C5.7 9.5 5 10.2 5 11s.7 1.5 1.5 1.5S8 11.8 8 11s-.7-1.5-1.5-1.5zm10.1 2.8c.4 0 .9.3.9.9v.6c0 2.2-1.8 4-4 4h-2.5v2h-2v-2H6.5c-2.2 0-4-1.8-4-4v-.6c0-.4.4-.9.9-.9s.9.3.9.9v.6c0 1.1.9 2 2 2h8.5c1.1 0 2-.9 2-2v-.6c.1-.5.5-.9.9-.9z"/>
          </svg>
        </button>

        {/* Settings Button */}
        <button
          className="w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Settings"
          onClick={() => console.log('Settings clicked')}
        >
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}