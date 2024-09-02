import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MemberProfile from '../components/MemberProfile';

// Mock the imported modules
vi.mock('@/utils/dbutils', () => ({
	getExistingUserByEmail: vi.fn(),
	fetchOrGenerateCredits: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
	UserButton: vi.fn(() => <div data-testid="user-button">UserButton</div>),
}));

vi.mock('@clerk/nextjs/server', () => ({
	currentUser: vi.fn(),
}));

describe('MemberProfile', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders "No user logged in" when currentUser returns null', async () => {
		const { currentUser } = await import('@clerk/nextjs/server');
		currentUser.mockResolvedValue(null);

		const { findByText } = render(await MemberProfile());
		expect(await findByText('No user logged in')).toBeTruthy();
	});

	it('renders "No email address available" when user has no email', async () => {
		const { currentUser } = await import('@clerk/nextjs/server');
		currentUser.mockResolvedValue({ emailAddresses: [] });

		const { findByText } = render(await MemberProfile());
		expect(await findByText('No email address available')).toBeTruthy();
	});

	it('renders user email when available', async () => {
		const { currentUser } = await import('@clerk/nextjs/server');
		const { getExistingUserByEmail } = await import('@/utils/dbutils');

		currentUser.mockResolvedValue({
			emailAddresses: [{ emailAddress: 'test@example.com' }],
		});
		getExistingUserByEmail.mockResolvedValue({ id: 'user123' });

		const { findByText } = render(await MemberProfile());
		expect(await findByText('test@example.com')).toBeTruthy();
	});

	it('calls fetchOrGenerateCredits when userDb is available', async () => {
		const { currentUser } = await import('@clerk/nextjs/server');
		const { getExistingUserByEmail, fetchOrGenerateCredits } = await import('@/utils/dbutils');

		currentUser.mockResolvedValue({
			emailAddresses: [{ emailAddress: 'test@example.com' }],
		});
		getExistingUserByEmail.mockResolvedValue({ id: 'user123' });

		await render(await MemberProfile());
		expect(fetchOrGenerateCredits).toHaveBeenCalledWith('user123');
	});

	it('does not call fetchOrGenerateCredits when userDb is not available', async () => {
		const { currentUser } = await import('@clerk/nextjs/server');
		const { getExistingUserByEmail, fetchOrGenerateCredits } = await import('@/utils/dbutils');

		currentUser.mockResolvedValue({
			emailAddresses: [{ emailAddress: 'test@example.com' }],
		});
		getExistingUserByEmail.mockResolvedValue(null);

		await render(await MemberProfile());
		expect(fetchOrGenerateCredits).not.toHaveBeenCalled();
	});

	it('renders error message when an exception occurs', async () => {
		const { currentUser } = await import('@clerk/nextjs/server');
		currentUser.mockRejectedValue(new Error('Test error'));

		const { findByText } = render(await MemberProfile());
		expect(await findByText('Error loading profile')).toBeTruthy();
	});
});
