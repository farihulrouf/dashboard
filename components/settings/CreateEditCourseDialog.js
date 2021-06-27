import React from "react";
import {
    Grid,
    TextField,
    InputLabel,
    IconButton,
    Button,
    CircularProgress,
} from "@material-ui/core";
import { Add, AddAPhoto, Update } from "@material-ui/icons";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import { createCourse, updateCourse, getTags } from "../../lib/api";
import TagsForm from "./../TagsForm";
import CourseSyllabus from "./CourseSyllabus";
import AvatarPicker from "./../AvatarPicker";

export default function CreateEditCourseDialog(props) {
    const [state, setState] = React.useState({
        showCropper: false,
        avatarChosen: undefined,
        course: {
            name: "",
            about: "",
            logo: "",
            price: "",
            prerequisites: [],
            materials: [],
            instructors: [],
            syllabus: [],
            ...props.course,
        },
    });

    const [isLoading, setIsLoading] = React.useState(false);
    const [showInput, setShowInput] = React.useState(false);
    const [newSyllabus, setNewSyllabus] = React.useState({
        title: "",
        description: "",
        date: new Date(),
    });

    const handleSyllabus = (e) => {
        const { name, value } = e.target;

        setNewSyllabus((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setState((prev) => {
            return {
                ...prev,
                course: {
                    ...prev.course,
                    [name]: value,
                },
            };
        });
    };

    const handlePrice = (event, value) => {
        setState((prev) => {
            return {
                ...prev,
                course: {
                    ...prev.course,
                    price: value,
                },
            };
        });
    };

    const onButtonClick = (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (state.course._id) {
            updateCourse(state.course)
                .then((response) => {
                    props.handleDialog();
                    props.onCourseUpdated(response);
                    setIsLoading(false);
                })
                .catch((error) => console.log(error));
        } else {
            createCourse(state.course)
                .then((response) => {
                    props.onCourseCreated(response);
                    setIsLoading(false);
                })
                .catch((error) => console.log(error));
        }
    };

    const onLogoClick = (event) => {
        let newState = {
            ...state,
            showCropper: true,
            avatarChosen: event.target.files[0],
        };
        setState(newState);
    };

    const logoPickerCallback = (file) => {
        const logo = `/course_logo/${encodeURIComponent(file.key)}`;
        setState({
            ...state,
            showCropper: false,
            avatarChosen: undefined,
            course: {
                ...state.course,
                logo,
            },
        });
    };

    const addSyllabus = (newSyllabus) => {
        if (!showInput) setShowInput(true);
        else {
            setState((prev) => ({
                ...prev,
                course: {
                    ...prev.course,
                    syllabus: [...prev.course.syllabus, newSyllabus],
                },
            }));

            setNewSyllabus({
                title: "",
                description: "",
                date: "",
            });
        }
    };

    const deleteSyllabus = () => {
        const { syllabus } = state.course;
        if (syllabus.length > 0) {
            syllabus.pop();
            setState((prev) => ({
                ...prev,
                course: {
                    ...prev.course,
                    syllabus: [...syllabus],
                },
            }));
        }
    };

    const setCourseArrayProps = (name, value) => {
        setState((prev) => {
            return {
                ...prev,
                course: {
                    ...prev.course,
                    [name]: value,
                },
            };
        });
    };

    const NAME_LIMIT = 25;
    const ABOUT_LIMIT = 100;
    const { error, course } = state;
    const { name, about, logo, price, prerequisites, materials, syllabus } =
        course;
    const { edit } = props;

    return (
        <form className="create-course" onSubmit={onButtonClick}>
            <h4 className="create-course-title">
                {edit ? "Edit Course" : "Create Course"}
            </h4>
            <Grid item className="first-row">
                <Grid item className="create-course-name">
                    <InputLabel className="create-course-label">
                        Course Name <span className="required-symbol">*</span>
                    </InputLabel>
                    <TextField
                        required
                        name="name"
                        onChange={handleChange}
                        placeholder="Insert Course Title"
                        inputProps={{
                            maxLength: NAME_LIMIT,
                        }}
                        value={name}
                        helperText={`${name.length}/${NAME_LIMIT}`}
                    />
                </Grid>
                <Grid item className="create-course-price">
                    <InputLabel className="create-course-label">
                        Course Price <span className="required-symbol">*</span>
                    </InputLabel>
                    <CurrencyTextField
                        required
                        name="price"
                        variant="standard"
                        value={price}
                        modifyValueOnWheel={false}
                        placeholder="123.456,00"
                        currencySymbol="Rp"
                        outputFormat="number"
                        decimalCharacter=","
                        digitGroupSeparator="."
                        onChange={handlePrice}
                    />
                </Grid>
            </Grid>
            <Grid item className="create-course-logo">
                <InputLabel className="create-course-label">
                    Course Logo
                </InputLabel>
                {!!state.showCropper && (
                    <AvatarPicker
                        width={250}
                        height={250}
                        borderRadius={1}
                        callback={logoPickerCallback}
                        image={state.avatarChosen || state.course.logo}
                    />
                )}
                {!state.showCropper && (
                    <Grid item className="course-logo-management">
                        {state.course.logo && (
                            <Grid
                                container
                                className="selected-course-logo"
                                justify="center"
                            >
                                <img
                                    src={state.course.logo}
                                    alt="Course Logo"
                                    height="auto"
                                />
                            </Grid>
                        )}
                        <Grid item className="create-course-logo-choice">
                            <IconButton aria-label="default-logo-1">
                                <img src="images/personal-course.png" />
                            </IconButton>
                            <IconButton aria-label="default-logo-1">
                                <img src="images/personal-course.png" />
                            </IconButton>
                            <IconButton aria-label="default-logo-1">
                                <img src="images/personal-course.png" />
                            </IconButton>
                            <IconButton aria-label="default-logo-1">
                                <img src="images/personal-course.png" />
                            </IconButton>
                            <label htmlFor="courseLogo">
                                <input
                                    style={{ display: "none" }}
                                    id="courseLogo"
                                    type="file"
                                    name="files"
                                    onChange={onLogoClick}
                                />
                                <IconButton
                                    color="primary"
                                    size="small"
                                    component="span"
                                    aria-label="add"
                                    variant="outlined"
                                    className="add-course-logo-btn"
                                >
                                    <AddAPhoto />
                                </IconButton>
                            </label>
                        </Grid>
                    </Grid>
                )}
            </Grid>
            <Grid className="create-course-materials">
                <InputLabel className="create-course-label">
                    Course Materials
                </InputLabel>
                <TagsForm
                    name="materials"
                    items={materials}
                    setItems={setCourseArrayProps}
                    getItems={getTags}
                />
            </Grid>
            <Grid item className="create-course-logo">
                <InputLabel className="create-course-label">
                    Course Description
                    <span className="required-symbol">*</span>
                </InputLabel>
                <TextField
                    required
                    name="about"
                    onChange={handleChange}
                    placeholder="Insert Course Description"
                    inputProps={{
                        maxLength: ABOUT_LIMIT,
                    }}
                    value={about}
                    helperText={`${about.length}/${ABOUT_LIMIT}`}
                />
            </Grid>
            <Grid className="create-course-prerequisites">
                <InputLabel className="create-course-label">
                    Course Prerequisites
                </InputLabel>
                <TagsForm
                    name="prerequisites"
                    items={prerequisites}
                    setItems={setCourseArrayProps}
                    getItems={getTags}
                />
            </Grid>
            <Grid className="create-course-timeline">
                <InputLabel className="create-course-label">
                    Course Timeline
                </InputLabel>
                <Grid item className="create-course-timeline-container">
                    {syllabus.map((item, index) => (
                        <CourseSyllabus
                            key={index}
                            show={true}
                            newSyllabus={item}
                        />
                    ))}
                    {showInput && (
                        <CourseSyllabus
                            show={false}
                            newSyllabus={newSyllabus}
                            handleChange={handleSyllabus}
                            setNewSyllabus={setNewSyllabus}
                        />
                    )}
                    <Button
                        className="my-btn add-syllabus-btn"
                        onClick={() => addSyllabus(newSyllabus)}
                    >
                        Add Timeline
                    </Button>
                    <Button
                        className="my-btn delete-syllabus-btn"
                        onClick={deleteSyllabus}
                    >
                        Delete Previous
                    </Button>
                </Grid>
            </Grid>
            {edit ? (
                <Button
                    className="my-btn create-course-btn"
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    UPDATE{" "}
                    {isLoading ? (
                        <CircularProgress
                            thickness={6}
                            size="1.5rem"
                            className="circular-progress-bar white"
                        />
                    ) : (
                        <Update />
                    )}
                </Button>
            ) : (
                <Button
                    className="my-btn create-course-btn"
                    variant="contained"
                    type="submit"
                    color="primary"
                >
                    CREATE{" "}
                    {isLoading ? (
                        <CircularProgress
                            thickness={6}
                            size="1.5rem"
                            className="circular-progress-bar"
                        />
                    ) : (
                        <Add />
                    )}
                </Button>
            )}
        </form>
    );
}
