import { useNavigate } from "react-router-dom";
import {
    createBookmark,
    removeBookmark
} from "../../utils/BookmarkEndpoint";
import { removeRecipe } from "../../utils/RecepieEndpoint";
import { useAuth } from "../../context/useAuth";

import "./recipeCardComponent.css";

export default function RecipeCardComponent({
    recipe,
    setRecepies,
    setRefresh
}) {

    const { token, user } = useAuth();

    const navigate = useNavigate();


    /* =========================
       RATING
    ========================= */

    const rating = Number(
        recipe.rating?.$numberDecimal || 0
    );


    /* =========================
       TIME
    ========================= */

    const preparationTime = Number(
        recipe.preparationTime?.$numberDecimal || 0
    );

    const cookingTime = Number(
        recipe.cookingTime?.$numberDecimal || 0
    );

    const totalTime =
        preparationTime + cookingTime;


    /* =========================
       OPEN RECIPE
    ========================= */

    const handleCardClick = () => {

        navigate("/PageNotfound");

    };


    /* =========================
       REMOVE RECIPE
    ========================= */

    async function handleRemoveRecipe() {

        const data = await removeRecipe(
            token,
            recipe._id
        );


        if (data.succ === true) {

            setRecepies(prevRecipes =>
                prevRecipes.filter(
                    r => r._id !== recipe._id
                )
            );

            setRefresh(prev => prev + 1);

        }

        else if (data.status === 401) {

            // relogin

        }

        else if (data.status === 500) {

            // page not found

        }

    }


    /* =========================
       BOOKMARK
    ========================= */

    const handleBookmark = async () => {

        let data;


        if (recipe.isBookmarked) {

            data = await removeBookmark(
                token,
                recipe._id
            );

        } else {

            data = await createBookmark(
                token,
                recipe._id
            );

        }


        if (data.succ === true) {

            setRecepies(prevRecipes =>
                prevRecipes.map(r =>
                    r._id === recipe._id
                        ? {
                            ...r,
                            isBookmarked:
                                !r.isBookmarked
                        }
                        : r
                )
            );

        }

        else if (data.status === 401) {

            // relogin

        }

        else if (data.status === 500) {

            // page not found

        }

    };


    return (

        <div className="recipe-card">


            {/* =========================
                IMAGE
            ========================= */}

            <div className="recipe-card-image">

                <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    onError={(e) => {

                        e.currentTarget.src =
                            "https://imgs.search.brave.com/0LcoNeVoMi9UGquyOMvqqdzDA7k3gC0E2C49J7rD81g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tdmVj/dG9yLzQwNC1wYWdl/LWZvdW5kLXNlYXJj/aC1lcnJvci13ZWIt/aWxsdXN0cmF0aW9u/XzU4NTAyNC00NTku/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MCZxPTgw";

                    }}
                    onClick={handleCardClick}
                />


                {/* CATEGORY */}

                <div
                    className="recipe-category"
                    onClick={handleCardClick}
                >

                    {recipe.category?.[0]}

                </div>

            </div>


            {/* =========================
                CONTENT
            ========================= */}

            <div className="recipe-card-content">


                {/* =========================
                    RECIPE NAME
                ========================= */}

                <div
                    className="recipe-name"
                    onClick={handleCardClick}
                >

                    {recipe.name}

                </div>


                {/* =========================
                    BOTTOM INFORMATION
                ========================= */}

                <div className="recipe-bottom-info">


                    {/* =========================
                        CREATOR
                    ========================= */}

                    <div
                        className="recipe-creator"
                        onClick={handleCardClick}
                    >

                        <i className="fa-solid fa-user"></i>

                        <span>
                            {recipe.creator?.name ||
                                recipe.user?.name ||
                                "Unknown"}
                        </span>

                    </div>


                    {/* =========================
                        RATING + TIME
                    ========================= */}

                    <div
                        className="recipe-details"
                        onClick={handleCardClick}
                    >


                        {/* RATING */}

                        <div className="recipe-rating">

                            <div className="stars">

                                {[1, 2, 3, 4, 5].map(star => {

                                    const fillPercentage =
                                        Math.min(
                                            Math.max(
                                                rating -
                                                (star - 1),
                                                0
                                            ),
                                            1
                                        ) * 100;


                                    return (

                                        <span
                                            className="star"
                                            key={star}
                                        >

                                            <i className="fa-regular fa-star"></i>


                                            <span
                                                className="star-fill"
                                                style={{
                                                    width:
                                                        `${fillPercentage}%`
                                                }}
                                            >

                                                <i className="fa-solid fa-star"></i>

                                            </span>

                                        </span>

                                    );

                                })}

                            </div>


                            <span className="rating-number">

                                {rating.toFixed(1)}

                            </span>

                        </div>


                        {/* TOTAL TIME */}

                        <div className="recipe-total-time">

                            <i className="fa-regular fa-clock"></i>

                            <span>
                                {totalTime} min
                            </span>

                        </div>

                    </div>

                </div>


                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="recipe-button-wraper">


                    {/* BOOKMARK */}

                    <button
                        type="button"
                        className={
                            !recipe.isBookmarked
                                ? "bookmark-recipe-button"
                                : "remove-bookmark-recipe-button"
                        }
                        onClick={handleBookmark}
                    >

                        <i
                            className={
                                !recipe.isBookmarked
                                    ? "fa-regular fa-heart"
                                    : "fa-solid fa-heart"
                            }
                        ></i>

                        <span>

                            {!recipe.isBookmarked
                                ? "Bookmark Recipe"
                                : "Remove bookmark"}

                        </span>

                    </button>


                    {/* REMOVE RECIPE */}

                    {(user.role.roleName === "admin" ||
                        user.role.roleName ===
                        "contentMenager") && (

                        <button
                            type="button"
                            className="remove-recipe-button"
                            onClick={handleRemoveRecipe}
                        >

                            <i className="fa-solid fa-trash"></i>

                        </button>

                    )}

                </div>


            </div>

        </div>

    );

}
