import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { createReview, editReview , deleteReview} from "../../utils/ReviewEndpoint.js";
import { createRating, editRating, getRating, deleteRating } from "../../utils/RatingEndpoint.js";
import { getComments, likeComment, dislikeComment, deleteComment } from "../../utils/CommentEndpoint.js";

import "./reviewComponent.css";
import { useNavigate } from "react-router-dom";
//////////////////////////////////////////trebda da se poprave create revire i  delete 
export default function ReviewComponent({ recipe, setRefetchRecipe }) {

    const { token, logout, user } = useAuth();
    const navigate = useNavigate();

    const [rating, setRating] = useState({});
    const [review, setReview] = useState({});

    const [isEdit, setIsEdit] = useState(false);
    const [isReviewd, setIsReviewd] = useState(false);

    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [reviewText, setReviewText] = useState("");

    const [loading, setLoading] = useState(false);

    const [deletingReview, setDeletingReview] = useState(null);
    const [deletingComment, setDeletingComment] = useState(null);

    // =========================================================
    // COMMENTS
    // =========================================================

    const [expandedComments, setExpandedComments] = useState(false);
    const [commentsHasMore, setCommentsHasMore] = useState(false);


    const ratingTexts = {
        1: "Couldn't eat it",
        2: "Don't like it",
        3: "It was OK",
        4: "Liked it",
        5: "Loved it"
    };


    // =========================================================
    // CANCEL
    // =========================================================

    function handleClear() {

        if (isEdit) {
            setIsEdit(false);
        }

        setSelectedRating(0);
        setHoverRating(0);
        setReviewText("");
    }

    function handleCancel() {

        if (isEdit) {
            setIsEdit(false);
        }
    }


    // =========================================================
    // FETCH MY RATING / REVIEW
    // =========================================================

    async function fetchRating() {

        setLoading(true);

        const data = await getRating(token, recipe._id);

        if (data.succ === true) {

            setIsReviewd(true);
            console.log(data);
            setRating(data.rating);
            setReview(data.review);

            setReviewText(data.review.text);
            setSelectedRating(data.rating.rating);

        }

        else if (data.status === 401) {

            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        }

        else if (data.status === 404) {

            navigate("/pageNotFound");

        }

        else if (data.status === 500) {

            navigate("/internalServerError");

        }
        console.log(isReviewd)

        setLoading(false);
    }


    // =========================================================
    // FETCH COMMENTS
    // =========================================================

    async function fetchComments(reviewId, commentsLength) {

        const data = await getComments(
            token,
            reviewId,
            commentsLength
        );

        if (data.succ === true) {

            setReview(prev => ({
                ...prev,
                comments: [
                    ...(prev.comments || []),
                    ...data.comments
                ]
            }));

            setExpandedComments(true);

            setCommentsHasMore(data.moreAvailable);
        }

        else if (data.status === 401) {

            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        }

        else if (data.status === 404) {

            navigate("/pageNotFound");

        }

        else if (data.status === 500) {

            navigate("/internalServerError");

        }
    }

    async function handleLikeComment(commentId) {

        setReview(prev => ({
            ...prev,
            comments: prev.comments.map(comment =>
                comment._id === commentId
                    ? {
                        ...comment,
                        liker: comment.liker?.some(
                            id => id.toString() === user._id.toString()
                        )
                            ? comment.liker.filter(
                                id => id.toString() !== user._id.toString()
                            )
                            : [
                                ...(comment.liker || []),
                                user._id
                            ],

                        disliker: comment.disliker?.filter(
                            id => id.toString() !== user._id.toString()
                        ) || []
                    }
                    : comment
            )
        }));

        const data = await likeComment(token, commentId);

        if (data.succ === true) {
            return;
        }

        if (data.status === 401) {
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if (data.status === 404) {
            navigate("/pageNotFound");
        }
        else if (data.status === 500) {
            navigate("/internalServerError");
        }
    }

    async function handleDislikeComment(commentId) {

        setReview(prev => ({
            ...prev,
            comments: prev.comments.map(comment =>
                comment._id === commentId
                    ? {
                        ...comment,
                        disliker: comment.disliker?.some(
                            id => id.toString() === user._id.toString()
                        )
                            ? comment.disliker.filter(
                                id => id.toString() !== user._id.toString()
                            )
                            : [
                                ...(comment.disliker || []),
                                user._id
                            ],

                        liker: comment.liker?.filter(
                            id => id.toString() !== user._id.toString()
                        ) || []
                    }
                    : comment
            )
        }));

        const data = await dislikeComment(token, commentId);

        if (data.succ === true) {
            return;
        }

        if (data.status === 401) {
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if (data.status === 404) {
            navigate("/pageNotFound");
        }
        else if (data.status === 500) {
            navigate("/internalServerError");
        }
    }

    async function handleDeleteComment(commentId) {

        setDeletingComment(commentId);

        const data = await deleteComment(token, commentId);

        if (data.succ === true) {

            setReview(prev => ({
                ...prev,
                comments: prev.comments.filter(
                    comment => comment._id !== commentId
                )
            }));

            setDeletingComment(null);
            return;
        }

        if (data.status === 401) {
            setDeletingComment(null);
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if (data.status === 404) {
            setDeletingComment(null);
            navigate("/pageNotFound");
        }
        else if (data.status === 500) {
            setDeletingComment(null);
            navigate("/internalServerError");
        }

        setDeletingComment(null);
    }






    // =========================================================
    // EDIT REVIEW
    // =========================================================

    async function handleEdit() {

        if (
            selectedRating === 0 ||
            reviewText.trim() === ""
        ) {
            return;
        }

        setLoading(true);

        const ratingData = await editRating(
            token,
            selectedRating,
            rating._id
        );

        if (ratingData.succ === true) {

            const reviewData = await editReview(
                token,
                reviewText.trim(),
                review._id
            );

            if (reviewData.succ === true) {

                alert(
                    "Your rating and review have been edited successfully."
                );

                setIsEdit(false);
                setRefetchRecipe(prev => !prev);

                setRating(prev => ({
                    ...prev,
                    rating: selectedRating
                }));

                setReview(prev => ({
                    ...prev,
                    text: reviewText.trim()
                }));

                setSelectedRating(rating.rating);
                setHoverRating(0);
                setReviewText(review.text);

                setIsReviewd(true);

            }

            else if (reviewData.status === 401) {

                logout();
                alert("Your token has expired please login again.");
                navigate("/login");

            }

            else if (reviewData.status === 404) {

                navigate("/pageNotFound");

            }

            else if (reviewData.status === 500) {

                navigate("/internalServerError");

            }

            else {

                alert(
                    reviewData.msg ||
                    "Failed to submit review."
                );
            }

        }

        else if (ratingData.status === 401) {

            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        }

        else if (ratingData.status === 404) {

            navigate("/pageNotFound");

        }

        else if (ratingData.status === 500) {

            navigate("/internalServerError");

        }

        else {

            alert(
                ratingData.msg ||
                "Failed to submit rating."
            );
        }

        setLoading(false);
    }


    // =========================================================
    // CREATE REVIEW
    // =========================================================

    async function handleSubmit() {

        if (
            selectedRating === 0 ||
            reviewText.trim() === ""
        ) {
            return;
        }

        setLoading(true);

        const ratingData = await createRating(
            token,
            selectedRating,
            recipe._id
        );
        if (ratingData.succ === true) {

            const reviewData = await createReview(
                token,
                recipe._id,
                reviewText.trim()
            );

            if (reviewData.succ === true) {

                alert(
                    "Your rating and review have been submitted successfully."
                );
                setSelectedRating(0);
                setHoverRating(0);
                setReviewText("");

                setIsReviewd(true);
                setRefetchRecipe(prev => !prev);

            }
            else if (reviewData.status === 401) {
                logout();
                alert("Your token has expired please login again.");
                navigate("/login");
            }
            else if (reviewData.status === 404) {
                navigate("/pageNotFound");
            }
            else if (reviewData.status === 500) {
                navigate("/internalServerError");
            }

            else {

                alert(
                    reviewData.msg ||
                    "Failed to submit review."
                );
            }

        }

        else if (ratingData.status === 401) {

            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        }

        else if (ratingData.status === 404) {

            navigate("/pageNotFound");

        }

        else if (ratingData.status === 500) {

            navigate("/internalServerError");

        }

        else {

            alert(
                ratingData.msg ||
                "Failed to submit rating."
            );
        }

        setLoading(false);
    }


    async function handleDeleteReview(reviewId, ratingId) {

        setDeletingReview(reviewId);

        const data = await deleteReview(token, reviewId);
        if (data.succ === true) {
            const ratingData = await deleteRating(token, ratingId);

            if (ratingData.succ === true) {
                setReview({});
                setIsReviewd(false);
                setDeletingReview(null);
                setSelectedRating(0);
                setHoverRating(0);
                setReviewText("");
                setRefetchRecipe(prev=>!prev);

                return;
            }

            if (ratingData.status === 401) {
                setDeletingReview(null);
                logout();
                alert("Your token has expired please login again.");
                navigate("/login");
                return;
            }
            else if (ratingData.status === 404) {
                setDeletingReview(null);
                navigate("/pageNotFound");
                return;
            }
            else if (ratingData.status === 500) {
                setDeletingReview(null);
                navigate("/internalServerError");
                return;
            }
        }

        if (data.status === 401) {
            setDeletingReview(null);
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if (data.status === 404) {
            setDeletingReview(null);
            navigate("/pageNotFound");
        }
        else if (data.status === 500) {
            setDeletingReview(null);
            navigate("/internalServerError");
        }

        setDeletingReview(null);
    }


    // =========================================================
    // SUBMIT VALIDATION
    // =========================================================

    const canSubmit =
        selectedRating > 0 &&
        reviewText.trim().length > 4 &&
        !loading;


    // =========================================================
    // FETCH RATING WHEN COMPONENT LOADS
    // =========================================================

    useEffect(() => {

        fetchRating();

    }, [isReviewd]);


    const activeRating =
        hoverRating || selectedRating;


    return (

        <section className="review-component">

            {/* =====================================================
                REVIEW HEADER
            ===================================================== */}

            <div className="review-header">

                <h2>
                    REVIEWS <span>({recipe.numberReviews})</span>
                </h2>

            </div>


            <div className="review-recipe-name">

                <span>My Review for:</span> {recipe.name}

            </div>


            {/* =====================================================
                MY RATING
            ===================================================== */}

            {isEdit ? (

                <div>

                    <div className="my-rating-section">

                        <div className="review-section-label">
                            My rating
                        </div>


                        <div className="rating-selector">

                            <div className="rating-stars">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <button
                                        type="button"
                                        className="rating-star-button"
                                        key={star}

                                        onMouseEnter={() =>
                                            setHoverRating(star)
                                        }

                                        onMouseLeave={() => {

                                            if (isReviewd) {
                                                setHoverRating(
                                                    selectedRating
                                                );
                                            } else {
                                                setHoverRating(0);
                                            }

                                        }}

                                        onClick={() =>
                                            setSelectedRating(star)
                                        }

                                        aria-label={`Rate ${star} out of 5`}
                                    >

                                        <i
                                            className={
                                                star <= activeRating
                                                    ? "fa-solid fa-star"
                                                    : "fa-regular fa-star"
                                            }
                                        ></i>

                                    </button>

                                ))}

                            </div>


                            <div className="rating-separator"></div>


                            <span className="rating-description">

                                {activeRating > 0
                                    ? ratingTexts[activeRating]
                                    : "Select a rating"
                                }

                            </span>

                        </div>

                    </div>


                    {/* =====================================================
                        MY REVIEW
                    ===================================================== */}

                    <div className="my-review-section">

                        <div className="review-section-label">
                            My review
                        </div>


                        <div className="review-textarea-container">
                            <textarea
                                className="review-textarea"
                                value={reviewText}
                                onChange={(e) =>
                                    setReviewText(e.target.value)
                                }
                                placeholder="What did you think about the recipe?"
                                maxLength={5000}
                            />

                            <span
                                className={`review-letter-counter ${
                                    reviewText.length <= 4
                                        ? "review-letter-counter-error"
                                        : ""
                                }`}
                            >
                                {reviewText.length}/5000
                            </span>
                        </div>


                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <div className="review-actions">

                            <button
                                type="button"
                                className="review-cancel-button"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="review-submit-button"
                                onClick={handleEdit}
                                disabled={!canSubmit}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            ) : (

                isReviewd ? (

                    /* =====================================================
                        REVIEW ALREADY EXISTS
                    ===================================================== */

                    <div className="my-rating-review-done">

                        <div className="my-review-top">

                            <div className="my-review-user">

                                <span className="my-review-user-name" onClick={()=>{navigate(`/profile/${review.reviewer?._id}`)}}>
                                    {review.reviewer?.name}
                                </span>

                            </div>


                            <div className="my-review-management">

                                <button
                                    type="button"
                                    className="my-review-edit-button"
                                    onClick={() => setIsEdit(true)}
                                    title="Edit review"
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </button>


                                {(user?.role.roleName === "admin" || user?.role.roleName === "contentManager" || user?._id === review?.reviewer?._id
                                    
                                ) && (
                                    <button
                                        type="button"
                                        className="my-review-delete-button"
                                        onClick={() => handleDeleteReview(review._id, rating._id)}
                                        title="Delete review"
                                        disabled={deletingReview === review._id}
                                    >
                                        {deletingReview === review._id ? (
                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                        ) : (
                                            <i className="fa-solid fa-trash"></i>
                                        )}
                                    </button>
                                )}

                            </div>

                        </div>


                        <div className="my-review-rating-row">

                            <div className="my-review-stars">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <i
                                        key={star}
                                        className={
                                            star <= Number(
                                                rating.rating
                                            )
                                                ? "fa-solid fa-star"
                                                : "fa-regular fa-star"
                                        }
                                    ></i>

                                ))}

                            </div>


                            <span className="my-review-rating-date">

                                {new Date(
                                    rating.createdAt
                                ).toLocaleDateString()}

                            </span>

                        </div>


                        <div className="my-review-text">

                            {review.text}

                        </div>


                        {/* =================================================
                            REVIEW FOOTER
                        ================================================= */}

                        <div className="my-review-footer">

                            <div className="my-review-reactions">

                                <span>

                                    <i className="fa-regular fa-thumbs-up"></i>

                                    {review.liker?.length || 0}

                                </span>


                                <span>

                                    <i className="fa-regular fa-thumbs-down"></i>

                                    {review.disliker?.length || 0}

                                </span>

                            </div>


                            {/* =================================================
                                COMMENTS
                            ================================================= */}

                            {expandedComments && (

                                <div className="review-comments">

                                    {review.comments?.length === 0 ? (

                                        <div className="no-comment-review">
                                            No comments
                                        </div>

                                    ) : (

                                        review.comments?.map((comment) => (

                                            <div
                                                key={comment._id}
                                                className="review-comment-row"
                                            >

                                                <i className="fa-solid fa-reply comment-reply-icon"></i>

                                                <div className="review-comment">

                                                    <div className="comment-top">

                                                        <div className="comment-user">

                                                            <div className="comment-user-name-row">
                                                                <i className="fa-solid fa-user"></i>

                                                                <span
                                                                    className="comment-user-name"
                                                                    onClick={() => {
                                                                        navigate(`/profile/${comment.user?._id}`);
                                                                    }}
                                                                >
                                                                    {comment.user?.name}
                                                                </span>

                                                                {(user?.role.roleName === "admin" ||
                                                                    user?.role.roleName === "contentManager" ||
                                                                    user?._id === comment.user?._id) && (
                                                                    deletingComment === comment._id ? (
                                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                                    ) : (
                                                                        <i
                                                                            className="fa-solid fa-trash"
                                                                            onClick={() =>
                                                                                handleDeleteComment(comment._id)
                                                                            }
                                                                        ></i>
                                                                    )
                                                                )}
                                                            </div>

                                                            <span className="comment-date">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <div className="comment-text">
                                                        {comment.text}
                                                    </div>


                                                    <div className="comment-footer">

                                                        <div className="comment-reactions">

                                                            <span>
                                                                <i
                                                                    className={
                                                                        comment.liker?.some(
                                                                            id => id.toString() === user._id.toString()
                                                                        )
                                                                            ? "fa-solid fa-thumbs-up"
                                                                            : "fa-regular fa-thumbs-up"
                                                                    }
                                                                    onClick={() => handleLikeComment(comment._id)}
                                                                ></i>

                                                                {comment.liker?.length || 0}
                                                            </span>

                                                            <span>
                                                                <i
                                                                    className={
                                                                        comment.disliker?.some(
                                                                            id => id.toString() === user._id.toString()
                                                                        )
                                                                            ? "fa-solid fa-thumbs-down"
                                                                            : "fa-regular fa-thumbs-down"
                                                                    }
                                                                    onClick={() => handleDislikeComment(comment._id)}
                                                                ></i>

                                                                {comment.disliker?.length || 0}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        ))

                                    )}

                                </div>

                            )}


                            {/* =================================================
                                COMMENT BUTTON
                            ================================================= */}

                            {!expandedComments ? (

                                <button
                                    type="button"
                                    className="show-comments-button"
                                    onClick={() => {

                                        /*
                                         * If comments were already
                                         * fetched, simply show them.
                                         */

                                        if (
                                            review.comments?.length > 0
                                        ) {

                                            setExpandedComments(true);

                                        }

                                        /*
                                         * Otherwise fetch them.
                                         */

                                        else {

                                            fetchComments(
                                                review._id,
                                                0
                                            );

                                        }

                                    }}
                                >
                                    Show comments
                                </button>

                            ) : commentsHasMore ? (

                                <button
                                    type="button"
                                    className="show-comments-button"
                                    onClick={() =>
                                        fetchComments(
                                            review._id,
                                            review.comments?.length || 0
                                        )
                                    }
                                >
                                    Show more comments
                                </button>

                            ) : (

                                <button
                                    type="button"
                                    className="show-comments-button"
                                    onClick={() =>
                                        setExpandedComments(false)
                                    }
                                >
                                    Hide comments
                                </button>

                            )}

                        </div>

                    </div>

                ) : (

                    /* =====================================================
                        NO REVIEW YET
                    ===================================================== */

                    <div>

                        <div className="my-rating-section">

                            <div className="review-section-label">
                                My rating
                            </div>


                            <div className="rating-selector">

                                <div className="rating-stars">

                                    {[1, 2, 3, 4, 5].map((star) => (

                                        <button
                                            type="button"
                                            className="rating-star-button"
                                            key={star}

                                            onMouseEnter={() =>
                                                setHoverRating(star)
                                            }

                                            onMouseLeave={() => {

                                                if (isReviewd) {
                                                    setHoverRating(
                                                        selectedRating
                                                    );
                                                } else {
                                                    setHoverRating(0);
                                                }

                                            }}

                                            onClick={() =>
                                                setSelectedRating(star)
                                            }

                                            aria-label={`Rate ${star} out of 5`}
                                        >

                                            <i
                                                className={
                                                    star <= activeRating
                                                        ? "fa-solid fa-star"
                                                        : "fa-regular fa-star"
                                                }
                                            ></i>

                                        </button>

                                    ))}

                                </div>


                                <div className="rating-separator"></div>


                                <span className="rating-description">

                                    {activeRating > 0
                                        ? ratingTexts[activeRating]
                                        : "Select a rating"
                                    }

                                </span>

                            </div>

                        </div>


                        {/* =====================================================
                            MY REVIEW
                        ===================================================== */}

                        <div className="my-review-section">

                            <div className="review-section-label">
                                My review
                            </div>


                            <div className="review-textarea-container">
                            <textarea
                                className="review-textarea"
                                value={reviewText}
                                onChange={(e) =>
                                    setReviewText(e.target.value)
                                }
                                placeholder="What did you think about the recipe?"
                                maxLength={5000}
                            />

                            <span
                                className={`review-letter-counter ${
                                    reviewText.length <= 4
                                        ? "review-letter-counter-error"
                                        : ""
                                }`}
                            >
                                {reviewText.length}/5000
                            </span>
                        </div>


                            {/* =================================================
                                ACTION BUTTONS
                            ================================================= */}

                            <div className="review-actions">

                                <button
                                    type="button"
                                    className="review-cancel-button"
                                    onClick={handleClear}
                                    disabled={loading}
                                >
                                    Clear
                                </button>


                                <button
                                    type="button"
                                    className="review-submit-button"
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Submit"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                )

            )}

        </section>

    );
}