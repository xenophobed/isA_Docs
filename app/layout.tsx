import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  title: 'isA Docs',
  description: 'Build and deploy intelligent AI agents',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" suppressHydrationWarning>
      <Head faviconGlyph="📦" />
      <body>
        <Layout
          navbar={
            <Navbar
              logo={<b>isA Docs</b>}
              projectLink="https://github.com/isA-org"
            />
          }
          footer={<Footer>© {new Date().getFullYear()} isA Platform</Footer>}
          pageMap={pageMap}
          editLink="Edit on GitHub"
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
