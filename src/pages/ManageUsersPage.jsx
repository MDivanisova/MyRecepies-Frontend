import ManageUsersComponent from "../components/manageUsersPage/ManageUsersComponent"
import MenuComponent from "../components/MenuComponent"

import "./manageUsersPage.css"

export default function ManageUsersPage(){
    return(
        <div className="manage-users-page">
            <MenuComponent path="manageUsers"/>
            <ManageUsersComponent />
        </div>
    )
}