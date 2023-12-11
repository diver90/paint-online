import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Page from "./components/Page";
import './styles/app.scss';

function App() {

    return (
            <div className="app">
                <Routes>
                    <Route path="/:id" element={<Page />} />
                    <Route path="*" element={<Navigate to={`f${(+new Date()).toString(16)}`} replace />}/>
                </Routes>

            </div>
    );
}

export default App;
