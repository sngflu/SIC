import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/header/header'
import MainPage from './components/mainPage/mainPage'
import ResultPage from './components/resultPage/resultPage'

function App() {
  return (
    <Router>
      <div className='App'>
        <div className='header'>
          <Header>Weapon Detection</Header>
        </div>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/result' element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
