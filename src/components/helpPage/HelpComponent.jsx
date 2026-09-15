import "./helpComponent.css"

export default function HelpComponent(){
    return(
        <div className="help-component">

            <h1>Help Center</h1>

            <p>
                Welcome to My Recipes! This Help Center provides useful information about 
                the main features of the application and explains how to use the different 
                sections of the system. Use the menu on the left side of the screen to access 
                the pages and features available for your user role and permissions.
            </p>

            <h2>Home</h2>

            <p>
                The Home page is the main page of the application and allows you to browse the available recipes. 
                Recipes are displayed with basic information such as their name, image, category, cuisine, 
                preparation and cooking time, and rating. You can use the search field to quickly find a recipe by its name.

                You can also use the available filters to narrow down the displayed recipes. 
                The filters make it easier to find recipes based on different characteristics. 
                By selecting a recipe, you can open its Recipe Details page and view all available information about it.
            </p>

            <h2>Profile</h2>

            <p>
                The Profile page contains information related to your user account. 
                Here you can view and edit the information that is available for modification,
                 as well as view information about your activity in the application.

                Users with the appropriate permissions can also view their public recipes. 
                The profile displays information such as the user's role, number of written reviews, number of saved recipes, and last login.
            </p>

            <h2>Bookmarks</h2>

            <p>
               The Bookmarks feature allows you to save recipes that you would like to view or prepare again in the future. 
               To save a recipe, select the Bookmark option on the Recipe Details page.

                All saved recipes can be accessed from the Bookmarks page. There you can search and filter your saved recipes, 
                as well as browse them across multiple pages. If you no longer want a recipe in your bookmarks, select the Bookmark option again to remove it.
            </p>

            <h2>Statistics</h2>

            <p>
                The Statistics page provides an overview of different data related to recipes and their popularity. 
                The available statistics depend on the user's role.

                Users with the Chef and Admin roles can view additional statistics about their own recipes. 
                You can select a period from the last one to six months and view data related to ratings or bookmarks. 
                Additional information includes the number of recipes, average rating, average number of bookmarks, and the top recipes.

                Global statistics are also available, including the most popular recipes and categories in the application.
            </p>

            <h2>Add Recipe</h2>

            <p>
                The Add Recipe page is available to users who have permission to create recipes. 
                Creating a recipe is divided into multiple steps to make entering the information easier.

                During the process, you can enter information such as the recipe name, preparation and cooking time,
                 category, cuisine, ingredients, instructions, cooking methods, tools, and nutritional values. 
                 The application validates the entered information while moving between the steps.

                At the end of the process, you can choose whether the recipe will be public or private and complete the creation of the recipe.
            </p>

            <h2>Recipe Details</h2>

            <p>
                By selecting a recipe, you can open the Recipe Details page. This page contains the complete information about the recipe, 
                including ingredients, instructions, preparation and cooking time, category, cuisine, cooking methods, tools, and nutritional values.

                From this page, you can add the recipe to your Bookmarks, give it a rating, and write a review. If you are the creator of the recipe, 
                you can edit it, while users with the appropriate permissions can delete it.
            </p>

            <h2>Ratings and Reviews</h2>

            <p>
                Users can rate a recipe by selecting between one and five stars and can also write a text review. 
                If you have already submitted a rating or review, you can edit or delete it.

                The Recipe Details page also displays rating statistics, including the average rating and the number of users who have rated the recipe. 
                Reviews can be filtered according to the number of stars given.
            </p>

            <h2>Comments</h2>

            <p>
                Comments allow users to interact with each other through reviews. You can leave a comment or reply to an existing review.

                Reviews and comments can be marked with a Like or Dislike. The available editing and deletion options depend on the user and their permissions.
            </p>

            <h2>Recommended</h2>

            <p>
                The Recommended feature displays recipes that the system has selected as recommendations for a specific user. 
                The recommendations are determined using recipe information and the user's activity within the application.

                By selecting Recommended, you can view the suggested recipes and open any of them to see their complete details.
            </p>

            <h2>Manage Users</h2>

            <p>
                The Manage Users page is available to users with the appropriate administrative permissions. 
                This page allows you to view the list of registered users and use search and filtering options.

                By selecting a user, you can open their details. Depending on your permissions, you can change the user's role or delete their account. 
                For users with the Chef or Admin role, their public recipes can also be viewed.
            </p>

            <h2>Logging Out</h2>

            <p>
                The Logout option is available in the application menu and is used to sign out of your account. 
                After selecting Logout, your session is ended and you are redirected to the login page.

                To access features that require authentication again, you need to sign in with your email and password.
            </p>

            <h2>Need More Help?</h2>

            <p>
                If you need additional information or experience a problem while using the application, you can contact the creator of My Recipes by email. 
                You can use the email address below to ask questions, report a problem, or provide feedback about the application.

            </p>
            <p>myrecipes.support@gmail.com</p>

        </div>
    );
}



