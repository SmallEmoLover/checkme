import { useContext } from 'react';
import PopupContext from '../../context/PopupContext';
import useFetch from '../../hooks/useFetch';
import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';
import UserGroupForm from './UserGroupForm';

function UserList() {
    const fetchResults = useFetch('/users');
    const groupHints = useFetch('/groups');
    const popup = useContext(PopupContext);

    if (fetchResults.error) {
        return <ErrorMessage message={fetchResults.error} />;
    }

    if (!fetchResults.data) {
        return <Loading description="Получаем пользователей" />;
    }

    const changeRole = (user) => {
        const popupId = `role_change_${user.id}`;

        popup.openPopup(popupId, {
            content: (
                <UserGroupForm
                    hintFetch={groupHints}
                    user={user}
                    onClose={() => { popup.closePopup(popupId); }}
                />
            ),
            caption: 'Выберите роли',
        });
    };

    return (
        <div>
            <h2> Список пользователей </h2>
            {fetchResults.data.map((user) => (
                <div key={user._id}>
                    <div> {user.name} {user.surname} ({user.username}) </div>
                    <button onClick={() => changeRole(user)}> Изменить роли </button>
                </div>
            ))}
        </div>
    );
}

export default UserList;
