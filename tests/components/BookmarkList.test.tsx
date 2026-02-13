import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookmarkList from '@/components/BookmarkList';

// Mock Supabase client
const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
};

const mockSupabase = {
  auth: {
    getUser: jest.fn(() => Promise.resolve({
      data: { user: { id: 'test-user-id' } },
      error: null
    }))
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn(() => Promise.resolve({
      data: [
        {
          id: '1',
          user_id: 'test-user-id',
          url: 'https://example.com',
          title: 'Example Site',
          created_at: new Date().toISOString()
        }
      ],
      error: null
    })),
    delete: jest.fn().mockReturnThis(),
  })),
  channel: jest.fn(() => mockChannel),
  removeChannel: jest.fn()
};

jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => mockSupabase)
}));

describe('BookmarkList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    render(<BookmarkList refreshTrigger={0} />);
    
    // Check for loading skeleton
    const loadingElements = screen.getAllByRole('generic');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders bookmarks after loading', async () => {
    render(<BookmarkList refreshTrigger={0} />);
    
    await waitFor(() => {
      expect(screen.getByText('Example Site')).toBeInTheDocument();
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });
  });

  it('shows empty state when no bookmarks', async () => {
    mockSupabase.from = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn(() => Promise.resolve({ data: [], error: null })),
    }));

    render(<BookmarkList refreshTrigger={0} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
    });
  });

  it('displays bookmark count', async () => {
    render(<BookmarkList refreshTrigger={0} />);
    
    await waitFor(() => {
      expect(screen.getByText(/my bookmarks \(1\)/i)).toBeInTheDocument();
    });
  });
});
