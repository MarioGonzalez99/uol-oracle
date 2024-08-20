import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import Chat from '@/components/Chat.jsx';
import { generateChatResponse } from "@/utils/action";
import { toast } from 'react-hot-toast';

// Mock the dependencies
vi.mock('@/utils/action', () => ({
	generateChatResponse: vi.fn(),
}));

vi.mock('react-icons/fa', () => ({
	FaUserGraduate: () => <div data-testid="user-icon" />,
}));

vi.mock('react-icons/gi', () => ({
	GiRearAura: () => <div data-testid="ai-icon" />,
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
	toast: {
		error: vi.fn(),
	},
}));

describe('Chat Component', () => {
	let queryClient;

	beforeEach(() => {
		queryClient = new QueryClient();
		vi.clearAllMocks();
	});

	const renderComponent = () => {
		return render(
			<QueryClientProvider client={queryClient}>
				<Chat />
			</QueryClientProvider>
		);
	};

	it('renders the chat form', () => {
		renderComponent();
		expect(screen.getByPlaceholderText('Ask UoL Oracle')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Ask Question' })).toBeInTheDocument();
	});

	it('allows user to type and submit a message', async () => {
		renderComponent();
		const input = screen.getAllByRole('textbox')[0];
		const submitButton = screen.getAllByRole('button', { name: 'Ask Question' })[0];

		fireEvent.change(input, { target: { value: 'Hello, AI!' } });
		expect(input).toHaveValue('Hello, AI!');

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText('Hello, AI!')).toBeInTheDocument();
			expect(screen.getByTestId('user-icon')).toBeInTheDocument();
		});

		expect(input).toHaveValue('');
	});

	it('displays AI response after user message', async () => {
		generateChatResponse.mockResolvedValue({ role: 'assistant', content: 'Hello, human!' });
		renderComponent();

		const input = screen.getAllByRole('textbox')[0];
		const submitButton = screen.getAllByRole('button', { name: 'Ask Question' })[0];

		fireEvent.change(input, { target: { value: 'Hi there!' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText('Hi there!')).toBeInTheDocument();
			expect(screen.getByText('Hello, human!')).toBeInTheDocument();
			expect(screen.getAllByTestId('user-icon')).toHaveLength(2);
			expect(screen.getAllByTestId('ai-icon')).toHaveLength(1);
		});
	});

	it('disables submit button and shows loading state while waiting for response', async () => {
		generateChatResponse.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ role: 'assistant', content: 'Response' }), 1000)));
		renderComponent();

		const input = screen.getAllByRole('textbox')[0];
		const submitButton = screen.getAllByRole('button', { name: 'Ask Question' })[0];

		fireEvent.change(input, { target: { value: 'Test message' } });
		fireEvent.click(submitButton);

		expect(submitButton).toBeDisabled();
		expect(screen.getByText('Loading...')).toBeInTheDocument();

	});

	it('handles error when generating chat response fails', async () => {
		generateChatResponse.mockResolvedValue(null);
		renderComponent();

		const input = screen.getAllByRole('textbox')[0];
		const submitButton = screen.getAllByRole('button', { name: 'Ask Question' })[0];

		fireEvent.change(input, { target: { value: 'Trigger error' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).not.toBeNull();
		});
	});
});
