import {useHttp} from '../hooks/http.hook'

// класс ничего не наследует, тк будет на чистом js
const useMarvelService = () => {

    const {request, clearError, process, setProcess} = useHttp();
    
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=b7ff5c83df16ffa569f250853078eeea';
    const _baseOffset = 210;

    // тут юзается API ссылка с сайта      по умолчанию
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }


        // Вариант модификации готового метода для поиска по имени. 
    // Вызывать его можно вот так: getAllCharacters(null, name)

    // const getAllCharacters = async (offset = _baseOffset, name = '') => {
    //     const res = await request(`${_apiBase}characters?limit=9&offset=${offset}${name ? `&name=${name}` : '' }&${_apiKey}`);
    //     return res.data.results.map(_transformCharacter);
    // }

    // Или можно создать отдельный метод для поиска по имени

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }


    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
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
    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
        }
    }

    return {clearError, 
            process, 
            setProcess,
            getCharacter, 
            getAllCharacters, 
            getAllComics, 
            getComic, 
            getCharacterByName};
}

export default useMarvelService;