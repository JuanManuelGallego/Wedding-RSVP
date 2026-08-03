import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExportCsvButton from '@/app/components/admin/ExportCsvButton';

describe('ExportCsvButton', () => {
  it('renders the Export CSV text', () => {
    render(<ExportCsvButton rows={[]} />);
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
  });

  it('renders with no rows', () => {
    render(<ExportCsvButton rows={[]} />);
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('renders with sample rows', () => {
    const rows = [
      {
        guestName: 'Test Guest',
        attending: true,
        partySize: 2,
        whatsapp: '+57123',
        respondedAt: '2025-01-15T10:00:00Z',
      },
    ];
    render(<ExportCsvButton rows={rows} />);
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });
});
