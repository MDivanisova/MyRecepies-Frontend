import HelpComponent from "../components/helpPage/HelpComponent";
import MenuComponent from "../components/MenuComponent";
import "./helpPage.css"

export default function HelpPage(){
    return (
        <div className="help-page">
            <MenuComponent path="help" />
            <HelpComponent />
        </div>
    )
}