'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SearchResult {
  title: string
  description: string
  href: string
  category: string
}

// Demo search results - in production, this would call an AI API
const demoResults: Record<string, SearchResult[]> = {
  'agent': [
    { title: 'Agent SDK Overview', description: 'Learn how to build AI agents with the isA Agent SDK', href: '/agent-sdk', category: 'Agent SDK' },
    { title: 'Creating Your First Agent', description: 'Step-by-step guide to creating an agent', href: '/agent-sdk/quickstart', category: 'Getting Started' },
    { title: 'Agent Memory', description: 'Add persistent memory to your agents', href: '/agent-sdk/memory', category: 'Agent SDK' },
  ],
  'tool': [
    { title: 'MCP Tools Overview', description: '50+ pre-built tools for agents', href: '/mcp/tools', category: 'MCP' },
    { title: 'Custom Tools', description: 'Create your own MCP tools', href: '/mcp/development', category: 'MCP' },
    { title: 'Tool Configuration', description: 'Configure and customize tools', href: '/mcp/configuration', category: 'MCP' },
  ],
  'deploy': [
    { title: 'Deployment Guide', description: 'Deploy isA to production', href: '/cloud/deployment', category: 'Cloud' },
    { title: 'Kubernetes Setup', description: 'Configure Kubernetes cluster', href: '/cloud/quickstart', category: 'Cloud' },
    { title: 'CI/CD Pipelines', description: 'Automated deployment with ArgoCD', href: '/cloud/cicd', category: 'Cloud' },
  ],
  'auth': [
    { title: 'Authentication', description: 'JWT tokens and OAuth2 setup', href: '/user/authentication', category: 'User Services' },
    { title: 'RBAC', description: 'Role-based access control', href: '/user/rbac', category: 'User Services' },
    { title: 'API Keys', description: 'Managing API keys', href: '/user/api-keys', category: 'User Services' },
  ],
}

export function AISearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.length < 2) {
      setResults([])
      setAiResponse(null)
      return
    }

    setLoading(true)

    // Simulate AI search delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find matching results
    const matchedResults: SearchResult[] = []
    const queryLower = searchQuery.toLowerCase()

    for (const [key, items] of Object.entries(demoResults)) {
      if (queryLower.includes(key) || key.includes(queryLower)) {
        matchedResults.push(...items)
      }
    }

    // Generate AI response
    if (matchedResults.length > 0) {
      setAiResponse(`Based on your query "${searchQuery}", I found ${matchedResults.length} relevant documentation pages. The most relevant is "${matchedResults[0].title}" which covers ${matchedResults[0].description.toLowerCase()}.`)
    } else if (searchQuery.length > 3) {
      setAiResponse(`I couldn't find specific documentation for "${searchQuery}". Try searching for terms like "agent", "tool", "deploy", or "auth".`)
    }

    setResults(matchedResults.slice(0, 5))
    setLoading(false)
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Ask about docs...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <div
            ref={containerRef}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Ask about the isA platform..."
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                autoFocus
              />
              {loading && (
                <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">ESC</kbd>
              </button>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{aiResponse}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <a
                    key={index}
                    href={result.href}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.description}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {result.category}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Empty State */}
            {query.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try asking: "How do I create an agent?" or "Deploy to production"
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <span>AI-powered search</span>
              <div className="flex items-center gap-2">
                <span>Navigate</span>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>
                <span className="ml-2">Select</span>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
