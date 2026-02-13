import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookmarkForm from '@/components/BookmarkForm';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id' } },
        error: null
      }))
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }))
}));

describe('BookmarkForm Component', () => {
  const mockOnBookmarkAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with title and URL inputs', () => {
    render(<BookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument();
  });

  it('shows error when fields are empty', async () => {
    render(<BookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);
    
    const submitButton = screen.getByRole('button', { name: /add bookmark/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid URL', async () => {
    render(<BookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const urlInput = screen.getByLabelText(/url/i);
    const submitButton = screen.getByRole('button', { name: /add bookmark/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });
  });

  it('accepts valid URL and clears form on success', async () => {
    render(<BookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const urlInput = screen.getByLabelText(/url/i);
    const submitButton = screen.getByRole('button', { name: /add bookmark/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Site' } });
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnBookmarkAdded).toHaveBeenCalledTimes(1);
      expect(titleInput).toHaveValue('');
      expect(urlInput).toHaveValue('');
    });
  });
});
