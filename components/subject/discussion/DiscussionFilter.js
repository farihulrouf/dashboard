import React, { useState } from "react";
import {
    Grid,
    IconButton,
    Tooltip,
    InputBase,
    Button,
} from "@material-ui/core";
import { FilterList, Add, Search, Close } from "@material-ui/icons";
import DiscussionFilterDialog from "./DiscussionFilterDialog";

const DiscussionFilter = (props) => {
    const [query, setQuery] = useState({
        content: "",
        dateStart: "",
        dateEnd: "",
        creator: [],
        category: [],
        page: 1,
    });

    const [tags, setTags] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const handleDiscussionModal = () => {
        setOpenModal((prev) => !prev);
    }

    const onQueryChange = (e) => {
        setFilter((prev) => ({
            ...prev,
            search: e.target.value,
        }))
    };

    const deleteTag = (index) => {
        setTags((prev) => {
            return prev.filter((item) => !item.indexOf(index));
        });
    };

    const { 
        filter,
        setFilter,
        canCreate,
        canSearch,
        canFilter,
        openDiscussionForm 
    } = props;

    return (
        <Grid item>
            <Grid item className="discussion-filter">
                {canCreate && (
                    <Grid item className="create-post-container">
                        <Button
                            onClick={openDiscussionForm}
                            className="create-post-btn"
                        >
                            CREATE NEW POST <Add />
                        </Button>
                    </Grid>
                )}
                <Grid item className="search-post">
                    <Tooltip
                        title={!canSearch ? "Unable to search discussion" : ""}
                    >
                        <Grid item className="input-container">
                            <InputBase
                                placeholder="Search for discussions?"
                                name="content"
                                value={filter.search}
                                onChange={onQueryChange}
                                disabled={!canSearch}
                            />
                            <Search color="disabled" />
                        </Grid>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item className="second-row">
                <Grid item>
                    {tags.map((item, index) => {
                        return (
                            <Grid key={index} item className="tag">
                                {item}{" "}
                                <Close onClick={() => deleteTag(index)} />
                            </Grid>
                        );
                    })}
                </Grid>
                <Grid item>
                    <Tooltip
                        title={!canFilter ? "Unable to filter discussion" : ""}
                    >
                        <Grid item>
                            <IconButton
                                aria-label="show-filter"
                                disabled={!canFilter}
                                onClick={handleDiscussionModal}
                            >
                                <FilterList />
                            </IconButton>
                            <DiscussionFilterDialog
                                handleClose={handleDiscussionModal}
                                open={openModal}
                                filter={filter}
                                setFilter={setFilter}
                            />
                        </Grid>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DiscussionFilter;
