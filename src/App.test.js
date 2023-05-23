import { render, screen } from "@testing-library/react"
import App from "./App"

test("App container is rendered", () => {
  render(<App />)
  const appContainer = screen.getByTestId("App")
  expect(appContainer).toBeInTheDocument()
})
