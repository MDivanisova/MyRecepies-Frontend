import { useEffect, useState, useRef } from "react";
import { CATEGORIES, CUISINES, PAGE_SIZE } from "../../utils/enum";
import "./bookmarkComponent.css";
import { getMyBookmarks, getUsers} from "../../utils/UserEndpoints";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import ElectricBorder from "../ElectricBorder"
import Spinner from "../Spiner";
import BookmarkRecipeCardComponent from "./BookmarkRecipeCardComponent";




export default function BookmarkComponent() {

    const { token, logout } = useAuth();

    const navigate = useNavigate();


    /* =========================
       REFS
    ========================= */

    const creatorRef = useRef(null);
    const categoryRef = useRef(null);
    const cuisineRef = useRef(null);


    /* =========================
       BOOKMARKS
    ========================= */

    const [bookmarks, setBookmarks] = useState([]);

    const [loading, setLoading] = useState(false);


    /* =========================
       SEARCH INPUTS
    ========================= */

    const [nameSearch, setNameSearch] = useState("");

    const [creatorSearch, setCreatorSearch] = useState("");

    const [creatorSuggestions, setCreatorSuggestions] = useState([]);

    // Ova go čuva ID-to na selektiraniot creator
    const [selectedCreator, setSelectedCreator] = useState("");

    const [ingredientSearch, setIngredientSearch] = useState("");


    /* =========================
       CATEGORY / CUISINE
    ========================= */

    const [selectedCategory, setSelectedCategory] = useState("all");

    const [selectedCuisine, setSelectedCuisine] = useState("all");


    /* =========================
       DROPDOWNS
    ========================= */

    const [categoryOpen, setCategoryOpen] = useState(false);

    const [cuisineOpen, setCuisineOpen] = useState(false);


    /* =========================
       APPLIED FILTERS
    ========================= */

    const [filters, setFilters] = useState({
        name: "",
        creator: "",
        ingredients: "",
        category: "all",
        cuisine: "all"
    });


    /* =========================
       PAGINATION
    ========================= */

    const [pageNumber, setPageNumber] = useState(1);


    const [pagination, setPagination] = useState({
        numRecepies: 0,
        totalPages: 0,
        pageNumber: 1,
        pageSize: PAGE_SIZE
    });


    /* =========================
       CLICK OUTSIDE
    ========================= */

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                creatorRef.current &&
                !creatorRef.current.contains(e.target)
            ) {
                setCreatorSuggestions([]);
            }


            if (
                categoryRef.current &&
                !categoryRef.current.contains(e.target)
            ) {
                setCategoryOpen(false);
            }


            if (
                cuisineRef.current &&
                !cuisineRef.current.contains(e.target)
            ) {
                setCuisineOpen(false);
            }

        };


        const handleEscape = (e) => {

            if (e.key === "Escape") {

                setCreatorSuggestions([]);

                setCategoryOpen(false);

                setCuisineOpen(false);
            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    /* =========================
       FETCH BOOKMARKS
    ========================= */

    const fetchBookmarks = async () => {

        if (!token) return;


        setLoading(true);


        const response = await getMyBookmarks(
            token,
            pageNumber,
            filters.name,
            filters.creator,
            filters.ingredients,
            filters.category,
            filters.cuisine
        );


        if (response.succ) {

            setBookmarks(
                response.bookmarks?.recepies || []
            );


            setPagination(
                response.bookmarks?.pagination || {
                    numRecepies: 0,
                    totalPages: 0,
                    pageNumber: 1,
                    pageSize: PAGE_SIZE
                }
            );

        }


        else if (response.status === 401) {

            logout();

            alert(
                "Your token has expired please login again."
            );

            navigate("/login");

        }


        setLoading(false);

    };


    /* =========================
       FETCH WHEN FILTERS / PAGE CHANGE
    ========================= */

    useEffect(() => {

        fetchBookmarks();

    }, [
        token,
        pageNumber,
        filters
    ]);


    /* =========================
       CREATOR SEARCH
    ========================= */

    const handleCreatorChange = async (e) => {

        const value = e.target.value;


        setCreatorSearch(value);


        // Ako korisnikot menuva tekst,
        // prethodniot selektiran user ne važi
        setSelectedCreator("");


        if (value.trim() === "") {

            setCreatorSuggestions([]);

            return;
        }


        const response = await getUsers(
            token,
            1,
            value,
            "",
            "all"
        );


        if (response.succ) {

            setCreatorSuggestions(
                response.users
            );

        }

    };


    /* =========================
       SELECT CREATOR
    ========================= */

    const handleCreatorSelect = (user) => {

        // Vo inputot go prikazuvame imeto
        setCreatorSearch(user.name);


        // Go čuvame ID-to
        // Ova NE go menuva filters.creator
        setSelectedCreator(user._id);


        // Go zatvorame dropdownot
        setCreatorSuggestions([]);

    };


    /* =========================
       SEARCH
    ========================= */

    const handleSearch = () => {

        setFilters({

            name: nameSearch,

            creator: selectedCreator,

            ingredients: ingredientSearch,

            category: selectedCategory || "all",

            cuisine: selectedCuisine || "all"

        });


        // Sekogaš počnuvame od prva strana
        setPageNumber(1);

    };


    /* =========================
       PREVIOUS PAGE
    ========================= */

    const handlePrevious = () => {

        if (
            pageNumber > 1 &&
            !loading
        ) {

            setPageNumber(
                prev => prev - 1
            );

        }

    };


    /* =========================
       NEXT PAGE
    ========================= */

    const handleNext = () => {

        if (
            pageNumber < pagination.totalPages &&
            !loading
        ) {

            setPageNumber(
                prev => prev + 1
            );

        }

    };


    /* =========================
       CATEGORY SELECT
    ========================= */

    const handleCategorySelect = (category) => {

        setSelectedCategory(category);

        setCategoryOpen(false);

    };


    /* =========================
       CUISINE SELECT
    ========================= */

    const handleCuisineSelect = (cuisine) => {

        setSelectedCuisine(cuisine);

        setCuisineOpen(false);

    };


    return (

        <div className="bookmarks-component">


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="bookmarks-toolbar">


                <div className="bookmarks-toolbar-left">

                     {/* =========================
                        CREATOR SEARCH
                    ========================= */}

                    <div
                        className="bookmark-creator-search"
                        ref={creatorRef}
                    >

                        <div className="bookmark-search">

                            <i className="fa-solid fa-user"></i>


                            <input
                                type="text"
                                placeholder="Search by creator..."
                                value={creatorSearch}
                                onChange={handleCreatorChange}
                            />

                        </div>


                        {/* =========================
                            CREATOR SUGGESTIONS
                        ========================= */}

                        {creatorSuggestions.length > 0 && (

                            <div className="creator-suggestions">

                                {creatorSuggestions.map(user => (

                                    <button
                                        type="button"
                                        key={user._id}
                                        onClick={() =>
                                            handleCreatorSelect(
                                                user
                                            )
                                        }
                                    >

                                        {user.name}

                                    </button>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* =========================
                        RECIPE SEARCH
                    ========================= */}

                    <div className="bookmark-search">

                        <i className="fa-solid fa-utensils"></i>


                        <input
                            type="text"
                            placeholder="Search by recipe..."
                            value={nameSearch}
                            onChange={(e) =>
                                setNameSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>



                    {/* =========================
                        INGREDIENT SEARCH
                    ========================= */}

                    <div className="bookmark-search">

                        <i className="fa-solid fa-carrot"></i>


                        <input
                            type="text"
                            placeholder="Search by ingredient..."
                            value={ingredientSearch}
                            onChange={(e) =>
                                setIngredientSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* =========================
                        CATEGORY
                    ========================= */}

                    <div
                        className="bookmark-select"
                        ref={categoryRef}
                    >

                        <button
                            type="button"
                            className="bookmark-select-button"
                            onClick={() => {

                                setCategoryOpen(
                                    prev => !prev
                                );

                                setCuisineOpen(false);

                            }}
                        >

                            <span>

                                {selectedCategory === "all"
                                    ? "All Category"
                                    : selectedCategory}

                            </span>


                            <i
                                className={`fa-solid fa-chevron-down ${
                                    categoryOpen
                                        ? "rotate"
                                        : ""
                                }`}
                            ></i>

                        </button>


                        {categoryOpen && (

                            <div className="bookmark-select-options">

                                    {/* ALL CATEGORY */}
                                    <button
                                        type="button"
                                        className={`bookmark-select-option ${
                                            selectedCategory === "all"
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => handleCategorySelect("all")}
                                    >
                                        All Category
                                    </button>

                                    {/* OTHER CATEGORIES */}
                                    {CATEGORIES
                                        .filter(category => category !== "all")
                                        .map(category => (

                                            <button
                                                type="button"
                                                key={category}
                                                className={`bookmark-select-option ${
                                                    selectedCategory === category
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleCategorySelect(category)
                                                }
                                            >
                                                {category}
                                            </button>

                                        ))}

                                </div>

                        )}

                    </div>


                    {/* =========================
                        CUISINE
                    ========================= */}

                    <div
                        className="bookmark-select"
                        ref={cuisineRef}
                    >

                        <button
                            type="button"
                            className="bookmark-select-button"
                            onClick={() => {

                                setCuisineOpen(
                                    prev => !prev
                                );

                                setCategoryOpen(false);

                            }}
                        >

                            <span>

                                {selectedCuisine === "all"
                                    ? "All Cuisine"
                                    : selectedCuisine}

                            </span>


                            <i
                                className={`fa-solid fa-chevron-down ${
                                    cuisineOpen
                                        ? "rotate"
                                        : ""
                                }`}
                            ></i>

                        </button>


                        {cuisineOpen && (

                            <div className="bookmark-select-options">

                                    {/* ALL CUISINE */}
                                    <button
                                        type="button"
                                        className={`bookmark-select-option ${
                                            selectedCuisine === "all"
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => handleCuisineSelect("all")}
                                    >
                                        All Cuisine
                                    </button>

                                    {/* OTHER CUISINES */}
                                    {CUISINES
                                        .filter(cuisine => cuisine !== "all")
                                        .map(cuisine => (

                                            <button
                                                type="button"
                                                key={cuisine}
                                                className={`bookmark-select-option ${
                                                    selectedCuisine === cuisine
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleCuisineSelect(cuisine)
                                                }
                                            >
                                                {cuisine}
                                            </button>

                                        ))}

                                </div>

                        )}

                    </div>


                    {/* =========================
                        SEARCH BUTTON
                    ========================= */}

                    <button
                        type="button"
                        className="search-button"
                        onClick={handleSearch}
                    >

                        <i className="fa-solid fa-magnifying-glass"></i>

                    </button>

                </div>


                {/* =========================
                    COUNT
                ========================= */}

                <div className="bookmarks-count">

                    <i className="fa-solid fa-bookmark"></i>


                    <span>

                        {pagination.numRecepies} bookmarks

                    </span>

                </div>

            </div>


            {/* =========================
                LIST
            ========================= */}

            <div className="bookmarks-list-container">

                {loading ? (

                    <div className="bookmarks-spinner">

                        <Spinner
                            w={500}
                            h={500}
                        />

                    </div>

                ) : bookmarks.length > 0 ? (

                    bookmarks.map(bookmark => (

                        <ElectricBorder
                            key={bookmark._id}
                            color="#fdaa2d"
                            speed={0.1}
                            chaos={0.01}
                            thickness={20}
                        >

                            <BookmarkRecipeCardComponent
                                bookmark={bookmark}
                                setBookmarks={setBookmarks}
                                setPagination={setPagination}
                            />

                        </ElectricBorder>

                    ))

                ) : (

                    <div className="no-bookmarks">

                        <i className="fa-solid fa-utensils"></i>

                        <span>
                            No bookmarked recipes found.
                        </span>

                    </div>

                )}

            </div>



            {/* =========================
                PAGINATION
            ========================= */}

            {!loading && bookmarks.length > 0 && pagination.totalPages > 0 && (

                <div className="bookmarks-pagination">

                    <button
                        type="button"
                        className="pagination-button"
                        disabled={
                            pageNumber === 1 ||
                            loading
                        }
                        onClick={handlePrevious}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back

                    </button>


                    <span>

                        Page {pageNumber} of {pagination.totalPages}

                    </span>


                    <button
                        type="button"
                        className="pagination-button"
                        disabled={
                            pageNumber >= pagination.totalPages ||
                            loading
                        }
                        onClick={handleNext}
                    >

                        Next

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>

                </div>

            )}


        </div>

    );

}