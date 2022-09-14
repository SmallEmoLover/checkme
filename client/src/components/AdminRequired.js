const { useContext } = require("react");
const { default: AuthContext } = require("../context/AuthContext");

/**
 * A component to hide children elements if username !== 'admin'
 * @param {*} props - expects children elements
 */
function AdminRequired(props) {
    const authorization = useContext(AuthContext);
    if (authorization.username === 'admin') {
        return props.children;
    } else {
        return null;
    }
}

export default AdminRequired;
