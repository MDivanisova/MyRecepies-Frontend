import AsideAuthComponent from "../components/AsideAuthComponent";
import LoginFormComponent from "../components/loginPage/LoginFormComponent";
import "./loginPage.css"

export default function LoginPage(){
    return (
        <div className="login-page">
            <LoginFormComponent />
            <AsideAuthComponent text={
                    <>
                        <span>Welcome back, food lover!</span>
                        <span>Let's get cooking and discover something delicious.</span>
                    </>
            } path="login"/>
        </div>
    )
}