import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import {
  FeatureCard,
  FeatureGrid,
  CodeTabs,
  CodeBlock,
  ApiExample,
  FeedbackWidget,
  StatusBadge,
  ServiceStatus,
  ApiPlayground,
  DemoPlayground,
  AISearch,
} from './components'

const docsComponents = getDocsMDXComponents()

// Custom components available in all MDX files
const customComponents = {
  // Feature cards with icons
  FeatureCard,
  FeatureGrid,

  // Code examples
  CodeTabs,
  CodeBlock,
  ApiExample,

  // Interactive elements
  ApiPlayground,
  DemoPlayground,
  AISearch,

  // Feedback and status
  FeedbackWidget,
  StatusBadge,
  ServiceStatus,
}

export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...docsComponents,
    ...customComponents,
    ...components,
  }
}
