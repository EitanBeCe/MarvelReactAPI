import Spinner from "../components/spinner/Spinner";
import ErrorMessage from "../components/errorMessage/ErrorMessage";
import Skeleton from "../components/skeleton/Skeleton";

// States
const setContent = (process, Component, data) => {
    switch (process) {
        case "waiting":
            return <Skeleton />;
        case "loading":
            return <Spinner />;
        case "confirmed":
            return <Component data={data} />;
        case "error":
            return <ErrorMessage />;
        default:
            throw new Error("Unexpected process state");
    }
};
// Replaced this for example
// const skeleton = char || loading || error ? null : <Skeleton/>;
// const errorMessage = error ? <ErrorMessage/> : null;
// const spinner = loading ? <Spinner/> : null;
// const content = !(loading || error || !char) ? <View char={char}/> : null;
// return (
//     <div className="char__info">
//         {skeleton}
//         {errorMessage}
//         {spinner}
//         {content}
//     </div>
// )

export default setContent;
