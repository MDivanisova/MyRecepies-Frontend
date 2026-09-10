import { useParams } from "react-router-dom";
import MenuComponent from "../components/MenuComponent";
import ProfileComponent from "../components/profilePage/ProfileComponent";
import "./profilePage.css";
import OtherProfileComponent from "../components/profilePage/OtherProfileComponent";

export default function ProfilePage(){
    const { userId } = useParams();
    
    return(
        <div className="profile-page">
            <MenuComponent path={userId === undefined ? "profile/me": "profile/:id"} />
            {userId === undefined ? <ProfileComponent /> : <OtherProfileComponent userId={userId}/> }
        </div>
    )
}