import { render, screen } from '@testing-library/react';
import App from './App';

test('Main navbar is rendered', () => {
  render(<App />);
  const navbarElement = screen.getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();
});
