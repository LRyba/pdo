import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders', () => {
  render(<App />);
  const title = screen.getByText(/Drafcik/i);
  expect(title).toBeInTheDocument();
});
