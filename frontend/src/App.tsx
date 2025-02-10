
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import {Landing} from './pages/home'

function App() {


  return (
    <div>
      <div className='h-screen bg-slate-800'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
        </Routes>
      </BrowserRouter>
      </div>
    </div>
  )
}

export default App
