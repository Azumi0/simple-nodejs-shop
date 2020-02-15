const HttpStatus = require('http-status-codes');

class ResponseHelper {
    /**
     * Return Error
     *
     * @param {ServerResponse} response
     * @param {number} code response code
     * @param {string} message response message
     */
    static errorResponse(response, code, message = '') {
        const errorData = {
            status: code,
            detail: message.length > 0 ? message : HttpStatus.getStatusText(code),
        };

        return ResponseHelper.modelResponse(response, errorData, code);
    }

    /**
     * Return json response
     *
     * @param {ServerResponse} response
     * @param {object} data object with data
     * @param {number} code response code
     */
    static modelResponse(response, data, code = HttpStatus.OK) {
        response.writeHead(code, {
            'Content-Type': 'application/json',
        });

        response.end(JSON.stringify(data));
    }
}

module.exports = ResponseHelper;
