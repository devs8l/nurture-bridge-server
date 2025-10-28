'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  const [childName, setChildName] = useState('');
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  useEffect(() => {
    // Get child name from localStorage
    const name = localStorage.getItem('childName');
    if (name) {
      setChildName(name);
    }

    // Mock assessment history (you can replace with real data later)
    const mockHistory = [
      {
        id: 1,
        date: new Date().toLocaleDateString(),
        status: 'Completed',
        score: 'Low Risk'
      }
    ];
    setAssessmentHistory(mockHistory);
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 hanken mb-2">
            Dashboard
          </h1>
          {childName && (
            <p className="text-lg text-gray-600 hanken">
              Assessment results for {childName}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/chat" className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 group">
            <div className="w-12 h-12 bg-[#5C756B] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#4a6459] transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 hanken mb-2">New Assessment</h3>
            <p className="text-sm text-gray-600 hanken">Start a new M-CHAT-R screening</p>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 hanken mb-2">Assessment History</h3>
            <p className="text-sm text-gray-600 hanken">View past screening results</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 hanken mb-2">Resources</h3>
            <p className="text-sm text-gray-600 hanken">Educational materials and guides</p>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 hanken mb-4">Recent Assessments</h2>
          
          {assessmentHistory.length > 0 ? (
            <div className="space-y-4">
              {assessmentHistory.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 hanken">Assessment #{assessment.id}</p>
                    <p className="text-sm text-gray-600 hanken">Completed on {assessment.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {assessment.status}
                    </span>
                    <p className="text-sm text-gray-600 hanken mt-1">{assessment.score}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 hanken">No assessments completed yet</p>
              <Link href="/chat" className="inline-flex items-center mt-4 px-6 py-2 bg-[#5C756B] hover:bg-[#4a6459] text-white font-medium rounded-lg transition-colors hanken">
                Start Your First Assessment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;