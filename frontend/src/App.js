import './App.css';
import GamePage from "./pages/game/GamePage";
import {Route, Routes} from "react-router-dom";
import React from "react";
import ScoreLog from "./components/socrelog/ScoreLog";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/game" element={<GamePage />}/>
                <Route path="/main" element={<GamePage/>}/>
                <Route path="/black" element={<GamePage/>}/>
                <Route path="/white" element={<GamePage />}/>
                <Route path="/*" element={<ScoreLog width={500} height={800} side={"Black"} />}/>
            </Routes>
        </div>
    );
}

export default App;