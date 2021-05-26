import React from "react";
import { Dialog, DialogContent, DialogTitle, Slide } from "@material-ui/core";
import SyllabusItem from "./SyllabusItem";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SyllabusDialog(props) {
    const { open, handleClose, course } = props;
    const syllabus = course.syllabus || [];

    return (
        <Dialog
            maxWidth={false}
            className="syllabus-dialog"
            open={open}
            scroll="paper"
            TransitionComponent={Transition}
            keepMounted
            onClose={() => handleClose("showSyllabus")}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>
                Syllabus
            </DialogTitle>
            {syllabus.length > 0 ? (
                <DialogContent className="syllabus">
                    {syllabus.map((item, index) => {
                        if (index < syllabus.length - 1) {
                            return (
                                <SyllabusItem
                                    key={index}
                                    item={item}
                                />
                            );
                        } else {
                            return (
                                <SyllabusItem
                                    key={index}
                                    item={item}
                                    last
                                />
                            );
                        }
                            
                    })}
                </DialogContent>
            ) : (
                <DialogContent className="no-syllabus-yet">
                    This course doesn't have any syllabus yet!
                </DialogContent>
            )}
        </Dialog>
    );
}
