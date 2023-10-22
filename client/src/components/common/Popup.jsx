import '../../styles/Popup.css';
import { BsXLg } from 'react-icons/bs';
import Button from './button/Button';

function Popup({ content, caption, onClose }) {
    return (
        <div className="popup_wrapper flex width-full height-full justify-center align-center">
            <div className="popup_container flex flex-column">
                <div className="popup_header flex justify-between align-center">
                    { caption || '' }
                    <Button onClick={onClose} icon={<BsXLg />} />
                </div>
                { content }
            </div>
        </div>
    );
}

export default Popup;
