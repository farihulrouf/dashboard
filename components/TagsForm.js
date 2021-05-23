/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const Tag = styled(({ label, onDelete, ...props }) => (
    <div {...props}>
        <span>{label}</span>
        <CloseIcon onClick={onDelete} />
    </div>
))`
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 22px;
    background-color: #3f51b5;
    border-radius: 2px;
    box-sizing: content-box;
    padding: 2px 4px 2px 10px;
    outline: 0;
    color: white;
    overflow: hidden;

    &:focus {
        border-color: #3f51b5;
        background-color: #e6f7ff;
    }

    & span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: 'Gilroy', sans-serif !important;
    }

    & svg {
        font-size: 12px;
        cursor: pointer;
        padding: 4px;
    }
`;


export default function TagsForm({ name, items, setItems, getItems }) {

    const [tagsOption, setTagsOption] = useState([])
    const [courseTags] = useState(items);

    useEffect(() =>{
        getItems()
        .then((res) =>{
            console.log(res)
            if(res.status == "ok"){
                setTagsOption(res.data.map((val) => val.name))
            }
        })
        .catch((err) =>{
            console.error(err)
    })
    },[])

    const handleChange = (event, value) => {
        setItems(name, [...value]);
    }

    return (
        <Autocomplete
            className="tagform"
            multiple
            onChange={handleChange}
            options={tagsOption}
            defaultValue={courseTags}
            freeSolo
            renderTags={(value, getTagProps) => {
                return (value.map((option, index) => {
                    if (index < 5) {
                        return (
                            <Tag
                                label={option}
                                {...getTagProps({ index })}
                            />
                        );
                    } else {
                        value.unshift();
                    }
                }))
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder={`Add Up to 5 Tags`}
                />
            )}
        />
    );
}