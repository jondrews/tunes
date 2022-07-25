import './App.css'
import { Stack, Button } from 'react-bootstrap';

const App = () => {
  return (
    <div className="App">
      <p>Tunes app!</p>
      <Stack direction="horizontal" gap={2}>
        <Button as="a" variant="primary">
          Primary button test
        </Button>
        <Button as="a" variant="outline-success">
          Success button test
        </Button>
      </Stack>
    </div>
  )
}

export default App
