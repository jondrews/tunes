import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './components/HomePage/HomePage'
import PageNotFound from './components/PageNotFound/PageNotFound'
import TunePlayer from './components/TunePlayer/TunePlayer'
import MyTunes from './components/MyTunes/MyTunes'
import Navigation from './components/Navigation/Navigation'
import './App.css'

const App = () => {
  return (
    <div className="App">
      App
      <BrowserRouter>
      <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tunes" element={<MyTunes />}>
            <Route path=":tuneId" element={<TunePlayer />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
