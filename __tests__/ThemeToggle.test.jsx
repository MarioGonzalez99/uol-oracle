import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../components/ThemeToggle';
import '@testing-library/jest-dom/vitest';

// Mock the React Icons components
vi.mock('react-icons/bs', () => ({
	BsMoonFill: () => <div data-testid="moon-icon">Moon Icon</div>,
	BsSunFill: () => <div data-testid="sun-icon">Sun Icon</div>,
}));

describe('ThemeToggle', () => {
	beforeEach(() => {
		// Reset the document's data-theme attribute before each test
		document.documentElement.setAttribute('data-theme', '');
	});

	it('renders a button', () => {
		render(<ThemeToggle />);
		const button = screen.getByRole('button');
		expect(button).toBeTruthy();
	});

	it('initially renders the sun icon (dark theme)', () => {
		render(<ThemeToggle />);
		expect(screen.queryByTestId('moon-icon')).toBeFalsy();
	});

	it('toggles theme and icon when clicked', () => {
		render(<ThemeToggle />);
		const button = screen.getAllByRole('button')[0];

		// Initial state (dark theme)
		expect(document.documentElement.getAttribute('data-theme')).toBe('');

		// First click (switch to light theme)
		fireEvent.click(button);
		expect(document.documentElement.getAttribute('data-theme')).toBe('lemonade');

		// Second click (switch back to dark theme)
		fireEvent.click(button);
		expect(screen.queryByTestId('moon-icon')).toBeFalsy();
		expect(document.documentElement.getAttribute('data-theme')).toBe('dracula');
	});

	it('has the correct CSS classes', () => {
		render(<ThemeToggle />);
		const button = screen.getAllByRole('button')[0];
		expect(button).toHaveClass('btn', 'btn-sm', 'btn-outline');
	});
});
