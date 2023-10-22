import { BsTrash } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import usePost from '../../hooks/usePost';
import AutocompleteInput from '../common/AutocompleteInput';
import Button from '../common/button/Button';
import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';

function UserGroupForm({ user, hintFetch, onClose }) {
    const [groups, setGroups] = useState([]);
    const [groupInput, setGroupInput] = useState('');
    const postGroups = usePost(
        '/set_user_group',
        onClose,
    );

    useEffect(() => {
        setGroups(user.groups || []);
    }, [user]);

    const addGroup = () => {
        if (!groups.includes(groupInput)) {
            setGroups((state) => {
                const newState = [...state];

                newState.push(groupInput);

                return newState;
            });
        }
    };

    const deleteGroup = (role) => {
        setGroups((state) => state.filter((item) => item !== role));
    };

    if (hintFetch.error || postGroups.error) {
        return <ErrorMessage message={hintFetch.error || postGroups.error} />;
    }

    if (hintFetch.isLoading) {
        return <Loading description="Получаем ваши решения" />;
    }

    if (postGroups.isLoading) {
        return <Loading description="Отправляем запрос на сервер" />;
    }

    return (
        <div>
            <h4> Группы пользователя { user.username } </h4>
            <AutocompleteInput
                items={hintFetch.data}
                onValueChanged={(role) => { setGroupInput(role); }}
            />
            <button onClick={() => { addGroup(); }}> Добавить группу </button>
            {
                groups.map((role) => (
                    <div key={role} className="flex justify-between">
                        { role }
                        <Button onClick={() => { deleteGroup(role); }} icon={<BsTrash />} />
                    </div>
                ))
            }
            <button
                onClick={() => {
                    postGroups.fetch(
                        JSON.stringify({
                            user_id: user._id,
                            groups,
                        }),
                        { headers: { 'Content-Type': 'application/json' } },
                    );
                }}
            >
                Сохранить
            </button>
        </div>
    );
}

export default UserGroupForm;
