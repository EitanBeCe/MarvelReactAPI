import { useState, useCallback } from "react";

// хук для работы с сервером, вывод спинера загрузки и ошибки
export const useHttp = () => {
    const [process, setProcess] = useState('waiting');

    // на всякий делаем юзколбек, тк она наверняка будет вызываться в дочерних. Пусть не обновляется каждый раз
    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        // при запросе сначала выводится спинер загрузки
        setProcess('loading');

        // попытка, но чтобы ошибка не сломала код, урок 106
        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${request.status}`);
            }

            const data = await response.json();

            return data;
        } catch (e) {
            setProcess('error');
            throw e;
        }
    }, []);
    // если вдруг была ошибка, не пришел перс с серва то ее надо потом удалить, иначе следующего тоже не выдст и будет висеть ошибка
    const clearError = useCallback(() => {
        setProcess('loading');
    }, []);

    return {request, clearError, process, setProcess};
}