import {Grid, ButtonGroup, Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";

export default class MyTeachers extends React.Component{
    constructor(props){
        super(props);
        this.state={value: ""};
    }

    render(){
        const {searchValue} = this.state;
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
            <Grid container justify="space-evenly" spacing={2}>
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
          </Grid>
        )
    }
}