import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Grid, Stack, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Select from 'react-select'
import {getjob, updateJob, newNote} from '../../../api/user';
import { NoteList } from '../noteList';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function JobEditForm(props) {
  // eslint-disable-next-line react/prop-types
  const {id} = props;
  // console.log(id);

  const navigate = useNavigate();

  const [counter, setCounter] = useState(0);
  const [open, setOpen] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [msg, setMsg] = useState('');
  const [reg, setReg] = useState(false);
  const [job, setJob] = useState({});
  const [note, setNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({ value: "Active", label: "Active" });

  useEffect(() => {
    const fetchData = async () => {
      // jobs().then(data => {
      
      // });
      const result = await getjob(id);
      // console.log(result);
      if(result.status === 200 ){
        const job = result.data.data
        setJob(job);
        setSelectedStatus({ value: job.status, label: job.status });
      }
      // console.log(result);
      // setUserList(result.data);
    };

    fetchData();
  }, [id]);

  const handleClose = () => {
    setOpen(false);    
    if(reg){
      navigate('/dashboard/jobs', { replace: true });
    }
  };

  const handleNoteClose = () => {
    setOpenNote(false);    
  };

  const handleOpen = () => {
    setOpen(true);    
  };

  const handleNoteOpen = () => {
    setOpenNote(true);    
  };

  const handleNoteAdd = () => {
    console.log(note);
    newNote({ job_id:id, content: note}).then(data => {
        console.log(data);
        if (data.status === 200 && data.data.success) {
          setMsg(data.data.message);
          setCounter(counter+1);
        }
        else {
          setMsg(data.data.message);
        }
        setOpenNote(false); 
        setOpen(true);
    }).catch(e => {
        setMsg('Failed');
        setOpenNote(false); 
        setOpen(true);
    })
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleStatusChange = (selectedStatus, values) => {
    values.status = selectedStatus.value;
    console.log(selectedStatus);
    console.log(values);
    setSelectedStatus(selectedStatus);
  };

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Invoicing", label: "Invoicing" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "To priced", label: "To priced" }
  ];

  const RegisterSchema = Yup.object().shape({
    status: Yup.string().required("Select Status")
  });

  const formik = useFormik({
    initialValues: {
      status: job.status
    },
    validationSchema: RegisterSchema,
    // onSubmit: () => {
    //   navigate('/dashboard', { replace: true });
    // },
    onSubmit: () => {
      console.log(values);
      const {status} = values;
      console.log('job:',job);
      
      updateJob(id, { job_id:job.job_id, name: job.name, mobile: job.mobile, status }).then(data => {
          console.log(data);
          setSubmitting(false);
          if (data.status === 200 && data.data.success) {
            setReg(true);
            setMsg(data.data.message);
            setOpen(true);
          }
          else {
            setMsg(data.data.message);
            setOpen(true);
            
          }
      }).catch(e => {
          setMsg('Failed');
          setOpen(true);
      })
      // navigate('/dashboard/jobs', { replace: true });
    },
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, handleChange, setSubmitting } = formik;

  

  return (
    <Grid item xs={12} md={12} lg={12}>
    <Grid item xs={12} md={6} lg={6}>
           
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          Job Identifier: {job.job_id}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          Name: {job.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
           Mobile:  {job.mobile}
            </Typography>
          

          


          <Select
                  placeholder="Status"
                  value={selectedStatus}
                  // defaultValue={{ value: job.status, label: job.status }}
                  onChange={selectedOption => {
                    handleStatusChange(selectedOption, values);
                    console.log("values", values.status);
                    handleChange("status");
                  }}
                  isSearchable
                  options={statusOptions}
                  name="status"
                />
                <font color='#FF4842'>{errors.status}</font>


          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Submit
          </LoadingButton>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='md'
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"System Information"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {msg}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openNote} onClose={handleNoteClose} maxWidth='md'>
            <DialogTitle>New Note</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add new note to this job, please enter your note here.
              </DialogContentText>
              <TextField
                id="outlined-multiline-static"
                fullWidth
                // label="Multiline"
                multiline
                rows={4}
                value={note}
                onChange={handleNoteChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNoteClose}>Cancel</Button>
              <Button onClick={handleNoteAdd}>Submit</Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Form>
    </FormikProvider>
    </Grid>
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Notes
        </Typography>
        <Button variant="contained" onClick={handleNoteOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
          New Note
        </Button>
      </Stack>
    <NoteList jobId={id} counter={counter} />
    </Grid>
          
    
  );
}
