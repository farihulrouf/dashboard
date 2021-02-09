import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const Breadcrumb = ({ courseName }) => {
  return (
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link href="/">
          Home
        </Link>
        <Link href="/">
          Course
        </Link>
        <Typography color="textPrimary">{courseName}</Typography>
      </Breadcrumbs>
  );
};

export default Breadcrumb;
