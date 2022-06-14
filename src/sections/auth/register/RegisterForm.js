import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import Iconify from '../../../components/Iconify';
import {register} from '../../../api/user';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [reg, setReg] = useState(false);

  const handleClose = () => {
    setOpen(false);    
    if(reg){
      navigate('/login', { replace: true });
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      console.log(values);
      const {email,password,firstName,lastName} = values;
      const pass = Base64.stringify(sha256(password));
      
      register({ password:pass, email, first_name:firstName, last_name:lastName }).then(data => {
          console.log(data);
          setSubmitting(false);
          if (data.status === 200 && data.data.success) {
            setReg(true);
            setMsg("Registration Success");
            setOpen(true);
          }
          else {
            setMsg(data.data.message);
            setOpen(true);
            
          }
      }).catch(e => {
          setMsg(email);
          setOpen(true);
      })
      // navigate('/dashboard', { replace: true });
    },
  });

  const { errors, touched, values, handleSubmit, isSubmitting, setSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
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
