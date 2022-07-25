import React from 'react'
import { Stack, Button } from 'react-bootstrap'

import './HomePage.css'

export default function HomePage() {
  return (
    <div>
      HomePage
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
