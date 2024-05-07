/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './components/App';
import TasksList from './components/task/TasksList';
import Task from './components/task/Task';
import Result from './components/Result';
import TaskForm from './components/task/TaskForm';
import ResultList from './components/ResultList';
import History from './components/History';
import UserList from './components/user/UserList';

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
                <Route path='/history/:page' element={<History/>}/>
                <Route path='/users' element={<UserList/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);
