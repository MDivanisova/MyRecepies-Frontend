import "./asideAuthComponent.css";

export default function AsideAuthComponent({text, path}){
    return (
        <div className={path === "register" ? "aside-auth-register" : "aside-auth-login"}>
            {text}
        </div>
    )
}
