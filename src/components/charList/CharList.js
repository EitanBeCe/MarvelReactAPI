import { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./charList.scss";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";

const NUM_FROM_WHICH_CHAR = 210;
const NUM_OF_CHARS_ON_PAGE = 9;

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case "waiting":
            return <Spinner />;
        case "loading":
            return newItemLoading ? <Component /> : <Spinner />;
        case "confirmed":
            return <Component />;
        case "error":
            return <ErrorMessage />;
        default:
            throw new Error("Unexpected process state");
    }
};

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(NUM_FROM_WHICH_CHAR);
    const [charEnded, setCharEnded] = useState(false);

    const { getAllCharacters, process, setProcess } = useMarvelService();
    //randomChar = new RandomChar();

    // instead componentDidMount()
    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess("confirmed"));
    };

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < NUM_OF_CHARS_ON_PAGE) {
            ended = true;
        }

        setCharList([...charList, ...newCharList]);
        // setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset((offset) => offset + NUM_OF_CHARS_ON_PAGE);
        setCharEnded(ended);
    };

    // refs from lesson 159
    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach((item) =>
            item.classList.remove("char__item_selected")
        );
        itemRefs.current[id].classList.add("char__item_selected");
        itemRefs.current[id].focus();
    };

    // For optimisation
    // For not to put it in render()
    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { objectFit: "cover" };
            if (
                item.thumbnail ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
            ) {
                imgStyle = { objectFit: "unset" };
            }

            return (
                // Transition does not work because of  helmet and callback needed there , 188
                <CSSTransition
                    key={item.id}
                    timeout={700}
                    classNames="char__item"
                >
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={(el) =>
                            (itemRefs.current[i] = el)
                        } /* push elements to arr el */
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}
                    >
                        <img
                            src={item.thumbnail}
                            alt={item.name}
                            style={imgStyle}
                        />
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            );
        });
        // To make spinner in center
        return (
            <ul className="char__grid">
                {/* component={null} helps not to do a div from TransitionGroup, that can make problems on the template  */}
                <TransitionGroup component={null}>{items}</TransitionGroup>
            </ul>
        );
    }

    // replaced by setContent
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading && !newItemLoading ? <Spinner/> : null;

    // fils of bug from lesson 188
    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading);
        // eslint-disable-next-line
    }, [process]);

    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ display: charEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

// check of props type
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
