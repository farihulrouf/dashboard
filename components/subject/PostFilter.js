import {Paper, IconButton, InputBase, Button, withStyles, Popper} from '@material-ui/core';
import {FilterList} from '@material-ui/icons';
import FilterDialog from './FilterDialog';

const styles = (theme) => ({
    input: {flex: 1}
})

class PostFilter extends React.Component{
    constructor(props){
        super(props)
        this.state = {query: this.props.query, showFilter: false}
        this.onQueryChange = this.onQueryChange.bind(this);
        this.onCloseFilter = this.onCloseFilter.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
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
        query.page = 1;
        this.props.onSearchQueryChange(query)
    }

    showFilter = () => {
        this.setState({showFilter: true})
    }

    onCloseFilter = () => {
        this.setState({showFilter: false})
    }

    onClearFilters = () => {
        const {query} = this.state;
        const newQuery = {content: query.content, category: [], page: 1};
        this.props.onSearchQueryChange(newQuery);
    }

    render(){
        const {classes, query} = this.props;
        const {showFilter} = this.state;

        return(
            <Paper elevation={3} style={{height: '5em', display: 'flex', alignItems: 'center', marginTop: 20}}>
                <IconButton onClick={this.showFilter} className={classes.iconButton} aria-label="menu">
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
                <FilterDialog 
                    open={showFilter}
                    query={query}
                    onClearFilters={this.onClearFilters}
                    onFilterChange={this.onQueryChange} 
                    onCloseFilter={this.onCloseFilter}
                />
            </Paper>
        )
    }
}

export default withStyles(styles)(PostFilter);