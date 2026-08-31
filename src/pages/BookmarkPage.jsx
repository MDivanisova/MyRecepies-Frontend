import BookmarkComponent from "../components/bookmarkPage/BookmarkComponent"
import MenuComponent from "../components/MenuComponent"

import "./bookmarkPage.css"

export default function BookmarkPage(){
    return(
        <div className="bookmark-page">
            <MenuComponent path="bookmarks"/>
            <BookmarkComponent />
        </div>
    )
}