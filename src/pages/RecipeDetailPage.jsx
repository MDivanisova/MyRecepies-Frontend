
import MenuComponent from "../components/MenuComponent";
import RecipeDetailComponent from "../components/recipeDetailPage/RecipeDetailComponent";

import "./recipeDetailPage.css"

export default function RecipeDetailPage(){
    return(
        <div className="recipe-detail-page">

            <MenuComponent path="recipeDetails" />
            <RecipeDetailComponent />

        </div>
    )
}


