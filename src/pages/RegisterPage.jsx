import AsideAuthComponent from "../components/AsideAuthComponent";
import RegisterFormComponent from "../components/registerPage/RegisterFormComponent";
import "./registerPage.css"

export default function RegisterPage(){
    return(
        <div className="register-page">
            <AsideAuthComponent text={
                    <>
                        <span>Made with love, shared with you.</span>
                        <span>Create your account and start your culinary adventure.</span>
                    </>
            } path="register"/>
            <RegisterFormComponent />
        </div>
    )
}