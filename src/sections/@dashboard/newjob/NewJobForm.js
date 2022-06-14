import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Select from 'react-select'
import {newjob} from '../../../api/user';

// ----------------------------------------------------------------------

export default function NewJobForm() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [reg, setReg] = useState(false);

  const handleClose = () => {
    setOpen(false);    
    if(reg){
      navigate('/dashboard/jobs', { replace: true });
    }
  };

  const [selectedStatus, setSelectedStatus] = useState("");

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
    jobId: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Job identifier required'),
    jobName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Job name required'),
    contactMobile: Yup.string().required('contactMobile is required'),
    // status: Yup.string().oneOf(statuses, 'The status you chose does not exist'),
    status: Yup.string().required("Select Status")
  });

  const formik = useFormik({
    initialValues: {
      jobId: '',
      jobName: '',
      contactMobile: '',
      status: ''
    },
    validationSchema: RegisterSchema,
    // onSubmit: () => {
    //   navigate('/dashboard', { replace: true });
    // },
    onSubmit: () => {
      console.log(values);
      const {jobId,jobName,contactMobile,status} = values;
      
      newjob({ job_id:jobId, name: jobName, mobile: contactMobile, status }).then(data => {
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
      // navigate('/dashboard', { replace: true });
    },
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, handleChange, setSubmitting } = formik;

  

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Job Identifier"
              {...getFieldProps('jobId')}
              error={Boolean(touched.jobId && errors.jobId)}
              helperText={touched.jobId && errors.jobId}
            />

            
          </Stack>


          <TextField
            fullWidth
            autoComplete="Job Name"
            label="Job Name"
            {...getFieldProps('jobName')}
            error={Boolean(touched.jobName && errors.jobName)}
            helperText={touched.jobName && errors.jobName}
          />

          <TextField
            fullWidth
            autoComplete="Contact Mobile"
            label="Contact Mobile"
            {...getFieldProps('contactMobile')}
            error={Boolean(touched.contactMobile && errors.contactMobile)}
            helperText={touched.contactMobile && errors.contactMobile}
          />
          <Select
                  placeholder="Status"
                  value={selectedStatus}
                  onChange={selectedOption => {
                    handleStatusChange(selectedOption, values);
                    console.log("values", values.status);
                    handleChange("status")(selectedOption.value);
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
        </Stack>
      </Form>
    </FormikProvider>
  );
}
