import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../styles/TasksList.css';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

/**
 * Component to show all available tasks
 */
function TasksList() {
    const fetchTasks = useFetch('/tasks');
    const navigate = useNavigate();

    if (fetchTasks.error) {
        return <ErrorMessage message={fetchTasks.error} />;
    }

    if (!fetchTasks.data) {
        return <Loading description="Получаем список задач" />;
    }

    return (
        <div>
            <h2> Список задач </h2>
            {fetchTasks.data.map((task) => (
                <div
                    key={task._id}
                    role="link"
                    tabIndex={0}
                    className="block task-item"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            navigate(`/task/${task._id}`);
                        }
                    }}
                    onClick={() => navigate(`/task/${task._id}`)}
                >
                    {task.name}
                </div>
            ))}
        </div>
    );
}

export default TasksList;
