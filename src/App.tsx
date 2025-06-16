import TodoApp from './TodoApp'
import './App.css'
import Navbar from './Components/Nav'
import { BrowserRouter } from 'react-router-dom'
import React, { useState } from 'react'

function App() {
  const [searchTerm,setsearchTerm] = useState("")
  return (
    <>
    <React.StrictMode>
    <BrowserRouter>
      <Navbar searchTerm={searchTerm} onSearchChange = {setsearchTerm}></Navbar>
      <TodoApp searchTerm={searchTerm}></TodoApp>
    </BrowserRouter>
  </React.StrictMode>
    </>
  )
}

export default App
