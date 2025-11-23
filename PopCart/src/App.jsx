// ...existing code...
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex gap-6 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="h-20 w-20 hover:scale-105 transition-transform" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="h-20 w-20 hover:rotate-6 transition-transform" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Vite + React</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md flex flex-col items-center gap-4">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-95 transition"
        >
          count is {count}
        </button>

        <p className="text-sm text-gray-600">
          Edit <code className="bg-gray-100 px-1 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
// ...existing code...