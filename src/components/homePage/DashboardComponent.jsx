import { useEffect, useState } from "react";
import { getAllRecepies } from "../../utils/RecepieEndpoint";
import { useAuth } from "../../context/useAuth";
import { PAGE_SIZE } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import ElectricBorder from "../ElectricBorder";

import RecipeCardComponent from "./RecipeCardComponent";

import Spinner from "../Spiner";
import "./dashboardComponent.css";


export default function DashboardComponent({ filters }) {

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [recepies, setRecepies] = useState([]);
    const [refresh, setRefresh] = useState(1);
    const [loading, setLoading] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);

    const [pagination, setPagination] = useState({
        numRecepies: 0,
        totalPages: 0,
        pageNumber: 1,
        pageSize: PAGE_SIZE
    });

    const [recommendations, setRecommendations] = useState([]);

    // const fetchRecomendations = async () =>{
    //     const data = await getRecommendations(token);
    //     console.log(data);
    // }

    const loadRecommendations = () => {

        const storedRecommendations =
            localStorage.getItem("recommendations");

        if (
            !storedRecommendations ||
            storedRecommendations === "undefined" ||
            storedRecommendations === "null"
        ) {
            setRecommendations([]);
            return;
        }

        try {

            const parsed =
                JSON.parse(storedRecommendations);

            setRecommendations(parsed);

        } catch (error) {

            console.error(
                "Invalid recommendations:",
                error
            );

            localStorage.removeItem("recommendations");
            setRecommendations([]);
        }
    };

    useEffect(() => {

        loadRecommendations();

        const handleRecommendationsUpdated = () => {
            loadRecommendations();
        };

        window.addEventListener(
            "recommendationsUpdated",
            handleRecommendationsUpdated
        );

        return () => {
            window.removeEventListener(
                "recommendationsUpdated",
                handleRecommendationsUpdated
            );
        };

    }, []);

    const fetchRecepies = async () => {

        setLoading(true);

        const response = await getAllRecepies(
            token,
            pageNumber,
            filters.name,
            filters.creator,
            filters.ingredients,
            filters.category,
            filters.cuisine,
            recommendations.length
        );

        setLoading(false);

        if (response.succ) {
            //Ovaj kod dole do setRecepies bez toa go pastni u site kaj so imash rfetch
            if (
                response.pagination.totalPages > 0 &&
                pageNumber > response.pagination.totalPages
            ) {

                setPageNumber(response.pagination.totalPages);

                setLoading(false);

                return;
            }

            setRecepies(response.recepies);

            setPagination(response.pagination);

            //await fetchRecomendations();

        }

        if (response.status === 401) {

            logout();

            alert(
                "Your token has expired please login again."
            );

            navigate("/login");
        }

    };


    // Load recipes when page or filters change
    useEffect(() => {

        fetchRecepies();

    }, [
        token,
        pageNumber,
        filters,
        refresh
    ]);


    // When search filters change, return to first page
    useEffect(() => {

        setPageNumber(1);

    }, [
        filters.name,
        filters.creator,
        filters.ingredients,
        filters.category,
        filters.cuisine
    ]);


    const handlePrevious = () => {

        if (pageNumber > 1) {

            setPageNumber(
                prev => prev - 1
            );

        }

    };


    const handleNext = () => {

        if (pageNumber < pagination.totalPages) {

            setPageNumber(
                prev => prev + 1
            );

        }

    };


    return (

        <div className="dashboard-component">

            <div className="list-recepies">


                {loading ? (

                    <div className="recipes-spinner">

                        <Spinner
                            w={500}
                            h={500}
                        />

                    </div>

                ) : (

                    <div className="recipes-grid">

                    {pageNumber === 1 && recommendations.length === 0 && recepies.length > 0 && (
                        <>
                            {[1, 2, 3, 4].map(index => (
                                <ElectricBorder
                                    key={`recommendation-loading-${index}`}
                                    color=" #f35438"
                                    speed={0.1}
                                    chaos={0.01}
                                    thickness={20}
                                >
                                    <div className="recommendation-loading">
                                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                                        <span>
                                            Waiting for recommendation...
                                        </span>
                                    </div>
                                </ElectricBorder>
                            ))}
                        </>
                    )}

                    {pageNumber === 1 && recommendations.map(recipe => (
                        <ElectricBorder
                            key={recipe._id}
                            color="#f35438"
                            speed={0.1}
                            chaos={0.01}
                            thickness={20}
                        >
                            <div className="recommended-card">

                                <div className="recommended-badge">
                                    <i className="fa-solid fa-star"></i>
                                    <span>Recommended</span>
                                </div>

                                <RecipeCardComponent
                                    recipe={recipe}
                                    setRecepies={setRecepies}
                                    setRefresh={setRefresh}
                                />

                            </div>
                        </ElectricBorder>
                    ))}

                    {recepies.length > 0 ? (
                        recepies.map(recipe => (
                            <ElectricBorder
                                key={recipe._id}
                                color="#fdaa2d"
                                speed={0.1}
                                chaos={0.01}
                                thickness={20}
                            >
                                <RecipeCardComponent
                                    recipe={recipe}
                                    setRecepies={setRecepies}
                                    setRefresh={setRefresh}
                                />
                            </ElectricBorder>
                        ))
                    ) : (
                        recommendations.length === 0 && (
                            <div className="no-recipes-found">
                                <i className="fa-solid fa-utensils"></i>

                                <div className="no-recipes-title">
                                    No recipes found
                                </div>
                            </div>
                        )
                    )}

                </div>
                )}

            </div>


            {!loading && pagination.totalPages > 0 && (

                <div className="recipes-pagination">

                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={pageNumber === 1}
                    >

                        <i className="fa-solid fa-chevron-left"></i>

                        Previous

                    </button>


                    <span>

                        Page {pageNumber} of {pagination.totalPages}

                    </span>


                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={
                            pageNumber === pagination.totalPages
                        }
                    >

                        Next

                        <i className="fa-solid fa-chevron-right"></i>

                    </button>

                </div>

            )}

        </div>

    );

}