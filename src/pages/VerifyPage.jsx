import { useSearchParams } from "react-router-dom";
import VerifyFormComponent from "../components/verifyPage/VerifyFormComponent";
import "./verifyPage.css"

export default function VerifyPage(){
    const [params] = useSearchParams();    
    return(
        <div className="verify-page">
            <VerifyFormComponent email={params.get('email')} />
        </div>
    )
}