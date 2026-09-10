import AddNewRoleComponent from "../components/manageUsersPage/AddNewRoleComponent"
import MenuComponent from "../components/MenuComponent"

import "./manageUsersPage.css"

export default function AddNewRolePage(){
    return(
        <div className="add-new-role-page">
            <MenuComponent path="addNewRole"/>
            <AddNewRoleComponent />
        </div>
    )
}