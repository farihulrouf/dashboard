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
  border: 1px solid #d9d9d9;
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

const Tag = styled(({ label, onClose, onDelete, ...props }) => {
  return (
    <div {...props}>
      <span>{label}</span>
      <CloseIcon
        onClick={() => {
          onClose(String(label)), onDelete();
        }}
      />
    </div>
  );
})`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #3f51b5;
  border: none;
  border-radius: 4px;
  color: white;
  box-sizing: content-box;
  padding: 4px 4px 4px 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #3f51b5;
    background-color: #3f51b5;
  }

  & span {
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
  position: relative;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

export default function CustomizedHook({
  name,
  filter,
  setFilter,
  opt,
  input,
  setInput,
}) {
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
    id: `customized-hook-${name}`,
    defaultValue: [],
    limitTags: 2,
    multiple: true,
    options: opt,
    getOptionLabel: (option) => option.name,
  });

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (name === "Instructor") {
      if (value.length) {
        setFilter((prev) => {
          return {
            ...prev,
            instructor: value,
          };
        });
      }
    } else if (name === "Organization") {
      if (value.length) {
        setFilter((prev) => {
          if (value.length) {
            return {
              ...prev,
              organization: value,
            };
          }
        });
      }
    }
  }, [value, valueSet]);

  const [valueSet, setValueSet] = useState([]);

  useEffect(() => {
    if (name === "Instructor") {
      setValueSet([...filter.instructor]);
    } else {
      setValueSet([...filter.organization]);
    }
  }, [name === "Instructor" ? filter.instructor : filter.organization]);

  const onClose = (label) => {
    setValueSet((prev) => prev.filter((item) => item.name !== label));

    if (name === "Instructor") {
      setFilter((prev) => {
        return {
          ...prev,
          instructor: prev.instructor.filter((item) => item.name !== label),
        };
      });
    } else if (name === "Organization") {
      setFilter((prev) => {
        return {
          ...prev,
          organization: prev.organization.filter((item) => item.name !== label),
        };
      });
    }
  };

  return (
    <NoSsr>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>{name}</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {valueSet.map((option, index) => (
            <Tag
              label={option.name}
              {...getTagProps({ index })}
              onClose={onClose}
            />
          ))}

          <input
            {...getInputProps()}
            onChange={(e) => handleChange(e)}
            value={input}
          />
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
    </NoSsr>
  );
}
