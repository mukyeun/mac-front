import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HealthInfoForm from './HealthInfoForm';

describe('HealthInfoForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  test('renders form fields correctly', () => {
    render(<HealthInfoForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/신장/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/체중/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/혈압/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/혈당/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /저장/i })).toBeInTheDocument();
  });

  test('handles form submission with valid data', async () => {
    render(<HealthInfoForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/신장/i), { target: { value: '170' } });
    fireEvent.change(screen.getByLabelText(/체중/i), { target: { value: '70' } });
    fireEvent.change(screen.getByLabelText(/혈압/i), { target: { value: '120/80' } });
    fireEvent.change(screen.getByLabelText(/혈당/i), { target: { value: '95' } });

    fireEvent.click(screen.getByRole('button', { name: /저장/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        height: 170,
        weight: 70,
        bloodPressure: '120/80',
        bloodSugar: 95
      });
    });
  });

  test('validates input fields', async () => {
    render(<HealthInfoForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/신장/i), { target: { value: '-170' } });
    fireEvent.change(screen.getByLabelText(/체중/i), { target: { value: '0' } });

    fireEvent.click(screen.getByRole('button', { name: /저장/i }));

    await waitFor(() => {
      expect(screen.getByText(/올바른 신장을 입력해주세요/i)).toBeInTheDocument();
      expect(screen.getByText(/올바른 체중을 입력해주세요/i)).toBeInTheDocument();
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });
});