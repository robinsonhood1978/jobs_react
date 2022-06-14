import { useParams } from 'react-router-dom';
// material
import {
  Grid,
  Container,
  Typography,
} from '@mui/material';
// components
import Page from '../components/Page';
import { JobEditForm } from '../sections/@dashboard/jobEdit';



export default function User() {
    const {id} = useParams();
    // console.log(id);

  return (

    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Job Details
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} md={12} lg={12}>
            <JobEditForm id={id}/>
          </Grid>

        </Grid>
      </Container>
    </Page>

    
  );
}
