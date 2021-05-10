import React, { useState, useEffect } from "react";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

const Label = styled("label")`
    padding: 0 0 4px;
    line-height: 1.5;
    display: block;
`;

const InputWrapper = styled("div")`
    width: 300px;
    border: 1px solid #3f51b5;
    background-color: #fff;
    border-radius: 4px;
    padding: 1px;
    display: flex;
    flex-wrap: wrap;

    &:hover {
        border-color: #3f51b5;
    }

    &.focused {
        border-color: #3f51b5;
        box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
    }

    & input {
        font-size: 14px;
        height: 30px;
        box-sizing: border-box;
        padding: 4px 6px;
        width: 0;
        min-width: 30px;
        flex-grow: 1;
        border: 0;
        margin: 0;
        outline: 0;
    }
`;

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
    padding: 0 4px 0 10px;
    outline: 0;
    color: white;
    overflow: hidden;

    &:focus {
        border-color: #40a9ff;
        background-color: #e6f7ff;
    }

    & span {
        font-family: 'Gilroy', sans-serif !important;
        color: white;
        font-weight: 300;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    & svg {
        font-size: 12px;
        cursor: pointer;
        padding: 4px;
    }
`;

const Listbox = styled("ul")`
    width: 300px;
    margin: 2px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: #fff;
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-family: 'Gilroy', sans-serif !important;
    z-index: 1;

    & li {
        padding: 5px 12px;
        display: flex;

        & span {
            flex-grow: 1;      
            font-weight: 300;
        }

        & svg {
            color: transparent;
        }
    }

    & li[aria-selected="true"] {
        background-color: #fafafa;
        
        & span {
            font-weight: 500;
        }

        & svg {
            color: #3f51b5;
        }
    }

    & li[data-focus="true"] {
        background-color: #e6f7ff;
        cursor: pointer;

        & svg {
            color: #000;
        }
    }

    &::-webkit-scrollbar {
        width: 8px;
        /* width of the entire scrollbar */
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 20px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #c7c7c7;
        /* color of the scroll thumb */
        border-radius: 20px;
        border-right: solid 2px white;
    }
`;

export default function CustomizedHook({
    label,
    list,
    itemFilter,
    setItemFilter,
}) {
    const [items] = useState(itemFilter);

    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete({
        id: `customized-hook-demo-${label}`,
        defaultValue: items,
        multiple: true,
        options: list,
        getOptionLabel: (option) => option.name,
    });

    useEffect(() => {
        setItemFilter(value);
    }, [value]);

    return (
        <NoSsr>
            <div>
                <div {...getRootProps()}>
                    <Label {...getInputLabelProps()}>{label}</Label>
                    <InputWrapper
                        ref={setAnchorEl}
                        className={focused ? "focused" : ""}
                    >
                        {value.map((option, index) => (
                            <Tag
                                label={option.name}
                                {...getTagProps({ index })}
                            />
                        ))}

                        <input {...getInputProps()} />
                    </InputWrapper>
                </div>
                {groupedOptions.length > 0 ? (
                    <Listbox {...getListboxProps()}>
                        {groupedOptions.map((option, index) => (
                            <li {...getOptionProps({ option, index })}>
                                <span>{option.name}</span>
                                <CheckIcon fontSize="small" />
                            </li>
                        ))}
                    </Listbox>
                ) : null}
            </div>
        </NoSsr>
    );
}
