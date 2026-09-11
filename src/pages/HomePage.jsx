import { useState } from "react";

import WelcomeComponent from "../components/homePage/WelcomeComponent";
import DashboardComponent from "../components/homePage/DashboardComponent";
import MenuComponent from "../components/MenuComponent";

import "./homePage.css";

export default function HomePage() {

    const [filters, setFilters] = useState({
        name: "",
        creator: "",
        ingredients: "",
        category: "all",
        cuisine: "all"
    });

    const [typeRecipes, setTypeRecipes] = useState("recipes");

    return (
        <div className="dashboard-page">

            <MenuComponent path="home" />

            <div className="left-side-div">

                <WelcomeComponent
                    filters={filters}
                    setFilters={setFilters}
                    typeRecipes = {typeRecipes}
                    setTypeRecipes = {setTypeRecipes}
                />

                
                <DashboardComponent
                    filters={filters}
                    typeRecipes = {typeRecipes}
                />

            </div>

        </div>
    );
}