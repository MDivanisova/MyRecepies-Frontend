import { Link } from "react-router-dom";
import "./addRecepieStep7Component.css"

export default function AddRecepieStep7Component({ recepieId, resetForm }) {

    return (
        <div className="step7-container">

            <div className="step7-content">

                <div className="step7-title">

                    <i className="fa-solid fa-kitchen-set"></i>

                    <h1>Great job Chef!</h1>

                    <i className="fa-solid fa-hands-clapping"></i>

                </div>

                <h2>
                    Your recipe was successfully created!
                </h2>

            </div>

            <div className="step7-buttons">

                <Link
                    to="/addRecepie"
                    className="step7-real-button"
                    onClick={resetForm}
                >
                    Add Another Recipe
                </Link>

                <Link
                    to={`/recipe/details/${recepieId.current}`}
                    className="step7-real-button"
                >
                    View Recipe
                </Link>

            </div>

        </div>
    );
}