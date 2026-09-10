import "./hotestCategoryStatisticComponent.css";

export default function HotestCategoryStatisticComponent({ statisticType, period, categories = []}) 
{

    const periodText =
        period === 1
            ? `Last ${period} month`
            : `Last ${period} months`;

    const statisticText =
        statisticType === "rating"
            ? "Rating"
            : "Bookmarks";

    const getStatisticValue = (item) => {

        if (statisticType === "rating") {

            return (
                <>
                    <i className="fa-solid fa-star"></i>
                    {Number(item.averageRating || 0).toFixed(1)}
                </>
            );
        }

        return (
            <>
                <i className="fa-solid fa-bookmark"></i>
                {Number(item.totalBookmarks || 0)}
            </>
        );
    };

    return (
        <div className="hotest-category-container">

            <div className="hotest-category-header">

                <div className="hotest-category-title">

                    <div className="hotest-category-title-icon">
                        <i
                            className={
                                statisticType === "rating"
                                    ? "fa-solid fa-fire"
                                    : "fa-solid fa-bookmark"
                            }
                        ></i>
                    </div>

                    <div className="hotest-category-title-content">

                        <h3>HOTTEST CATEGORIES</h3>

                        <span>
                            {periodText} · {statisticText}
                        </span>

                    </div>

                </div>

            </div>

            <div className="hotest-category-list">

                {categories.length > 0 ? (

                    categories.map((item, index) => (

                        <div
                            className="hotest-category-item"
                            key={item.category || index}
                        >

                            <div className="hotest-category-rank">
                                #{item.position || index + 1}
                            </div>

                            <div className="hotest-category-info">

                                <span className="hotest-category-name">
                                    {item.category || "Unknown category"}
                                </span>

                            </div>

                            <div className="hotest-category-statistic">
                                {getStatisticValue(item)}
                            </div>

                        </div>

                    ))

                ) : (

                    <div className="hotest-category-empty">

                        <i className="fa-solid fa-layer-group"></i>

                        <span>
                            No categories found for this period.
                        </span>

                    </div>

                )}

            </div>

        </div>
    );
}