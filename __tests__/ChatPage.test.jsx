import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChatPage from '../app/(chatbot)/chat/page'
import { QueryClient, dehydrate } from '@tanstack/react-query';
import * as actionModule from '@/utils/dbutils';
import '@testing-library/jest-dom/vitest';

// Mock the dependencies
vi.mock('@/components/Chat', () => ({
	default: () => <div data-testid="mock-chat">Mocked Chat Component</div>,
}));

vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual('@tanstack/react-query');
	return {
		...actual,
		dehydrate: vi.fn(() => ({ state: 'mocked-dehydrated-state' })),
		HydrationBoundary: ({ children }) => (
			<div data-testid="mock-hydration-boundary">{children}</div>
		),
	};
});


describe('ChatPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the Chat component within HydrationBoundary', async () => {
		vi.spyOn(actionModule, 'getUserMessages').mockResolvedValue([]);

		const { container } = render(await ChatPage());

		expect(screen.getByTestId('mock-hydration-boundary')).toBeInTheDocument();
		expect(screen.getByTestId('mock-chat')).toBeInTheDocument();
	});

	it('prefetches user messages', async () => {
		const mockGetUserMessages = vi.spyOn(actionModule, 'getUserMessages').mockResolvedValue([]);
		const mockPrefetchQuery = vi.fn();

		vi.spyOn(QueryClient.prototype, 'prefetchQuery').mockImplementation(mockPrefetchQuery);

		await ChatPage();

		expect(mockPrefetchQuery).toHaveBeenCalledWith({
			queryKey: ['userMessages'],
			queryFn: mockGetUserMessages,
		});
	});

	it('dehydrates the query client state', async () => {
		vi.spyOn(actionModule, 'getUserMessages').mockResolvedValue([]);

		await ChatPage();

		expect(dehydrate).toHaveBeenCalled();
	});
});
