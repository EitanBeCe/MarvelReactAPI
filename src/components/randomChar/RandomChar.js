import { Component } from 'react/cjs/react.production.min';
import MarvelService from '../../services/MarvelService';
 
import './randomChar.scss';
//import thor from '../../resources/img/thor.jpeg'; //это не импорт thor, а так засовываем ссылку в переменную
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class RandomChar extends Component {
    
    state = {
        char: {},
        loading: true,
        error: false
    }

    // это новое свойство внутри класса RandomChar. Поле класса
    marvelService = new MarvelService(); 

    componentDidMount() {
        this.updateChar();
    }
    

    // сработает как char загрузится, а лодинг остановится
    onCharLoaded = (char) => {
        this.setState({
            char, // равно char: char
            loading: false
        }) 
    }

    //для клика апдейта Try It
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        }) 
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); //получать персов в диапазоне
        // 1017100
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state;
        // выдача ошибки или загрузки или контента
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;
        

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
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
                            onClick={this.updateChar}
                            >try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

// простой рендерящий компонент, просто выдает инфу
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle;
    (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? imgStyle = {'objectFit': 'contain'} : imgStyle= {'objectFit': 'cover'}

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