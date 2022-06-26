import {useHttp} from '../hooks/http.hook'

// класс ничего не наследует, тк будет на чистом js
const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();
    
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=b7ff5c83df16ffa569f250853078eeea';
    const _baseOffset = 210;

    // тут юзается API ссылка с сайта      по умолчанию
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    //ограничить инфу о персе, не получать все что только о нем есть
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.substr(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {loading, error, clearError, getCharacter, getAllCharacters};
}

export default useMarvelService;