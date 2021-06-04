import React, { useState, useEffect } from "react";
import DiscussionFilter from "./discussion/DiscussionFilter";
import DiscussionForm from "./discussion/DiscussionForm";
import DiscussionItem from "./discussion/DiscussionItem";
import { Grid, CircularProgress } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { getCourseDiscussions, deleteCourseDiscussion } from "../../lib/api";

const Discussion = (props) => {
    const { courseId, course, auth } = props;
    const {
        canCreateDiscussion,
        canVoteDiscussion,
        canVoteAnswer,
        canSearchDiscussion,
        canFilterDiscussion,
    } = course;
    console.log(course);
    const [discussions, setDiscussions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [params, setParams] = useState({
        query: "",
        limit: 10,
        page: 1,
    });
    const [totalData, setTotalData] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCourseDiscussions(courseId, params).then((res) => {
            console.log(res);
            setTotalData(res.pages);
            setDiscussions(res.discussions);
            setLoading(false);
        });
    }, []);

    const openDiscussionForm = () => {
        setOpenForm(true);
    };

    const closeDiscussionForm = () => {
        setOpenForm(false);
    };

    const afterCreateDiscussion = (discussions) => {
        setOpenForm(false);
        setDiscussions(discussions);
    };

    const deleteDiscussion = async (discussionId) => {
        const data = await deleteCourseDiscussion(discussionId);
        if (data.status == "ok") {
            setDiscussions(data.discussions);
        } else {
            alert(data.message);
        }
    };

    const handlePaginationChange = (e, page) => {
        setParams((prev) => ({
            ...prev,
            page: page,
        }));

        setLoading(true);
        getCourseDiscussions(courseId, params).then((res) => {
            console.log(res);
            setTotalData(res.pages);
            setDiscussions(res.discussions);
            setLoading(false);
        });
    };

    useEffect(() => {
        let wrs = document.querySelectorAll(".wrs_stack");
        console.log(wrs);
        if (wrs) {
            for (let item of wrs) {
                item.parentNode.removeChild(item);
            }
        }
        console.log(openModal);
    }, [openModal]);

    const { page } = params;

    return (
        <div className="subject-discussion">
            <DiscussionFilter
                openDiscussionForm={openDiscussionForm}
                canCreate={canCreateDiscussion}
                canSearch={canSearchDiscussion}
                canFilter={canFilterDiscussion}
            />
            <DiscussionForm
                auth={auth}
                closeDiscussionForm={closeDiscussionForm}
                afterCreateDiscussion={afterCreateDiscussion}
                open={openForm}
                courseId={courseId}
            />

            {discussions.length > 0 && (
                <Pagination
                    className="subject-course-pagination"
                    count={totalData}
                    color="primary"
                    page={page}
                    onChange={handlePaginationChange}
                />
            )}

            {loading && (
                <Grid container className="loading-container">
                    <CircularProgress
                        thickness={6}
                        size="4rem"
                        className="circular-progress-bar"
                    />
                </Grid>
            )}

            {!loading && (
                <Grid item>
                    {discussions.length > 0 ? (
                        <Grid container className="discussion-item-container">
                            {discussions.map((e) => (
                                <Grid key={e._id} item xs={12}>
                                    <DiscussionItem
                                        data={e}
                                        canVoteDiscussion={canVoteDiscussion}
                                        canVoteAnswer={canVoteAnswer}
                                        deleteDiscussion={deleteDiscussion}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <h5 className="no-item-yet">
                            This course doesn't have any discussion yet!
                        </h5>
                    )}
                </Grid>
            )}
        </div>
    );
};

export default Discussion;
