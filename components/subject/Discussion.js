import React, { useState, useEffect } from "react";
import DiscussionFilter from "./discussion/DiscussionFilter";
import DiscussionForm from "./discussion/DiscussionForm";
import DiscussionItem from "./discussion/DiscussionItem";
import {Grid, Divider} from "@material-ui/core";
import {getCourseDiscussions, deleteCourseDiscussion} from "../../lib/api";

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
      if(data.status == "ok"){
          setDiscussions(data.discussions);
      }
      else{
          alert(data.message);
      }
    }

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
                            deleteDiscussion={deleteDiscussion}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Discussion;
