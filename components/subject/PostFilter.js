import {List, ListItem, ListItemIcon, Checkbox, ListItemSecondaryAction, 
    ListItemText, Paper, IconButton, InputBase
} from '@material-ui/core';
import {AnnouncementOutlined, AssessmentOutlined, ClassOutlined, Search} from '@material-ui/icons';

const PostFilter = (props) => {
    const [query, setQuery] = React.useState({content: "",category: [],page: 1})

    const onQueryChange = (e) => {
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
        setQuery({...query})
        props.onSearchQueryChange(query)
    }

    const filters = [
        {id: 1, name: 'Berita',icon: <AnnouncementOutlined />},
        {id: 2, name: 'Materi', icon: <ClassOutlined />},
        {id: 3, name: 'Ujian', icon: <AssessmentOutlined />}
    ]
    return(
        <div>
            <Paper elevation={3} component="form">
                <IconButton type="submit" aria-label="search">
                    <Search />
                </IconButton>
                <InputBase
                    placeholder="Search....."
                    inputProps={{ 'aria-label': 'search google maps' }}
                    onChange={onQueryChange}
                    name="content"
                />
            </Paper>
            <List>
                {filters.map((value) => {
                const labelId = `checkbox-list-label-${value.id}`;
        
                return (
                    <ListItem key={value.id} role={undefined} dense>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={query.category.indexOf(value.id) !== -1}
                                tabIndex={-1}
                                disableRipple
                                value={value.id}
                                name="category"
                                onClick={onQueryChange}
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={value.name} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="comments">
                            {value.icon}    
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
                })}
            </List>
        </div>
    )
}
export default PostFilter;