//import { __esModule } from "@testing-library/jest-dom/dist/matchers";

// класс ничего не наследует, тк будет на чистом js
class MarvelService {
    
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=b7ff5c83df16ffa569f250853078eeea';
    _baseOffset = 210;
    
    // async ставится перед функцией
    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json(); // json возвращает промис
    }

    // тут юзается API ссылка с сайта      по умолчанию
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharachter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharachter(res.data.results[0]);
    }

    //ограничить инфу о персе, не получать все что только о нем есть
    _transformCharachter = (char) => {
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
}

export default MarvelService;