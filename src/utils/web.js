const parseRequestBody = async (request) => {
    return await new Promise((resolve) => {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk;
        });

        request.on("end", async () => {
            try {
                const json = JSON.parse(body);
                resolve(json);
            } catch {
                resolve({});
            }
        });
    });
};

const cookies = (request) => {
    try {
        const formated = {};
        const cookies = request.headers.cookie.replace(/\s/g, "").split(";");
        for (const cookie of cookies) {
            const data = cookie.split("=");
            const index = data[0];
            const value = data[1];
            formated[index] = value;
        }

        return formated;
    } catch {
        return {};
    }
};

const setCortsRequest = (request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");

    const domain = request.headers.origin;
    if (!domain) {
        return response.setHeader("Access-Control-Allow-Origin", "*");
    }

    response.setHeader("Access-Control-Allow-Origin", domain);
};

export default { parseRequestBody, cookies, setCortsRequest };
