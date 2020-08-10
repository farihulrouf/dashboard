import {Grid, ButtonGroup, Button, Paper, Divider, createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import {getTeachers, updateTeacherApplication} from "../../lib/api";
import { red } from '@material-ui/core/colors';


const redTheme = createMuiTheme({ palette: { primary: red } })

const Teacher = (props) => {
  const {_id, status} = props;
  const {name, avatar} = props.teacher;

  return(
    <Paper style={{width: 200}} elevation={3}>
        <Grid container>
            <img src={avatar} width="200" height="200" style={{padding: 10}} />
        </Grid>
        <Divider />
            <Grid container justify="center"><b>{name}</b></Grid>
        <Divider />
        <Grid justify="space-evenly" container style={{padding: 10}}>
          {status === "pending" && 
            <React.Fragment>
              <MuiThemeProvider theme={redTheme}>
                <Button name="reject" variant="outlined" value={_id} color="primary" onClick={props.onButtonClick}>Reject</Button>
              </MuiThemeProvider>
              <Button name="accept" variant="outlined" value={_id} color="primary" onClick={props.onButtonClick}>Accept</Button>
            </React.Fragment>
          }
          {status === "joined" &&
            <Button variant="contained" disabled>Joined</Button>
          }
        </Grid>
    </Paper>
  )
}

export default class MyTeachers extends React.Component{
    constructor(props){
        super(props);
        this.state={value: "", applications: []};
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    componentDidMount(){
      getTeachers().then((res) => this.setState({applications: res.applications}))
    }

    onButtonClick(event){
      const {name, value} = event.currentTarget;
      if(name === "accept"){
        updateTeacherApplication(value, "accept").then((res)=>this.setState({applications: res.applications}))
      }else if(name === "reject"){
        updateTeacherApplication(value, "reject").then((res)=>this.setState({applications: res.applications}))
      }
    }

    render(){
        const {searchValue, applications} = this.state;

        return(
        <Grid container>
            <Grid container>
              <h1>My Teachers</h1>
            </Grid>
            <Grid container style={{marginBottom: 20}} spacing={2}>
                <Grid item xs={12}>
                  <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button variant="contained">All</Button>
                    <Button>Accepted</Button>
                    <Button>Pending</Button>
                  </ButtonGroup>
                </Grid>
            </Grid>
            <Grid container style={{marginBottom: 50}}>
              <SearchBar
                value={searchValue}
                onChange={(value) => this.setState({searchValue: value})}
                onRequestSearch={() => alert("Search")}
                style={{
                  margin: '0 auto',
                  maxWidth: 800,
                  borderRadius: 100
                }}
              />
            </Grid>
            <Grid container justify="space-evenly" spacing={2}>
              {applications.map(
                (app)=>(!!app.teacher && <Grid key={app._id} item><Teacher {...app} onButtonClick={this.onButtonClick} /></Grid>)
              )}
            </Grid>
          </Grid>
        )
    }
}