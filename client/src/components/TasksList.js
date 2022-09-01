import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../styles/TasksList.css'
import Loading from './Loading';

/**
 * Component to show all available tasks
 */
function TasksList() {
    let [tasks, error] = useFetch('http://localhost:9999/tasks');

    if (!tasks) {
        return <Loading description='Получаем список задач'/>
    }

    return (
        <div>
            <h2> Список доступных задач: </h2> 
            {tasks.map((task, index) => {
                return (
                    <Link key={task._id} to={`/task/${task._id}`}>
                        <div> {index + 1}: {task.name} </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default TasksList;
