import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';

// из темы автоматов. Вместо закоменченого кода ниже кот был в CharInfo например
// break не надо тк есть return.
const setContent = (process, Component, data) => {
    switch (process) {
        case 'waiting':
            return <Skeleton/>;  
        case 'loading':
            return <Spinner/>;
        case 'confirmed':
            return <Component data={data}/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}
    // const skeleton = char || loading || error ? null : <Skeleton/>;
    // // выдача ошибки или загрузки или контента
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