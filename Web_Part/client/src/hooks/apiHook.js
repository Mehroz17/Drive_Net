import { useState, useEffect } from 'react';


const baseURL = "http://localhost:3001";
function getFullUrl(target){
    return baseURL + (target[0] === '/' ? target : '/' + target);
}

export const useGetData = (target, token='', { defValue = [], onSuccess, onFail} = {}) => {
    const [data, setData] = useState(defValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        
        const fetchData = async () => {
            //if target has been set, then get the data
            //other wise wait for the user to call getData()
            if (target)
                getData();
        };

        fetchData();
    }, [target, token]);

    const getData = async (newTarget) => {
        setIsLoading(true);
        //if user didn't set the target previously then data wasn't fetched
        // so user can set the new Target while calling getData()
        if (newTarget)
            target = newTarget;
        else if (!target && !newTarget){
            setError("No target set to get data from !")
            return;
        }

        try {
            const headers = {};

            if (token != '') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(getFullUrl(target), {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonData = await response.json();
            setData(jsonData);
            if (onSuccess){
                onSuccess(jsonData);
            }
        } catch (err) {
            if (onFail)
                onFail(err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { data, isLoading, error, getData };
}


export const usePostData = (target, token='') => {
    
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const postData = async (values, newTarget, {onSuccess, onFail}={}) => {
        if (newTarget) //dynamic urls/targets might be required
            target = newTarget;
            
        if (!target){
            setError("No target set to get data from !")
            return;
        }

        try {
            const headers = {};

            if (token != '') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(getFullUrl(target), {
                method: "POST",
                headers: headers,
                body: values
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json()
            setResponse(result);
            if (onSuccess)
                onSuccess(result);
            
        } catch (err) {
            setError(err.message);
            if (onFail)
                onFail(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    return { response, isLoading, error, postData };
}



export const usePutData = (target, token='') => {
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const putData = async (values, newTarget, {isJson = true, onSuccess}={}) => {
        setError(null);
        if (newTarget) //dynamic urls/targets might be required
            target = newTarget;
            
        try {
            if (!target){
                throw new Error("No target set to get data from !");
            }
            const headers = {};

            if (token != '') {
                headers['Authorization'] = `Bearer ${token}`;    
            }

            if (isJson){
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(getFullUrl(target), {
                method: "PUT",
                headers: headers,
                body: values
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResponse(data);
            if (onSuccess)
                onSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { response, isLoading, error, putData };
}

export const usePatchData = (target, token='') => {
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const patchData = async (values, newTarget, {isJson = true, onSuccess, onFail}={}) => {
        setError(null);
        if (newTarget) //dynamic urls/targets might be required
            target = newTarget;
            
        try {
            if (!target){
                throw new Error("No target set to get data from !");
            }
            const headers = {};

            if (token != '') {
                headers['Authorization'] = `Bearer ${token}`;    
            }

            if (isJson){
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(getFullUrl(target), {
                method: "PATCH",
                headers: headers,
                body: values
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResponse(data);
            if (onSuccess)
                onSuccess(data);
        } catch (err) {
            if (onFail)
                onFail(err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { response, isLoading, error, patchData };
}



export const useDelData = (target, token='') => {
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const delData = async (values, newTarget, {isJson = true, onSuccess, onFail}={}) => {
        setError(null);
        if (newTarget) //dynamic urls/targets might be required
            target = newTarget;
            
        try {
            if (!target){
                throw new Error("No target set to get data from !");
            }
            const headers = {};

            if (token != '') {
                headers['Authorization'] = `Bearer ${token}`;    
            }

            if (isJson){
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(getFullUrl(target), {
                method: "DELETE",
                headers: headers,
                body: values
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResponse(data);
            if (onSuccess)
                onSuccess(data);
        } catch (err) {
            if (onFail)
                onFail(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { response, isLoading, error, delData };
}