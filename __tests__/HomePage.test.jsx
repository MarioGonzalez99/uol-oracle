import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../app/page'

test('HomePage', () => {
	render(<HomePage />)

	// Check for the heading
	expect(screen.getByRole('heading', { level: 1, name: /welcome to uol oracle/i })).toBeDefined()

	// Check for the paragraph text
	expect(screen.getByText(/your one-stop knowledge hub for all things uol/i)).toBeDefined()

	// Check for the "Get Started" button
	expect(screen.getByRole('link', { name: /get started/i })).toBeDefined()
})
