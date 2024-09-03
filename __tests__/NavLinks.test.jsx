import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavLinks from '../components/NavLinks';

// Mock the next/link component
vi.mock('next/link', () => ({
	default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe('NavLinks', () => {
	it('renders all links', () => {
		render(<NavLinks />);

		const chatLink = screen.getByRole('link', { name: /chat/i });
		const profileLink = screen.getByRole('link', { name: /profile/i });

		expect(chatLink).toBeTruthy();
		expect(profileLink).toBeTruthy();
	});

	it('renders links within list items', () => {
		render(<NavLinks />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(4);

		listItems.forEach((item) => {
			expect(item.querySelector('a')).toBeTruthy();
		});
	});

	it('renders an unordered list with the correct class', () => {
		const { container } = render(<NavLinks />);

		const ul = container.querySelector('ul');
		expect(ul).toBeTruthy();
		expect(ul.classList.contains('menu')).toBe(true);
		expect(ul.classList.contains('text-base-content')).toBe(true);
	});
});
