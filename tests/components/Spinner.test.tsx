import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from '@/app/components/shared/Spinner';

describe('Spinner', () => {
  it('renders a spinner element', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders a single div with the spinner class', () => {
    const { container } = render(<Spinner />);
    const spinners = container.querySelectorAll('.spinner');
    expect(spinners).toHaveLength(1);
  });
});
