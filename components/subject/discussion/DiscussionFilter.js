import React, { useState } from "react";
import {
    Grid,
    IconButton,
    withStyles,
    InputBase,
    Button,
} from "@material-ui/core";
import { FilterList, Add, Search, Close } from "@material-ui/icons";

const DiscussionFilter = (props) => {
    const [query, setQuery] = useState({
        content: "",
        dateStart: "",
        dateEnd: "",
        creator: [],
        category: [],
        page: 1,
    });

    const [tags, setTags] = useState(["Teorema"]);

    const onQueryChange = (e) => {
        if (e) {
            if (e.target.name == "content") {
                setQuery(prev => {
                    return {
                        ...prev,
                        content: e.target.value
                    }
                })
            }
        }
    };

    const deleteTag = (index) => {
        setTags((prev) => {
            return prev.filter((item) => !item.indexOf(index));
        });
    };

    return (
        <Grid item>
            <Grid item className="discussion-filter">
                <Grid item className="create-post-container">
                    <Button
                        onClick={props.openDiscussionForm}
                        className="create-post-btn"
                    >
                        CREATE NEW POST <Add />
                    </Button>
                </Grid>
                <Grid item className="search-post">
                    <Grid item className="input-container">
                        <InputBase
                            placeholder="Search for discussions?"
                            name="content"
                            value={query.content}
                            onChange={onQueryChange}
                        />
                        <Search color="disabled" />
                    </Grid>
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
                    <IconButton aria-label="show-filter">
                        <FilterList />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DiscussionFilter;
