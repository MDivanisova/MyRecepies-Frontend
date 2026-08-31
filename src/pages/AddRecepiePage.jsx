import MenuComponent from "../components/MenuComponent";
import AddRecepieComponent from "../components/addRecepiePage/AddRecepieComponent";
import "./addRecepiePage.css"

export default function AddRecepiePage(){
    return(
        <div className="add-recepie-page">
            <MenuComponent path="addRecepie" />
            <AddRecepieComponent className="add-recepie-content" />
        </div>
    )
}