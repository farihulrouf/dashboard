import {Grid, makeStyles, InputBase, Paper, ButtonBase, Typography} from '@material-ui/core';
import {Search, AccountCircle} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    search: {
        justifyContent: 'center',
        display: 'flex',
        marginBottom: 20,
    },
    searchIcon: {
        alignSelf: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      width: 350,
      ['@media (max-width:400px)']: { 
        width: '90%'
      }
    },
    image: {
      width: 128,
      height: 128,
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
}));

function Module(props){
    const {name, description, total_problems, icon} = props.data;
    const classes = useStyles();
    return(
        <Paper className={classes.paper}>
            <Grid container spacing={2}>
            <Grid item>
                <ButtonBase className={classes.image}>
                <img className={classes.img} src={icon} alt="complex" />
                </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                    <Typography gutterBottom variant="subtitle1">
                    {name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                    {description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    {`total problems: ${total_problems}`}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    <a href = {`subject`} >practice</a>
                    </Typography>
                </Grid>
                </Grid>
                <Grid item>
                <Typography variant="subtitle1">$19.00</Typography>
                </Grid>
            </Grid>
            </Grid>
        </Paper>    
    )
}

const MaterialPage = () => {
    const classes = useStyles();
    const modules = [
        {id: 1, name:"Matematika", description: "Kumpulan soal matematika", total_problems: 100, icon: 'data:image/jpeg;base64,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'},
        {id: 2, name:"Biologi", description: "Kumpulan soal biologi", total_problems: 150, icon: 'https://lh3.googleusercontent.com/proxy/hz0MDtzwfzkWWVlWfqUGwbLMvOynH_PQ3SktyN2sPRsjO5kq_1r8YshHBwuh_aSfy0_r1AgfPMgr0aKqOZe5M1t0GGz8-xdfkyOixfVmTH3hsWG4aq0_StisQA7x2uBHTc8jP3o'},
        {id: 3, name: "Fisika", description: "Kumpulan soal fisika", total_problems: 200, icon: 'https://img2.pngdownload.id/20180512/bvq/kisspng-computer-icons-physics-chemistry-laboratory-5af7018a15f225.9814534715261372260899.jpg'},
        {id: 4, name: "Kimia", description: "Kumpulan soal kimia", total_problems: 200, icon: 'data:image/png;base64,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'},
        {id: 5, name: "IELTS", description: "Kumpulan soal ielts", total_problems: 200, icon: 'https://www.langabee.com/wp-content/uploads/2020/01/IELS-icon.jpg'},
        {id: 6, name: "GRE", description: "Kumpulan soal gre", total_problems: 200, icon: 'data:image/png;base64,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'},
        {id: 7, name: "GMAT", description: "Kumpulan soal gmat", total_problems: 200, icon: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDQ0NDQ0ODg0ODQ0NDQ0NDQ8NDQ0OFREWFhURFRUYHSggGBolGxUVITEhJSkrLi8uFx8zODMtNygtLisBCgoKDg0OFRAQGCsZIB8rLSsrKy0tLTcrLSstNy43LSsrNy0tLSstKzc3KzcrKysrKystKysrKystKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcBAwUECAL/xABJEAACAgECAgUGBw0FCQAAAAAAAQIDBAUREiEGBzFBcRMiMlFhgRQjU3KRodEVFzQ2QlVzgpKxs7TBJENilNIlJjM1UoOTsuH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAHhEBAQADAQACAwAAAAAAAAAAAAECAxESITEyQVH/2gAMAwEAAhEDEQA/ALxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMGTAAyAAAAAAAAAAAAAwZAAAAAAAAAAAAAAAAAAwZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAMmDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxuGcnWdVVC4Yrita327or1szleDpztjHnKUYr1tpHlerYy5O6H0kNvyLLXxWScm/W+S9xr38Tldv8AGvKdVZ9M/Rtg/ZxLc9G5Xmx1tH1G+Nka1vZFvZxfbFetMuO3v2XFLJ2KK3k0l620kavhdXytf7cftPJr34LZ4L96IbsXLZ5SRYNd0Zb8Moy27eFpn7IVoud5C1bvzJ7Rny7F3MmcZJ7NPdNbr2o1jl6R+mzR8Lq+Vr/bic/pBn+Sr4Iv4yfJP/pj3yIl7jOeziyJ/DJhJ7RnCT7doyTZtIj0ZX9p/Ul/QlxrHLs6UZ55Z1MW1K2tNdqc0mhn5CqqnY/yYt+L7iCzlxSlJ83J8T8WTPPySdTuvMqm+GNkJP1RkmzfuQDGudVkJr8mSfLv9aJ3VYpwjJdkoqS8Ghjn2FnH4+F1fKV++cUzPwur5Wv9uP2kFyPTn8+X7zX7jF2r5T74XV8rX+3H7THwyn5Wv9uP2kCPDrusYum1eVzLPJ7puFMUpZF3shDf63svaWbLTysmWfSubtr2Xa3ZFJfWLc6qDSnZXBy9FTnGLl4J9p8v6v01yNRy8euCdGL8IoSoi93L4yPOcu9+zsLM6ZaRmz1HykYTlW7IyajXK5ZFHxaVUPNahJbWJ8Tit3vv6usZW7F7rcyc/o/TbXh41d73tjTCNm74mpJdjfe12bnQKAAAAADVk2qFc5vsjFsgd10rJucvSb3ZNdYg5Y1ySbbg9klu2QiUGntJcLXdLzX9Zw2tYvXpmBLIm4rlFc5y9S9ntJLTo2PGO3k1L1uXNs8/ReCVDltzlN7+42dIcmdVcXXLhbns37i44yTp1qzNAqkvit4SXZz3j4G/RtMWPHeWztltxNdi9iI992Mr5V/Qh92Mn5V/USZY96cqSa/+C2eC/wDZEMJRlWynp3FJ7ylBNv8AWIuTb+lxNiS6FqkVVKFj2dUeLn3wOJbhtU13rdxk5KX+F7/15fQeVGJbitejNypXWSsl39i9S9RoNmNjytsjCPNt/Qu9jKrVdlkFzUZyjv4Ml+flY6PRn8J/7c/6EtREujT/ALSvmS/oSqySjFt9iTZ21/ixl9uB0oyvQpj86fh3L95wIQcpRilu5PZbG3NyHbbOx/lSey9ncjpdGsXjtlY1yguW6/Kf/wAOd7lkv04z716nsSjozlcdbqfbXtt81ngz9HtlfLycfMk+LifKK37TZXXRprV+XmU0qXmfGTjXGTfYk5Pm/A1hLKlvXUloeM224Pdtt+c+05+tYGDi49l9tkceuvhc7rJtQguJL379m3tJDCSaTXNPsZBuu/8AFzP+difzVR18ys9Vt0o61aq1KnR695NSTzr4vi8aq32eLO/1cdCNP1rTYajqULcjLutvVl0rpbyUbGl9SRQm59PdRH4v436bK/iyNSSfQ9FPVLoVcozjjTUoSjOL8rLk090TiMNuR+wUEAAAAAAAAzRbjwnynGMvFbm5nG6R9IatNrV+RXc6P7y2mp2qr1OSjz29pLOjpY+LCpNQjwpvfZdm5+M/BhkRUbN9k91s9uZH9P6xNEyNvJ6jQm+yM265fRJHeo1TFt2deRTPfs4bYy/qODlZvR+EYPyKk7OW3FLlt3nJs0nJj/dSfhzJpxJ8917jKafIxdcq9cW6uS09Q4XxqC83bn6RGpVT74yX6rLA5AmWvpK5Gj0KeGoTXKXGmn4kcy8OdVkq3FvbsaTaa7idJIbFuuWHXG6P4HkoeVkvPn2f4Y/acjM07Infa41Sadk2n2J8+0mD5EL1vrP0TCsnTblcVtc51zqqqnZKM4vZxey2XNC65Zw66WiaZdVcpzilHhku1N7nZzqXbXKClw8XJtLfl6iFdE+tDD1fP+A41F0firLfK2bRW0duW3b3ld9Pet7UY5uVi6fZVVjVWSphbGritnKL2lLil3b7rku41MZJwtXMtFxKY8dknwx5ydk+GCXtI7rPWboWmxdddqvmn/wcSKs872y7F9JRmg0ah0k1GnFycy+3jcpzssnKyNMEuclBvhXuLGXUFX+cp/8Agj9pZJDrg9Juu3PyOKGBVDDg1t5SSjbf7t+UStNR1PJyrHdk323WP8uybm14b9nuLpfUFXs/9pWb93xEftKY1nTp4eTkYtianRdOqW/fwtrf3rZlR9PdUnSL7paRjznLe+jfGv583KPoy98djV13/i5n/OxP5qoqbqF6Q/BNUeJZPanNrcUn3ZEecH71xL3otjruf+7mf44f81UB8sn0/wBRH/IMb9NlfxZHzAfT/UR+L+P+myv4sgLDAAAAAAAAAAA121RmnGUVKMk1KMkmmvU0zYAKz6S9TOlZspWY6lg2Pd7UJOlv9G+SXhsQ/wC8RnQl8VqdW3r8jZW/oUi/ABTujdTubVJO/XcqMVtvDElbU3+s5v8AcWdoWjQwq1XC3JufLisy8m7Jm2l65t8PgtjqADma/g3ZWNZTRk2Yls0uHIqSc6+afJe7b3kHs6utWkvO6UakvmuUH9UyywBx+jGlXYOJXj3Zd2bZBybyL5SlbPd7pNtt8vE65kAfmRUWt9SNeZl5WW9Rsg8nIuvcFRFqLnNy234u7ct8AVb0T6pHpORZk06jOVssa7Hg3RH4tzXp+lza2OJ94Gv852f5eP8AqLtAEB6u+ranQ7b7lkSybLoQrjKVar8lFNtpc+/dfQT1IyAMbFadN+qWjV82WasqWNKcIxsjGqM1OS38/m+3b9xZgApjF6ilTZXdVqtsbKpqyuSx4rhknun6RY3TDo791dOu0+dzr8t5HitUFJpwsjP0fbw/WSEAUn94Gr852f5eP+osroN0aWj4EMGNzuUJ2TVjjwN8cnLbbf2kiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q=='},
        {id: 8, name: "TOEFL", description: "Kumpulan soal toefl", total_problems: 200, icon: 'https://bccie.bc.ca/wp-content/uploads/2019/02/ETS-TOEFL-icon.png'},
        
    ]
    return(
        <React.Fragment>
        <div className={classes.search}>
            <div style={{display: 'flex', borderStyle: 'ridge', borderRadius: 50}}>
                <div className={classes.searchIcon}>
                    <Search style={{fontSize: 20}} />
                </div>
                <InputBase
                    placeholder="Cari Materi……"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onInput={(text)=> console.log(text.target.value)}
                />
            </div>
        </div>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={3}>
                    {modules.map((value) => (
                        <Grid key={value.id} item>
                            <Module data={value} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
        </React.Fragment>    
    )
}

export default MaterialPage;