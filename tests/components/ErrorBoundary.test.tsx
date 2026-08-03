import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/app/components/shared/ErrorBoundary';

function ThrowError() {
  throw new Error('Test error message');
}

describe('ErrorBoundary', () => {
  it('renders the heading when provided', () => {
    const error = new Error('Something broke');
    const reset = vi.fn();
    render(<ErrorBoundary error={error} reset={reset} heading="Oops" />);
    expect(screen.getByText('Oops')).toBeInTheDocument();
  });

  it('does not render a heading when omitted', () => {
    const error = new Error('Something broke');
    const reset = vi.fn();
    const { container } = render(<ErrorBoundary error={error} reset={reset} />);
    expect(container.querySelector('h1')).toBeNull();
  });

  it('renders the error message', () => {
    const error = new Error('Detailed error info');
    const reset = vi.fn();
    render(<ErrorBoundary error={error} reset={reset} />);
    expect(screen.getByText('Detailed error info')).toBeInTheDocument();
  });

  it('renders a Try again button', () => {
    const error = new Error('fail');
    const reset = vi.fn();
    render(<ErrorBoundary error={error} reset={reset} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls reset when Try again is clicked', async () => {
    const error = new Error('fail');
    const reset = vi.fn();
    render(<ErrorBoundary error={error} reset={reset} />);
    const btn = screen.getByRole('button', { name: /try again/i });
    btn.click();
    expect(reset).toHaveBeenCalledOnce();
  });
});
