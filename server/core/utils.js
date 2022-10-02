/**
 * Wraps async function with express error handler when error occurred
 * @param callback - function to wrap
 * @returns wrapped `callback` function
 */
function runRouteAsync(callback) {
    return function runAsync(request, response, next) {
        callback(request, response, next).catch(next);
    };
}

module.exports.runRouteAsync = runRouteAsync;
