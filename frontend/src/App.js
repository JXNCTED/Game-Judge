import './App.css';
import GamePage from "./pages/game/GamePage";
import JudgePage from "./pages/judge/JudgePage";
import {Route, Routes} from "react-router-dom";
import React from "react";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/game" element={<GamePage />}/>
                <Route path="/main" element={<GamePage/>}/>
                <Route path="/black" element={<JudgePage/>}/>
                <Route path="/white" element={<JudgePage />}/>
                <Route path="/*" element={<GamePage />}/>
            </Routes>
        </div>
    );
}

export default App;