import { useNavigate } from 'react-router-dom';
import './TasksList.css';
import withFetch from '../fetch/withFetch';

/**
 * Component to show all available tasks
 */
function TasksList({ fetchData: tasks }) {
    const navigate = useNavigate();

    return (
        <div>
            <h2> Список задач </h2>
            {tasks.map((task) => (
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

export default withFetch(TasksList, '/tasks');
