import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './components/App';
import TasksList from './components/TasksList';
import Task from './components/Task';
import Result from './components/Result';
import TaskForm from './components/TaskForm';
import ResultList from './components/ResultList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route element={<App/>}>
                <Route path='/' element={<TasksList/>}/>
                <Route path='/task/new' element={<TaskForm/>}/>
                <Route path='/task/:taskId' element={<Task/>}/>
                <Route path='/results/me' element={<ResultList/>}/>
                <Route path='/results/:checkId' element={<Result/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);
