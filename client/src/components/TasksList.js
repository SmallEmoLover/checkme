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
        return <Loading/>
    }

    return (
        <div>
            {tasks && tasks.map((task) => {
                return (
                    <Link key={task.id} to={`/task/${task.id}`}>
                        <div> {task.name} </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default TasksList;
