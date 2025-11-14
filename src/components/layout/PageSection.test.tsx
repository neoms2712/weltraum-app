import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageSection } from './PageSection'

describe('PageSection', () => {
  it('renders title, subtitle and eyebrow', () => {
    render(
      <PageSection eyebrow="Test" title="Section" subtitle="Sub">
        <div>content</div>
      </PageSection>,
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Section' })).toBeInTheDocument()
    expect(screen.getByText('Sub')).toBeInTheDocument()
  })

  it('supports custom actions', () => {
    render(
      <PageSection title="With Action" actions={<button>Action</button>}>
        <p>content</p>
      </PageSection>,
    )

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
})
