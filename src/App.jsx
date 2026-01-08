import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import BoardList from './components/BoardList';
import Write from './components/Write';
import View from './components/View';
import { BrowserRouter, Routes, Route } from "react-router";
import { useState, useCallback } from 'react';

function App() {
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [boardId, setBoardId] = useState(0);

  const startModify = useCallback((id)=>{
    setBoardId(id);
    setIsModifyMode(true);
  },[]); 

  const resetModify = useCallback(()=>{
    setBoardId(0);
    setIsModifyMode(false);
  },[]); 

  return (
    <BrowserRouter>
      <div className='container'>
        <h1>React BBS</h1>
        <Routes>
          <Route path="/" element={<BoardList/>} />
          <Route path="/write" element={<Write isModifyMode={isModifyMode} boardId={boardId} onResetModify={resetModify}/>} />
          <Route path="/view/:id" element={<View onStartModify={startModify}/>} />
        </Routes>        
      </div>
    </BrowserRouter>
  )
}

export default App
