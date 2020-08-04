import {Paper, IconButton, InputBase, Button, withStyles} from '@material-ui/core';
import {FilterList} from '@material-ui/icons';

const styles = (theme) => ({
    input: {flex: 1}
})

class PostFilter extends React.Component{
    constructor(props){
        super(props)
        this.state = {query: this.props.query}
    }


    onQueryChange = (e) => {
        let {query} = this.state;
        if(e.target.name == "content"){
            query.content=e.target.value;
        }
        if(e.target.name == "category"){
            let categoryId = parseInt(e.target.value);
            let index = query.category.indexOf(categoryId)
            if(index == -1){
                query.category.push(categoryId)
            }else query.category.splice(index,1)
        }
        this.props.onSearchQueryChange(query)
    }

    render(){
        const {classes, query} = this.props;

        return(
            <Paper elevation={3} style={{height: '5em', display: 'flex', alignItems: 'center', marginTop: 20}}>
                <IconButton className={classes.iconButton} aria-label="menu">
                    <FilterList />
                </IconButton>
                <InputBase
                    className={classes.input}
                    placeholder="Cari Apa?"
                    name="content"
                    onChange={this.onQueryChange}
                />
                <Button size="small" variant="contained" color="primary" style={{margin: '0px 20px'}}>
                    Search
                </Button>
            </Paper>
        )
    }
}

export default withStyles(styles)(PostFilter);