const { useContext } = require("react");
const { default: AuthContext } = require("../context/AuthContext");

function AdminRequired(props) {
    const authorization = useContext(AuthContext);
    if (authorization.username === 'admin') {
        return props.children;
    } else {
        return null;
    }
}

export default AdminRequired;
