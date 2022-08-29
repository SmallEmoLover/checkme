import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './components/App';
import TasksList from './components/TasksList';
import Task from './components/Task';
import Result from './components/Result';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<App/>}>
                    <Route path='/' element={<TasksList/>}/>
                    <Route path='/task/:taskId' element={<Task/>}/>
                    <Route path='/results/:checkId' element={<Result/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
