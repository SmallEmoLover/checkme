import { useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import '../styles/TasksList.css'
import Loading from './Loading';

function TasksList() {
    let [fetchTasks, data, loading, error] = useFetch({tasks: []});
    useEffect(() => {fetchTasks('http://localhost:9999/tasks')}, [])
    return(
        <div>
            <Loading isLoading={loading}/>
            {data.tasks.map((task) => {
                return <div> {task.name} </div>
            })}
        </div>
    )
}

export default TasksList;
