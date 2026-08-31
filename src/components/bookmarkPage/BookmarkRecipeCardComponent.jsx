import { useNavigate } from "react-router-dom";
import "./bookmarkRecipeCardComponent.css";
import { removeBookmark } from "../../utils/BookmarkEndpoint";
import { useAuth } from "../../context/useAuth";

export default function BookmarkRecipeCardComponent({
    bookmark,
    setBookmarks,
    setPagination
}) {

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const recipe = bookmark.recepie;

    const rating = Number(
        recipe.rating?.$numberDecimal || 0
    );

    const preparationTime = Number(
        recipe.preparationTime?.$numberDecimal || 0
    );

    const cookingTime = Number(
        recipe.cookingTime?.$numberDecimal || 0
    );

    const totalTime = preparationTime + cookingTime;


    const handleCardClick = () => {
        navigate("/PageNotfound");
    };


    const handleRemoveBookmark = async () => {

        const data = await removeBookmark(token, recipe._id);

        if (data.succ === true) {

        setBookmarks(prevBookmarks =>
                prevBookmarks.filter(
                    b => b._id !== bookmark._id
                )
            );

            setPagination(prev => ({
                ...prev,
                numRecepies: Math.max(prev.numRecepies - 1, 0)
            }));
        }
        else if (data.status === 401) {
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        } else if (data.status === 500) {

            // page not found

        }
    };


    return (

        <div className="bookmark-recipe-card">

            {/* IMAGE */}

            <div className="bookmark-recipe-card-image">

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
                    className="bookmark-recipe-category"
                    onClick={handleCardClick}
                >
                    {recipe.category?.[0]}
                </div>

            </div>


            {/* CONTENT */}

            <div className="bookmark-recipe-card-content">

                {/* RECIPE NAME */}

                <div
                    className="bookmark-recipe-name"
                    onClick={handleCardClick}
                >
                    {recipe.name}
                </div>


                {/* CREATOR */}

                <div
                    className="bookmark-recipe-creator"
                    onClick={handleCardClick}
                >
                    <i className="fa-solid fa-user"></i>

                    <span>
                        {recipe.creator?.name}
                    </span>
                </div>


                {/* RATING + TOTAL TIME */}

                <div
                    className="bookmark-recipe-details"
                    onClick={handleCardClick}
                >

                    {/* RATING */}

                    <div className="bookmark-recipe-rating">

                        <div className="bookmark-stars">

                            {[1, 2, 3, 4, 5].map(star => {

                                const fillPercentage =
                                    Math.min(
                                        Math.max(
                                            rating - (star - 1),
                                            0
                                        ),
                                        1
                                    ) * 100;

                                return (

                                    <span
                                        className="bookmark-star"
                                        key={star}
                                    >

                                        <i className="fa-regular fa-star"></i>

                                        <span
                                            className="bookmark-star-fill"
                                            style={{
                                                width: `${fillPercentage}%`
                                            }}
                                        >
                                            <i className="fa-solid fa-star"></i>
                                        </span>

                                    </span>

                                );

                            })}

                        </div>

                        <span className="bookmark-rating-number">
                            {rating.toFixed(1)}
                        </span>

                    </div>


                    {/* TOTAL TIME */}

                    <div className="bookmark-recipe-total-time">

                        <i className="fa-regular fa-clock"></i>

                        <span>
                            {totalTime} min
                        </span>

                    </div>

                </div>


                {/* REMOVE BOOKMARK */}

                <div className="bookmark-recipe-button-wrapper">

                    <button
                        type="button"
                        className="remove-bookmark-recipe-button"
                        onClick={handleRemoveBookmark}
                    >

                        <i className="fa-solid fa-heart"></i>

                        <span>
                            Remove bookmark
                        </span>

                    </button>

                </div>

            </div>

        </div>
    );
}