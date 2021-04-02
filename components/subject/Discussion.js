import React, { useState, useEffect } from "react";
import DiscussionFilter from "./discussion/DiscussionFilter";
import DiscussionForm from "./discussion/DiscussionForm";
import DiscussionItem from "./discussion/DiscussionItem";
import ModalDiscussion from "./discussion/ModalDiscussion";
import {Grid, Divider} from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import {getCourseDiscussions, deleteCourseDiscussion} from "../../lib/api";
import Carousel from "react-elastic-carousel";


const Discussion = (props) => {
    const [discussions, setDiscussions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getCourseDiscussions(props.courseId).then((res) => {
            setDiscussions(res.discussions);
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
      setDiscussions(data.discussions);
    }

    const openDiscussionModal = (id) => {
        setOpenModal(true);
        setSelected(discussions.find((item) => item._id === id));
    };

    const getIndexSelected = () => {
        if (selected) {
            return discussions.findIndex(item => item._id === selected._id);
        }

        return 0;
    }

    const closeDiscussionModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        let wrs = document.querySelectorAll(".wrs_stack");
        console.log(wrs)
        if (wrs) {
            for (let item of wrs) {
                item.parentNode.removeChild(item);
            }
        }
        console.log(openModal)
    }, [openModal]);

    return (
        <div className="subject-discussion">
            <DiscussionFilter openDiscussionForm={openDiscussionForm} />
            <DiscussionForm
                auth={props.auth}
                closeDiscussionForm={closeDiscussionForm}
                afterCreateDiscussion={afterCreateDiscussion}
                open={openForm}
                courseId={props.courseId}
            />
            <Grid container className="discussion-item-container">
                {discussions.map((e) => (
                    <Grid key={e._id} item xs={12}>
                        <DiscussionItem
                            data={e}
                            handleOpen={openDiscussionModal}
                            setSelected={setSelected}
                            deleteDiscussion={deleteDiscussion}
                        />
                    </Grid>
                ))}
            </Grid>
            <Grid item className="modal-container">
            {selected && openModal ? (
                <Carousel
                    itemsToShow={1}
                    tiltEasing="ease"
                    easing="ease"
                    enableTilt = {true}
                    enableMouseSwipe={true}
                    enableSwipe={true}
                    initialActiveIndex={getIndexSelected()}
                    renderPagination={({ pages, activePage, onClick }) => <span>{null}</span>}
                    // renderArrow={({type, onClick}) => <Grid onClick={onClick}>{type === `prev` ? <ArrowBackIos onClick/> : <ArrowForwardIos />}</Grid>}
                >
                    {discussions.map((item, index) => {
                        return (
                            <ModalDiscussion
                                key={index}
                                selected={item}
                                open={openModal}
                                handleClose={closeDiscussionModal}
                                setSelected={setSelected}
                                deleteDiscussion={deleteDiscussion}
                            />
                        );
                    })}
                </Carousel>
            ) : null}
            </Grid>
        </div>
    );
};

export default Discussion;
