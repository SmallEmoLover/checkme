import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../styles/TasksList.css'
import Loading from './Loading';

/**
 * Component to show all available tasks
 */
function TasksList() {
    let [tasks, error] = useFetch('/tasks');
    let navigate = useNavigate();

    if (!tasks) {
        return <Loading description='Получаем список задач'/>
    }

    return (
        <div>
            <h2> Список задач </h2> 
            {tasks.map((task) => {
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
