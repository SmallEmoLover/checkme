import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../styles/TasksList.css'
import Loading from './Loading';

/**
 * Component to show all available tasks
 */
function TasksList() {
    let fetchTasks = useFetch('/tasks');
    let navigate = useNavigate();

    if (fetchTasks.error) {
        return <ErrorMessage message={fetchTasks.error}/>
    }

    if (!fetchTasks.data) {
        return <Loading description='Получаем список задач'/>
    }

    return (
        <div>
            <h2> Список задач </h2> 
            {fetchTasks.data.map((task) => {
                return (
                    <div key={task._id} className='block task-item' onClick={() => navigate(`/task/${task._id}`)}>
                        {task.name}
                    </div>
                )
            })}
        </div>
    )
}

export default TasksList;
