
import './charInfo.scss';

import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import { useEffect, useState } from 'react';
import setContent from '../../utils/setContent';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess} = useMarvelService(); 

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if(!charId) {return};
        
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

        // сработает как char загрузится, а лодинг остановится
        const onCharLoaded = (char) => {
            setChar(char);
        }


    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

// простой рендерящий компонент, просто выдает инфу
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    
    return (
        // тег фрагмента по умолчанию
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length>0 ? null : 'There is no comics for this character'}
                { 
                    // eslint-disable-next-line
                    comics.map((item, i) => {
                        //выдавать до 10 комиксов. и заигнорить предупреждение
                        if (i<10) {
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        }
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number // проветрка, этот проп должен быть числом
}

export default CharInfo;