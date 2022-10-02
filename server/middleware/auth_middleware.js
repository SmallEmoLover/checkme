const jwt = require('jsonwebtoken');

function add_authorization(database, jwt_secret) {
    return async function authorize(request, response, next) {
        let token = request.headers.authentication;
        if (!token || !token.startsWith('Bearer')) {
            response.status(401).send(JSON.stringify({ error: 'Требуется авторизация' }));
            return;
        }

        let user_data = {};
        [, token] = token.split(' ');
        try {
            user_data = jwt.verify(token, jwt_secret).user_data;
        } catch {
            // Just continue with empty user_data
        }

        const user = await database.users.get(user_data.username);

        if (!user) {
            response.status(401).send(JSON.stringify({ error: 'Недействительный токен' }));
            return;
        }

        request.auth_user = user;

        next();
    };
}

module.exports.add_authorization = add_authorization;
