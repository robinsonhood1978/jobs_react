// material
import {
  Grid,
  Container,
  Typography,
} from '@mui/material';
// components
import Page from '../components/Page';
import { JobForm } from '../sections/@dashboard/newjob';


export default function User() {

  return (

    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add a New Job
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={4}>
            <JobForm />
          </Grid>

        </Grid>
      </Container>
    </Page>

    
  );
}
