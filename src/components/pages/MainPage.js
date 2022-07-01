import { Helmet } from "react-helmet"; //сделать метатеги к каждой странице,  SEO
import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearchForm from "../charSearchForm/CharSearchForm";

import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';



const MainPage = () => {

    const [selectedChar, setChar] = useState(null);

    // работа с отображением справа перса выбранного из карточек
    // тут надо будет поднять состояние из карточки (id) и передать в отображалку справа.
    const onCharSelected = (id) => {
        setChar(id);
    }

    return(
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"
                    />
                <title>Marvel information portal</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <div>
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharSearchForm />
                    </ErrorBoundary>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;