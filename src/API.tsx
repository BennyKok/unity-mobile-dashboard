export interface HttpResponse<T> extends Response {
    parsedBody?: T;
}

export async function http<T>(
    request: RequestInfo
): Promise<HttpResponse<T>> {

    const response: HttpResponse<T> = await fetch(
        request
    );

    try {
        // may error if there is no body
        const c = await response.json();
        // console.log(c);
        response.parsedBody = c;
    } catch (ex) {
        console.log(ex)
    }

    return response;
}

export async function getWithAuth<T>(
    apiKey: string,
    path: string,
    args?: RequestInit
): Promise<HttpResponse<T>> {
    args = {
        ...args,
        headers: {
            'Authorization': `Basic ${apiKey}`
        }
    }
    return await get<T>(path, args);
}

export async function postWithAuth<T>(
    apiKey: string,
    path: string,
    body: any,
    args?: RequestInit
): Promise<HttpResponse<T>> {
    args = {
        ...args,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${apiKey}`
        }
    }
    return await post<T>(path, body, args);
}

export async function get<T>(
    path: string,
    args?: RequestInit
): Promise<HttpResponse<T>> {
    args = {
        ...args,
        method: "get"
    }
    return await http<T>(new Request(path, args));
}

export async function post<T>(
    path: string,
    body: any,
    args?: RequestInit
): Promise<HttpResponse<T>> {
    args = {
        ...args,
        method: "post",
        body: JSON.stringify(body)
    }
    return await http<T>(new Request(path, args));
}

export async function put<T>(
    path: string,
    body: any,
    args: RequestInit = { method: "put", body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
    return await http<T>(new Request(path, args));
}