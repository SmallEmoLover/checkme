import { useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import '../styles/TasksList.css'
import Loading from './Loading';

function TasksList() {
    let [fetchTasks, tasks, loading, error] = useFetch([]);
    useEffect(() => {fetchTasks('http://localhost:9999/tasks')}, [])
    return(
        <div>
            <Loading isLoading={loading}/>
            {tasks.map((task) => {
                return <div> {task.name} </div>
            })}
        </div>
    )
}

export default TasksList;
