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
    const { 
        params,
        setParams,
        canCreate,
        canSearch,
        canFilter,
        openDiscussionForm,
        handleFilter
    } = props;

    const [openModal, setOpenModal] = useState(false);

    const handleDiscussionModal = () => {
        setOpenModal((prev) => !prev);
    }

    const onQueryChange = (e) => {
        setParams((prev) => ({
            ...prev,
            search: e.target.value,
        }))
    };

    const deleteTag = (index) => {
        setParams((prev) => ({
            ...prev,
            tags: prev.tags.filter((item) => item.indexOf(index)),
        }));
    };

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
                                value={params.search}
                                onChange={onQueryChange}
                                disabled={!canSearch}
                            />
                            <Search color="disabled" onClick={handleFilter} />
                        </Grid>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item className="second-row">
                <Grid item>
                    {params.tags.map((item, index) => {
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
                                params={params}
                                setParams={setParams}
                                handleFilter={handleFilter}
                            />
                        </Grid>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DiscussionFilter;
