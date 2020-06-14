import NavBar from "../../components/NavBar.js";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardActions, CardContent } from "@material-ui/core";
import {
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  page: {
    display: "flex",
  },
  sideBar: {
    width: 200,
    padding: 40,
  },
  content: {
    padding: 40,
  },
  questionTypeContent: {
    flex: "1 0 auto",
    padding: 40,
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  questionTypeButton: {
    marginRight: 10,
  },
}));

const three = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.page}>
        <div className={classes.sideBar}>
          <div>Question Type:</div>
        </div>
        <div className={classes.questionTypeContent}>
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            color="primary"
          >
            All Math
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Multiple Choice
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Multiple Answer
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Numeric Entry
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Quantitaive Comparison
          </Button>
        </div>
      </div>
      {/* <div className={classes.page}>
        <div className={classes.sideBar}>
          <div>Subjects: </div>
        </div>
        <div className={classes.content}>
          <input type="checkbox" name="vehicle1" value="Bike">
          </input>
          <label for="vehicle1"> I have a bike</label>
          <input type="checkbox" name="vehicle1" value="Bike">
          </input>
          <label for="vehicle1"> I have a bike</label>
          <input type="checkbox" name="vehicle1" value="Bike">
          </input>
          <label for="vehicle1"> I have a bike</label>
          <input type="checkbox" name="vehicle1" value="Bike">
          </input>
          <label for="vehicle1"> I have a bike</label>
        </div>
      </div> */}
      <div className={classes.page}>
        <div className={classes.sideBar}>
          <div>Difficulty:</div>
        </div>
        <div className={classes.questionTypeContent}>
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            color="primary"
          >
            Adaptive
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Easy
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Medium
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Hard
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Very Hard
          </Button>
        </div>
      </div>
      <div className={classes.page}>
        <div className={classes.sideBar}>
          <div>Question Pool:</div>
        </div>
        <div className={classes.questionTypeContent}>
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            color="primary"
          >
            Unanswered
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Answered and Unanswered
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Incorrect
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Flagged
          </Button>
        </div>
      </div>
      <div className={classes.page}>
        <div className={classes.sideBar}>
          <div>Number Of Questions:</div>
        </div>
        <div className={classes.questionTypeContent}>
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            color="primary"
          >
            5
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            10
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            20
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Unlimited
          </Button>
        </div>
      </div>
      <div className={classes.page}>
        <div className={classes.sideBar}>
          <div>Time Limit:</div>
        </div>
        <div className={classes.questionTypeContent}>
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            color="primary"
          >
            10
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            15
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            20
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            30
          </Button>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Unlimited
          </Button>
        </div>
      </div>
    </div>
  );
};

export default three;
