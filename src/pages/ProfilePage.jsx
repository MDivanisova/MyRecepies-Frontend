import MenuComponent from "../components/MenuComponent";
import ProfileComponent from "../components/profilePage/ProfileComponent";
import "./profilePage.css";

export default function ProfilePage(){
    return(
        <div className="profile-page">
            <MenuComponent path="profile" />
            <ProfileComponent />
        </div>
    )
}