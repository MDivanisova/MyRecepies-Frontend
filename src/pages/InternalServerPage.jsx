import './Error.css'

export default function InternalServerPage(){
    return(
        <div className="error-page">
            <div className="error-code">500</div>
            <div className="error-message">Internal Server Error</div>
        </div>
    )
}