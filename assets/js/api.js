// CRUD functions using jQuery
const API = {
    _baseUrl: 'http://careersnap.ddns.net:3001/',
    endPoints: {
        auth: {
            _signup: 'auth/signup',
            _signin: 'auth/signin',
            _recovery: 'auth/recovery'
        },
    },

    postData: async(url = '', data = {}, token = null) => {

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                    // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            strictErrors: true,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return parseJSON(response);
    },

    getData: async(url = '', token = null) => {

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            strictErrors: true,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        });

        return parseJSON(response);
    },

    deleteData: async(url = '', data = {}, token = null) => {

        const response = await fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            strictErrors: true,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return parseJSON(response);
    },

    updateData: async(url = '', data = {}, token = null) => {

        const response = await fetch(url, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                    // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            strictErrors: true,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return parseJSON(response);
    }
}

const parseJSON = (response) => {
    return new Promise((resolve) => response.json()
        .then((json) => resolve({
            status: response.status,
            ok: response.ok,
            json,
        })));
}