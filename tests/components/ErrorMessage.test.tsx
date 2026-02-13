import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '@/components/ErrorMessage';

describe('ErrorMessage Component', () => {
  it('renders error message when message is provided', () => {
    render(<ErrorMessage message="Test error message" />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('does not render when message is null', () => {
    const { container } = render(<ErrorMessage message={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const mockDismiss = jest.fn();
    
    render(<ErrorMessage message="Test error" onDismiss={mockDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss error');
    fireEvent.click(dismissButton);
    
    await waitFor(() => {
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<ErrorMessage message="Test error" />);
    
    expect(screen.queryByLabelText('Dismiss error')).not.toBeInTheDocument();
  });
});
