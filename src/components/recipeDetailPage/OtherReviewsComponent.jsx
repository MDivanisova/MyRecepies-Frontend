import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { getComments, creatComment, likeComment, dislikeComment, deleteComment } from "../../utils/CommentEndpoint";

import "../Spiner"
import "./otherReviewsComponent.css"
import { dislikeReview, likeReview, deleteReview } from "../../utils/ReviewEndpoint";

export default function OtherReviewsComponent({ recipe, reviews, setReviews }) {
    ///////isto tuka da se provere
    const navigate = useNavigate();

    const [replyOpen, setReplyOpen] = useState(null);
    const [replyText, setReplyText] = useState("");

    const [expandedComments, setExpandedComments] = useState({});
    const [commentsHasMore, setCommentsHasMore] = useState({});

    const { token, logout, user } = useAuth();
    const [loadingComments, setLoadingComments] = useState(null);

    const [deletingComment, setDeletingComment] = useState(null);
    const [deletingReview, setDeletingReview] = useState(null);

    async function fetchComments(reviewId, commentsLength) {

        setLoadingComments(reviewId);

        const data = await getComments(
            token,
            reviewId,
            commentsLength
        );

        if (data.succ === true) {

            setReviews(prev =>
                prev.map(review =>
                    review._id === reviewId
                        ? {
                            ...review,
                            comments: [
                                ...(review.comments || []),
                                ...data.comments
                            ]
                        }
                        : review
                )
            );

            setExpandedComments(prev => ({
                ...prev,
                [reviewId]: true
            }));

            setCommentsHasMore(prev => ({
                ...prev,
                [reviewId]: data.moreAvailable
            }));
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

        setLoadingComments(null);

    }

    async function handleSubmitComment(reviewId) {

        const text = replyText.trim();

        if (text === "") {
            return;
        }

        setLoadingComments(true);


        const data = await creatComment( token, reviewId, text);
        const dataC = await getComments(token, reviewId, 0);
        if (data.succ === true) {

            setReplyText("");
            setReplyOpen(null);

            setReviews(prev =>
                prev.map(review =>
                    review._id === reviewId
                        ? {
                            ...review,
                            comments: [
                                ...[],
                                ...dataC.comments
                            ]
                        }
                        : review
                )
            );

             setCommentsHasMore(prev => ({
                ...prev,
                [reviewId]: dataC.moreAvailable
            }));

            setExpandedComments(prev => ({
                ...prev,
                [reviewId]: true
            }));

        } else if (data.status === 401) {
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        } else if (data.status === 404) {

            navigate("/pageNotFound");

        } else if (data.status === 500) {

            navigate("/internalServerError");

        }

        setLoadingComments(false);

    } 

    async function handleLike(commentId, reviewId) {

    setReviews(prev =>
        prev.map(review =>
            review._id === reviewId
                ? {
                    ...review,
                    comments: review.comments.map(comment =>
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
                }
                : review
        )
    );

    const data = await likeComment(token, commentId);

    if (data.succ === true) {
        return;
    }

    if (data.status === 400) {

        setReviews(prev =>
            prev.map(review =>
                review._id === reviewId
                    ? {
                        ...review,
                        comments: review.comments.map(comment =>
                            comment._id === commentId
                                ? {
                                    ...comment,
                                    liker: comment.liker?.filter(
                                        id => id.toString() !== user._id.toString()
                                    ) || []
                                }
                                : comment
                        )
                    }
                : review
            )
        );

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

    async function handleDislike(commentId, reviewId) {

        setReviews(prev =>
            prev.map(review =>
                review._id === reviewId
                    ? {
                        ...review,
                        comments: review.comments.map(comment =>
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
                    }
                    : review
            )
        );

        const data = await dislikeComment(token, commentId);

        if (data.succ === true) {
            return;
        }

        if (data.status === 400) {

            setReviews(prev =>
                prev.map(review =>
                    review._id === reviewId
                        ? {
                            ...review,
                            comments: review.comments.map(comment =>
                                comment._id === commentId
                                    ? {
                                        ...comment,
                                        disliker: comment.disliker?.filter(
                                            id => id.toString() !== user._id.toString()
                                        ) || []
                                    }
                                    : comment
                            )
                        }
                    : review
                )
            );

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

    async function handleLikeReview(reviewId) {

        setReviews(prev =>
            prev.map(review =>
                review._id === reviewId
                    ? {
                        ...review,

                        liker: review.liker?.some(
                            id => id.toString() === user._id.toString()
                        )
                            ? review.liker.filter(
                                id => id.toString() !== user._id.toString()
                            )
                            : [
                                ...(review.liker || []),
                                user._id
                            ],

                        disliker: review.disliker?.filter(
                            id => id.toString() !== user._id.toString()
                        ) || []
                    }
                    : review
            )
        );

        const data = await likeReview(token, reviewId);

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


    async function handleDislikeReview(reviewId) {

        setReviews(prev =>
            prev.map(review =>
                review._id === reviewId
                    ? {
                        ...review,

                        disliker: review.disliker?.some(
                            id => id.toString() === user._id.toString()
                        )
                            ? review.disliker.filter(
                                id => id.toString() !== user._id.toString()
                            )
                            : [
                                ...(review.disliker || []),
                                user._id
                            ],

                        liker: review.liker?.filter(
                            id => id.toString() !== user._id.toString()
                        ) || []
                    }
                    : review
            )
        );

        const data = await dislikeReview(token, reviewId);

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

    async function handleDeleteComment(commentId, reviewId){
        setDeletingComment(commentId);

            const data = await deleteComment(token, commentId);

            if (data.succ === true) {

                setReviews(prev =>
                    prev.map(review =>
                        review._id === reviewId
                            ? {
                                ...review,
                                comments: review.comments.filter(
                                    comment => comment._id !== commentId
                                )
                            }
                            : review
                    )
                );

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

    async function handleDeleteReview(reviewId) {

        setDeletingReview(reviewId);

        const data = await deleteReview(token, reviewId);
        console.log(data)
        if (data.succ === true) {

            setReviews(prev =>
                prev.filter(review => review._id !== reviewId)
            );

            setDeletingReview(null);

            return;
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

    return (
        <div className="other-reviews-section">

            <div className="review-header">

                <h2>
                    REVIEWS <span>({recipe.numberReviews})</span>
                </h2>

            </div>

            {reviews.length === 0 && (
                <div>No reviews for this recipe</div>
            )}

            {reviews.map((review) => (

                <div
                    className="most-helpful-review-placeholder"
                    key={review._id}
                >

                    <div className="my-rating-review-done">

                        <div className="my-review-top">

                            <div className="my-review-user">
                                <i className="fa-solid fa-user"></i>

                                <span className="my-review-user-name" onClick={()=>{navigate(`/profile/${review.reviewer?._id}`)}} >
                                    {review.reviewer?.name}
                                </span>

                                 {(user?.role.roleName === "admin" || user?.role.roleName === "contentManager") && (
                                    deletingReview === review._id ? (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                        <i
                                            className="fa-solid fa-trash"
                                            onClick={() => handleDeleteReview(review._id)}
                                        ></i>
                                    )
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
                                                review.rating?.$numberDecimal ||
                                                review.rating
                                            )
                                                ? "fa-solid fa-star"
                                                : "fa-regular fa-star"
                                        }
                                    ></i>

                                ))}

                            </div>

                            <span className="my-review-rating-date">
                                {new Date( review.createdAt ).toLocaleDateString()}
                            </span>

                        </div>


                        <div className="my-review-text">
                            {review.text}
                        </div>


                        <div className="my-review-footer">

                            <div className="my-review-reactions">

                                <span>
                                    <i
                                        className={
                                            review.liker?.some(
                                                id => id.toString() === user._id.toString()
                                            )
                                                ? "fa-solid fa-thumbs-up"
                                                : "fa-regular fa-thumbs-up"
                                        }
                                        onClick={() => handleLikeReview(review._id)}
                                    ></i>

                                    {review.liker?.length || 0}
                                </span>

                                <span>
                                    <i
                                        className={
                                            review.disliker?.some(
                                                id => id.toString() === user._id.toString()
                                            )
                                                ? "fa-solid fa-thumbs-down"
                                                : "fa-regular fa-thumbs-down"
                                        }
                                        onClick={() => handleDislikeReview(review._id)}
                                    ></i>

                                    {review.disliker?.length || 0}
                                </span>


                                <button
                                    type="button"
                                    className="review-reply-button"
                                    onClick={() => {

                                        if (replyOpen === review._id) {

                                            setReplyOpen(null);
                                            setReplyText("");

                                        } else {

                                            setReplyOpen(review._id);
                                            setReplyText("");

                                        }

                                    }}
                                >
                                    <i className="fa-solid fa-reply"></i>
                                    <span>Reply</span>
                                </button>

                            </div>


                            {replyOpen === review._id && (

                                <div className="review-reply-form">

                                    <div className="review-reply-label">
                                        My comment on this review:
                                    </div>


                                    <div className="review-reply-textarea-container">

                                        <textarea
                                            className="review-reply-textarea"
                                            value={replyText}
                                            onChange={(e) =>
                                                setReplyText(e.target.value)
                                            }
                                            placeholder="Write your comment..."
                                            maxLength={5000}
                                        />

                                        <span
                                            className={`review-reply-letter-counter ${
                                                replyText.trim().length === 0
                                                    ? "review-reply-letter-counter-error"
                                                    : ""
                                            }`}
                                        >
                                            {replyText.length}/5000
                                        </span>

                                    </div>


                                    <div className="review-reply-actions">

                                        <button
                                            type="button"
                                            className="review-reply-cancel-button"
                                            onClick={() => {
                                                setReplyOpen(null);
                                                setReplyText("");
                                            }}
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="button"
                                            className="review-reply-submit-button"                                        
                                            onClick={() => handleSubmitComment(review._id)}
                                            disabled={
                                                replyText.trim() === ""
                                            }
                                        >
                                            Submit
                                        </button>

                                    </div>

                                </div>

                            )}


                            {/* COMMENTS */}

                            {expandedComments[review._id] && (

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

                                                                <span className="comment-user-name" onClick={()=>{navigate(`/profile/${comment.user?._id}`)}}>
                                                                    {comment.user?.name}
                                                                </span>

                                                               {(user?.role.roleName === "admin" || user?.role.roleName === "contentManager" || user?._id === comment.user?._id) && (
                                                                    deletingComment === comment._id ? (
                                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                                    ) : (
                                                                        <i
                                                                            className="fa-solid fa-trash"
                                                                            onClick={() =>
                                                                                handleDeleteComment(comment._id, review._id)
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
                                                                    onClick={() => handleLike(comment._id, review._id)}
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
                                                                    onClick={() => handleDislike(comment._id, review._id)}
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


                            {/* COMMENT BUTTONS */}

                            <div className="review-comments-actions">

                                {!expandedComments[review._id] ? (

                                    <button
                                        type="button"
                                        className="show-comments-button"
                                        onClick={() =>
                                            fetchComments(
                                                review._id,
                                                review.comments?.length || 0
                                            )
                                        }
                                        disabled={loadingComments === review._id}
                                    >
                                        {loadingComments === review._id ? (
                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                        ) : (
                                            "Show comments"
                                        )}
                                    </button>

                                ) : commentsHasMore[review._id] ? (

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
                                            setExpandedComments(prev => ({
                                                ...prev,
                                                [review._id]: false
                                            }))
                                        }
                                    >
                                        Hide comments
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}