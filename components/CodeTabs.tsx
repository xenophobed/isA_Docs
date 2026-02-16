'use client'

import React from 'react'
import { Tabs } from 'nextra/components'

interface CodeTabsProps {
  children: React.ReactNode
}

const languageLabels: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  curl: 'cURL',
  bash: 'Bash',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  csharp: 'C#',
  ruby: 'Ruby',
  php: 'PHP',
}

const languageIcons: Record<string, string> = {
  python: '🐍',
  javascript: '📜',
  typescript: '📘',
  curl: '🌐',
  bash: '💻',
  go: '🔵',
  rust: '🦀',
  java: '☕',
  csharp: '🟣',
  ruby: '💎',
  php: '🐘',
}

export function CodeTabs({ children }: CodeTabsProps) {
  return (
    <div className="my-4 code-tabs">
      <Tabs items={['Python', 'JavaScript', 'cURL']}>
        {children}
      </Tabs>
    </div>
  )
}

interface CodeBlockProps {
  language: string
  children: string
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const label = languageLabels[language.toLowerCase()] || language
  const icon = languageIcons[language.toLowerCase()] || '📄'

  return (
    <Tabs.Tab>
      <div className="relative">
        <span className="absolute top-2 right-2 text-xs text-subtle">
          {icon} {label}
        </span>
        <pre className="language-{language}">
          <code>{children}</code>
        </pre>
      </div>
    </Tabs.Tab>
  )
}

// Pre-configured tabs for common API examples
interface ApiExampleProps {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  pythonCode: string
  jsCode: string
  curlCode: string
}

export function ApiExample({ endpoint, method = 'POST', pythonCode, jsCode, curlCode }: ApiExampleProps) {
  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-2 text-sm">
        <span className={`px-2 py-1 rounded font-mono font-bold ${
          method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
          method === 'POST' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
          method === 'PUT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
          method === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
        }`}>
          {method}
        </span>
        <code className="text-muted">{endpoint}</code>
      </div>
      <Tabs items={['Python', 'JavaScript', 'cURL']}>
        <Tabs.Tab>
          <pre className="!mt-0"><code className="language-python">{pythonCode}</code></pre>
        </Tabs.Tab>
        <Tabs.Tab>
          <pre className="!mt-0"><code className="language-javascript">{jsCode}</code></pre>
        </Tabs.Tab>
        <Tabs.Tab>
          <pre className="!mt-0"><code className="language-bash">{curlCode}</code></pre>
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}
