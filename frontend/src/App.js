import './App.css';
import GamePage from "./pages/game/GamePage";
import JudgePage from "./pages/judge/JudgePage";
import {Route, Routes} from "react-router-dom";
import React from "react";
import MajorJudgePage from "./pages/judge/MajorJudgePage";
import StreamPage from './pages/game/StreamPage';

function App() {
    return (
        <div className="App" style={{width: '100vw', height: '100vh'}}>
            <Routes>
                <Route path="/game" element={<GamePage />}/>
                <Route path="/stream" element={<StreamPage />}/>
                <Route path="/main-black" element={<MajorJudgePage side={"Black"}/>}/>
                <Route path="/main-white" element={<MajorJudgePage side={"White"}/>}/>
                <Route path="/black" element={<JudgePage side={"Black"} />}/>
                <Route path="/white" element={<JudgePage side={"White"} />}/>
                <Route path="/*" element={<GamePage />}/>
            </Routes>
        </div>
    );
}

export default App;