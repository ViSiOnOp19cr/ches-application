
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import {Landing} from './pages/home'
import {Game} from './pages/game'

function App() {


  return (
    <div>
      <div className='h-screen bg-slate-800'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/game" element={<Game/>}/>
        </Routes>
      </BrowserRouter>
      </div>
    </div>
  )
}

export default App
