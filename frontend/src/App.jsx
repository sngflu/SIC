import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './header/header'
import MainPage from './mainPage/mainPage'
import ResultPage from './resultPage/resultPage'

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
