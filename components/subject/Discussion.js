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
    const [discussions, setDiscussions] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [params, setParams] = useState({
        limit: 10,
        page: 1,
        search: '',
        status: 'ALL',
        tags: []
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

    const resetFilter = () => {
        setParams((prev) => ({
            search: '',
            status: '',
            tags: [],
        }));
    }

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

    const handleFilter = () => {
        setParams((prev) => ({
            ...prev,
            page: 1,
        }));

        setLoading(true);
        getCourseDiscussions(courseId, params).then((res) => {
            console.log(res);
            setTotalData(res.pages);
            setDiscussions(res.discussions);
            setLoading(false);
        });
    }

    console.log(params);
    const { page } = params;
    return (
        <div className="subject-discussion">
            <DiscussionFilter
                params={params}
                setParams={setParams}
                openDiscussionForm={openDiscussionForm}
                canCreate={canCreateDiscussion}
                canSearch={canSearchDiscussion}
                canFilter={canFilterDiscussion}
                handleFilter={handleFilter}
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
