'use client'

import React, { useState } from 'react'

type FeedbackType = 'helpful' | 'not-helpful' | null

export function FeedbackWidget() {
  const [feedback, setFeedback] = useState<FeedbackType>(null)
  const [showThanks, setShowThanks] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [comment, setComment] = useState('')

  const handleFeedback = (type: FeedbackType) => {
    setFeedback(type)
    if (type === 'helpful') {
      setShowThanks(true)
      // In production, send to analytics
      console.log('Feedback: helpful', { page: window.location.pathname })
    } else {
      setShowForm(true)
    }
  }

  const handleSubmitComment = () => {
    // In production, send to analytics/feedback service
    console.log('Feedback: not helpful', {
      page: window.location.pathname,
      comment
    })
    setShowForm(false)
    setShowThanks(true)
  }

  if (showThanks) {
    return (
      <div className="mt-12 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Thanks for your feedback!</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 pt-6 border-t border-border">
      {!showForm ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">Was this page helpful?</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleFeedback('helpful')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                feedback === 'helpful'
                  ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
                  : 'border-border-strong hover:bg-surface-muted'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Yes
            </button>
            <button
              onClick={() => handleFeedback('not-helpful')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                feedback === 'not-helpful'
                  ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
                  : 'border-border-strong hover:bg-surface-muted'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Sorry to hear that. How can we improve this page?
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was missing or unclear?"
            className="w-full px-3 py-2 text-sm border border-border-strong rounded-lg bg-surface focus:ring-2 focus:ring-focus-ring focus:border-transparent"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitComment}
              className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition-colors"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setFeedback(null)
              }}
              className="px-4 py-2 text-sm font-medium text-muted hover:bg-surface-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
