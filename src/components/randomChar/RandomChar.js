import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

 
import mjolnir from '../../resources/img/mjolnir.png';
import './randomChar.scss';



const RandomChar = () => {
    
    const [char, setChar] = useState(null);
    const {getCharacter, clearError, process, setProcess} = useMarvelService(); 

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId)
        }
        // eslint-disable-next-line
    }, [])
    
    // сработает как char загрузится, а лодинг остановится
    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); //получать персов в диапазоне
        // 1017100
        getCharacter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    // //заменено на setContent(автоматы)
    // // выдача ошибки или загрузки или контента
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // const content = !(loading || error || !char) ? <View char={char} /> : null;
        

    return (
        <div className="randomchar">
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main">
                    <div className="inner"
                        onClick={updateChar}
                        >try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

// простой рендерящий компонент, просто выдает инфу
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
        <img src={thumbnail} 
            alt="Random character" 
            className="randomchar__img"
            style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;