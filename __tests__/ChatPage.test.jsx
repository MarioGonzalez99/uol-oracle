import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import ChatPage from '../app/(chatbot)/chat/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the Chat component
vi.mock('@/components/Chat', () => {
	return {
		__esModule: true,
		default: () => <div role="region">Mocked Chat Component</div>,
	}
})

test('renders ChatPage with Chat component', () => {
	const queryClient = new QueryClient()

	render(
		<QueryClientProvider client={queryClient}>
			<ChatPage />
		</QueryClientProvider>
	)

	// Check if the mocked Chat component is rendered
	const chatComponent = screen.getByRole('region')
	expect(chatComponent).toBeDefined()
})
