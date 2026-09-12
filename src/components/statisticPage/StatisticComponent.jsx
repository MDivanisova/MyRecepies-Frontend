import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { getSummaryStatistics, getRatingStatistics, getBookmarkStatistics, getCategoryStatistic} from "../../utils/StatisticEndpoint";
import TopRecipesStatisticComponent from "./TopRecipesStatisticComponent";
import HotestCategoryStatisticComponent from "./HotestCategoryStatisticComponent";
import TopGlobalRecipesStatisticComponent from "./TopGlobalRecipesStatisticComponent";

import Spinner from "../Spiner";
import "./statisticComponent.css";


export default function StatisticComponent() {
    
    const { token, logout, user } = useAuth(); 

    const navigate = useNavigate();

    const [selectedPeriod, setSelectedPeriod] = useState(1);
    const [selectedStatisticType, setSelectedStatisticType] = useState("rating");

    const [period, setPeriod] = useState(1);
    const [statisticType, setStatisticType] = useState("rating");

    const [periodOpen, setPeriodOpen] = useState(false);
    const [statisticTypeOpen, setStatisticTypeOpen] = useState(false);


    const periodRef = useRef(null);
    const statisticTypeRef = useRef(null);


    // =========================================================
    // SUMMARY
    // =========================================================

    const [summary, setSummary] = useState({
        totalRecipes: 0,
        averageRating: 0,
        averageBookmarks: 0
    });

    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingStatistics, setLoadingStatistics] = useState(false);


    const [ratingStatistics, setRatingStatistics] = useState(null);
    const [bookmarkStatistics, setBookmarkStatistics] = useState(null);
    const [categoryStatistics, setCategoryStatistics] = useState(null);




    // =========================================================
    // CLICK OUTSIDE + ESC
    // =========================================================

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                periodRef.current &&
                !periodRef.current.contains(e.target)
            ) {
                setPeriodOpen(false);
            }

            if (
                statisticTypeRef.current &&
                !statisticTypeRef.current.contains(e.target)
            ) {
                setStatisticTypeOpen(false);
            }
        };


        const handleEscape = (e) => {

            if (e.key === "Escape") {
                setPeriodOpen(false);
                setStatisticTypeOpen(false);
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


    // =========================================================
    // GET SUMMARY
    // =========================================================

    useEffect(() => {

        const fetchSummary = async () => {

            setLoadingSummary(true);

            const response =
                await getSummaryStatistics(token);

            if (response.succ) {

                setSummary(response.summary);

            } else if (response.status === 401) {

                logout();
                navigate("/login");
            }

            setLoadingSummary(false);
        };

        fetchSummary();

    }, [token]);

    // =========================================================
    // GET RATING STATISTICS
    // =========================================================

    const fetchRatingStatistics = async (selectedPeriod) => {

        setLoadingStatistics(true);

        const response =
            await getRatingStatistics( token, 7, selectedPeriod );

        if (response.succ) {

            setRatingStatistics( response.statistics );

            console.log(response);

        } else if (response.status === 401) {

            logout();
            navigate("/login");
        }

        setLoadingStatistics(false);
    };


    // =========================================================
    // GET BOOKMARK STATISTICS
    // =========================================================

    const fetchBookmarkStatistics = async (selectedPeriod) => {

        setLoadingStatistics(true);

        console.log("Bookmark");

        const response = await getBookmarkStatistics( token, 7, selectedPeriod );

        if (response.succ) {

            setBookmarkStatistics( response.statistics );

        } else if (response.status === 401) {

            logout();
            navigate("/login");
        }

        setLoadingStatistics(false);
    };


   const fetchCategoryStatistics = async (selectedPeriod) => {

        setLoadingStatistics(true);

        const response = await getCategoryStatistic(
            token,
            7,
            selectedPeriod
        );

        console.log("CATEGORY RESPONSE:", response);

        if (response.succ) {

            console.log("CATEGORY STATISTICS:", response.statistics);

            setCategoryStatistics(response.statistics);

        } else if (response.status === 401) {

            logout();
            navigate("/login");
        }

        setLoadingStatistics(false);
    };


    // =========================================================
    // INITIAL STATISTICS
    // =========================================================

    useEffect(() => {

        fetchRatingStatistics(1);
        fetchCategoryStatistics(1);

    }, [token]);


    // =========================================================
    // PERIOD SELECT SETTING
    // =========================================================

    const handlePeriodSelect = (value) => {

        setSelectedPeriod(value);
        setPeriodOpen(false);
    };


    // =========================================================
    // STATISTIC TYPE SELECT
    // =========================================================

    const handleStatisticTypeSelect = (value) => {

        setSelectedStatisticType(value);
        setStatisticTypeOpen(false);
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = () => {

        setPeriod(selectedPeriod);
        setStatisticType(selectedStatisticType);

        if (selectedStatisticType === "rating") {

            fetchRatingStatistics(selectedPeriod);

        } else {

            fetchBookmarkStatistics(selectedPeriod);
        }

        fetchCategoryStatistics(selectedPeriod);
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="statistic-component">

            {/* ================================================= */}
            {/* STATISTIC BAR */}
            {/* ================================================= */}

            <div className="statistic-bar">

                <div className="statistic-controls">


                    {/* PERIOD */}

                    <div
                        className="statistic-select"
                        ref={periodRef}
                    >

                        <button
                            className={`statistic-select-button ${
                                periodOpen ? "open" : ""
                            }`}
                            onClick={() =>
                                setPeriodOpen(!periodOpen)
                            }
                        >

                            <span>
                                Last {selectedPeriod}{" "}
                                {selectedPeriod === 1
                                    ? "month"
                                    : "months"}
                            </span>

                            <i
                                className={`fa-solid fa-chevron-down ${
                                    periodOpen
                                        ? "rotate"
                                        : ""
                                }`}
                            ></i>

                        </button>


                        {periodOpen && (

                            <div className="statistic-select-options">

                                {[1, 2, 3, 4, 5, 6].map(
                                    (value) => (

                                        <button
                                            key={value}
                                            className={`statistic-select-option ${
                                                selectedPeriod === value
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handlePeriodSelect(
                                                    value
                                                )
                                            }
                                        >

                                            Last {value}{" "}
                                            {value === 1
                                                ? "month"
                                                : "months"}

                                        </button>
                                    )
                                )}

                            </div>
                        )}

                    </div>


                    {/* STATISTIC TYPE */}

                    <div
                        className="statistic-select"
                        ref={statisticTypeRef}
                    >

                        <button
                            className={`statistic-select-button ${
                                statisticTypeOpen
                                    ? "open"
                                    : ""
                            }`}
                            onClick={() =>
                                setStatisticTypeOpen(
                                    !statisticTypeOpen
                                )
                            }
                        >

                            <span>
                                {selectedStatisticType ===
                                "rating"
                                    ? "Rating"
                                    : "Bookmarks"}
                            </span>

                            <i
                                className={`fa-solid fa-chevron-down ${
                                    statisticTypeOpen
                                        ? "rotate"
                                        : ""
                                }`}
                            ></i>

                        </button>


                        {statisticTypeOpen && (

                            <div className="statistic-select-options">

                                <button
                                    className={`statistic-select-option ${
                                        selectedStatisticType ===
                                        "rating"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleStatisticTypeSelect(
                                            "rating"
                                        )
                                    }
                                >
                                    Rating
                                </button>


                                <button
                                    className={`statistic-select-option ${
                                        selectedStatisticType ===
                                        "bookmarks"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleStatisticTypeSelect(
                                            "bookmarks"
                                        )
                                    }
                                >
                                    Bookmarks
                                </button>

                            </div>
                        )}

                    </div>


                    {/* SEARCH */}

                    <button
                        className="statistic-search-button"
                        onClick={handleSearch}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>

                </div>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                {(user?.role?.roleName === "chief" || user?.role?.roleName === "admin") && (
                    loadingSummary ? (

                        <div className="statistic-summary-loading">
                            <Spinner
                                className="statistic-spinner" w={30} h={30}/>
                        </div>

                    ) : (

                        <div className="statistic-summary">

                            <div className="statistic-summary-card">

                                <div className="statistic-summary-icon">
                                    <i className="fa-solid fa-utensils"></i>
                                </div>

                                <div className="statistic-summary-content">

                                    <span className="statistic-summary-label">
                                        Total Recipes
                                    </span>

                                    <span className="statistic-summary-value">
                                        {summary.totalRecipes}
                                    </span>

                                </div>

                            </div>


                            <div className="statistic-summary-card">

                                <div className="statistic-summary-icon">
                                    <i className="fa-solid fa-star"></i>
                                </div>

                                <div className="statistic-summary-content">

                                    <span className="statistic-summary-label">
                                        Average Rating
                                    </span>

                                    <span className="statistic-summary-value">
                                        {summary.averageRating}
                                    </span>

                                </div>

                            </div>


                            <div className="statistic-summary-card">

                                <div className="statistic-summary-icon">
                                    <i className="fa-solid fa-bookmark"></i>
                                </div>

                                <div className="statistic-summary-content">

                                    <span className="statistic-summary-label">
                                        Average Bookmarks
                                    </span>

                                    <span className="statistic-summary-value">
                                        {summary.averageBookmarks}
                                    </span>

                                </div>

                            </div>

                        </div>
                    )
                )}

            </div>


            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <div className="statistic-body">

                {/* TOP RECIPES */}
                {(user?.role?.roleName === "chief" || user?.role?.roleName === "admin") && (
                    <div className="statistic-box">

                        {loadingStatistics ? (

                            <div className="statistic-spinner-container">
                                <Spinner w={100} h={100} />
                            </div>

                        ) : statisticType === "rating" ? (

                            <TopRecipesStatisticComponent
                                statisticType="rating"
                                period={ratingStatistics?.period || period}
                                recipes={ratingStatistics?.userTopRecipes || []}
                            />

                        ) : (

                            <TopRecipesStatisticComponent
                                statisticType="bookmarks"
                                period={bookmarkStatistics?.period || period}
                                recipes={bookmarkStatistics?.userTopBookmarked || []}
                            />

                        )}

                    </div>
                )}

                {/* OTHER STATISTICS */}

                <div className="statistic-box">

                        {loadingStatistics ? (

                            <div className="statistic-spinner-container">
                                <Spinner w={100} h={100} />
                            </div>

                        ) : statisticType === "rating" ? (

                            <HotestCategoryStatisticComponent
                                statisticType="rating"
                                period={categoryStatistics?.period || period}
                                categories={categoryStatistics?.rating || []}
                            />

                        ) : (

                            <HotestCategoryStatisticComponent
                                statisticType="bookmarks"
                                period={categoryStatistics?.period || period}
                                categories={categoryStatistics?.bookmarks || []}
                            />

                        )}

                </div>

                <div className="statistic-box">

                    {loadingStatistics ? (

                        <div className="statistic-spinner-container">
                            <Spinner w={100} h={100} />
                        </div>

                    ) : statisticType === "rating" ? (

                        <TopGlobalRecipesStatisticComponent
                            statisticType="rating"
                            period={ratingStatistics?.period || period}
                            statistics={ratingStatistics}
                        />

                    ) : (

                        <TopGlobalRecipesStatisticComponent
                            statisticType="bookmarks"
                            period={bookmarkStatistics?.period || period}
                            statistics={bookmarkStatistics}
                        />

                    )}

                </div>

            </div>

        </div>
    );
}