import { render, screen } from '@testing-library/react';
import App from './App';

test('App container is rendered', () => {
  render(<App />);
  const navbarElement = screen.getByTestId('App');
  expect(navbarElement).toBeInTheDocument();
});
