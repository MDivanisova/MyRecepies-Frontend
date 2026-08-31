import "./helpComponent.css"

export default function HelpComponent(){
    return(
        <div className="help-component">

            <h1>Help Center</h1>

            <p>
                Welcome to My Recipes! This Help Center provides useful information
                about the main features of the application and explains how you can
                navigate through the different sections. Use the menu on the left side
                of the screen to access the available features of your account.
            </p>

            <h2>Home</h2>

            <p>
                The Home page is the main page of the application. From here you can
                browse recipes and discover different meals and cooking ideas. You can
                use the search field to quickly find recipes that match the name or
                other information you are looking for. More recipe filtering options
                may also be available depending on the current version of the
                application.
            </p>

            <h2>Profile</h2>

            <p>
                The Profile section contains information related to your account.
                Here you can view and manage your personal information and other
                account-related settings. The available options may depend on your
                account type and permissions.
            </p>

            <h2>Bookmarks</h2>

            <p>
                The Bookmark section allows you to keep track of recipes that you
                would like to save for later. When you find a recipe that you like,
                you can add it to your bookmarks. Saved recipes can then be accessed
                from the Bookmark section without having to search for them again.
            </p>

            <h2>Statistics</h2>

            <p>
                The Statistics section provides information about your activity in
                the application. Depending on the available features, statistics may
                include information about recipes, ratings, saved recipes, or other
                activities. This section is intended to make it easier to understand
                your activity and interaction with the application.
            </p>

            <h2>Add Recipe</h2>

            <p>
                Users who have permission to add recipes can use the Add Recipe
                section to create and publish new recipes. When adding a recipe, you
                can provide information such as the recipe name, description,
                ingredients, preparation steps, images, and other relevant details.
                Make sure that the information entered is clear and complete before
                submitting the recipe.
            </p>

            <h2>Edit Users</h2>

            <p>
                The Edit Users section is available only to users with the appropriate
                permissions. This section can be used to manage registered users and
                update information related to their accounts. Available actions may
                depend on the role assigned to the current user.
            </p>

            <h2>Search and Recipes</h2>

            <p>
                The recipe search feature is designed to help you find meals quickly.
                Enter a keyword into the search field and the application will display
                recipes related to your search. You can use different words or recipe
                names to find the content you are interested in.
            </p>

            <h2>Ratings</h2>

            <p>
                Recipes can be rated by users in order to share their opinion and
                experience with other members of the application. Ratings can help
                other users discover recipes that have been positively received by
                the community.
            </p>

            <h2>Logging Out</h2>

            <p>
                The Logout option is located at the bottom of the menu. Select Logout
                when you want to safely leave your account. After logging out, you
                will need to sign in again to access features that require
                authentication.
            </p>

            <h2>Need More Help?</h2>

            <p>
                If you cannot find the information you are looking for, check the
                relevant section of the application or contact the appropriate
                administrator. This Help Center will be updated with additional
                instructions and frequently asked questions as new features are added
                to My Recipes.
            </p>

        </div>
    );
}



