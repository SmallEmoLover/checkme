import '../styles/Footer.css';

/**
 * Footer component with contact info
 */
function Footer() {
    return (
        <div className="Footer">
            <p> Сервис находится в разработке. </p>
            <p> По возникшим вопросам обращаться: </p>
            <p>
                <a target="_blank" href="https://moodle.uniyar.ac.ru/user/profile.php?id=13618" rel="noreferrer">
                    Анатолий Полетаев
                </a> - вопросы по структуре, содержанию заданий.
            </p>
            <p>
                <a target="_blank" href="https://vk.com/id131796792" rel="noreferrer">
                    Кулаков Даниил
                </a> - вопросы по работе сервиса, предложения по улучшению и т.п.
            </p>
        </div>
    );
}

export default Footer;
