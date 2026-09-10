import './menuComponent.css'
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';


export default function MenuComponent({path}){

    const {user, logout} = useAuth();
    const role = user?.role.roleName;

    const menuAccess = {
        addRecipe: ['admin', 'chief'],
        editUsers: ['admin', 'userAdministrator'],
    };

    function logOutHandle(){
        logout();
        localStorage.removeItem("recommendations")
    }

    const canAccess = (item) => menuAccess[item].includes(role);

    return(
        <div className="sidebar">
            <div className="sidebar-logo"></div>

            <Link to='/' className={path == "home" ? "menu-item menu-item-selected" : "menu-item"}><i className="fa-solid fa-house"></i>Home</Link>
            <Link to='/profile/me' className={path == "profile/me" ? "menu-item menu-item-selected" : "menu-item"}><i className="fa-solid fa-circle-user"></i>Profile</Link>
            <Link to='/bookmarks' className={path == "bookmarks" ? "menu-item menu-item-selected" : "menu-item"}><i className="fa-solid fa-bookmark"></i>Bookmark</Link>
            <Link to='/statistic' className={path == "statistic" ? "menu-item menu-item-selected" : "menu-item"}><i className="fa-solid fa-square-poll-vertical"></i>Statistic</Link>

            {canAccess('addRecipe') && (
                <Link to='/addRecepie' className={path == "addRecepie" ? "menu-item menu-item-selected" : "menu-item"}><i className="fa-solid fa-square-plus"></i>Add Recepie</Link>
            )}

            {canAccess('editUsers') && (
                <Link to='/manageUsers' className={path == "manageUsers" ? "menu-item menu-item-selected" : "menu-item"}><i className="fa-solid fa-user-pen"></i>Manage Users</Link>
            )}

            <div className="menu-bottom-group">
                <Link to='/help' className={path == "help" ? "menu-item menu-item-selected" : "menu-item"}><i className="fa-solid fa-circle-info"></i>Help</Link>
                <div onClick={logOutHandle} className="menu-item"><i className="fa-solid fa-right-from-bracket"></i>Logout</div>
            </div>
        </div>





        
    )
}