class HttpMethod {
    static GET = 'GET';
    static POST = 'POST';
    static PUT = 'PUT';
    static POST = 'POST';
    static DELETE = 'DELETE';
}
class Exception {
    constructor(msg) {
        this.msg = msg;
    }
    to_string() {
        return this.msg;
    }
}

async function http_method(url, method = HttpMethod.GET, data, timeout = 1000) {


    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url,
        {
            method: method,
            body: data ? JSON.stringify(data) : undefined,
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        });
    clearTimeout(id);

    const response_json = await response.json();
    if (response.status != 200) {

        if (response_json && response_json.error_msg)
            throw new Exception(response_json.error_msg);
        if (response_json)
            throw new Exception(response_json);
    }

    return response_json;

}


module.exports = {
    'HttpMethod': HttpMethod,
    'Exception': Exception,
    http_method: http_method

}