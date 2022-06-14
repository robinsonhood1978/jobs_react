import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  TextField,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
// components
import { notes, getNote, updateNote } from '../../../api/user';
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../user';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: 'job_id', label: 'Job Identifier', alignRight: false },
//   { id: 'name', label: 'Job Name', alignRight: false },
//   { id: 'mobile', label: 'mobile', alignRight: false },
//   { id: 'status', label: 'Status', alignRight: false },
//   { id: '' },
// ];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Jobs(props) {
  // eslint-disable-next-line react/prop-types
  const {jobId, counter} = props; 
  // console.log(jobId);
  const navigate = useNavigate();

  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState({});
  const [content, setContent] = useState('');

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(100);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // jobs().then(data => {
      //   console.log(data);
      // });
      const result = await notes(jobId);
      if(result.status === 200){
        setUserList(result.data.data);
      }
      // console.log(result);
      // setUserList(result.data);
    };

    fetchData();
  }, [jobId,counter,count]);

  const handleRowClick = async (id) => {
    console.log(id);
    const result = await getNote(id);
    
    if(result.status === 200){
      console.log('result:',result.data.data);
      setNote(result.data.data);
      setContent(result.data.data.content);
      setOpenNote(true);   
      // setUserList(result.data.data);
    }
    // navigate(`/dashboard/jobview/${id}`, { replace: true });
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleNoteClose = () => {
    setOpenNote(false);    
  };

  const handleNoteUpdate = () => {
    console.log('update:', note);
    updateNote(note.id, { job_id:note.job_id, content, user_id: note.user_id}).then(data => {
        console.log(data);
        if (data.status === 200 && data.data.success) {
          setMsg(data.data.message);
          setCount(count+1);
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
    setContent(event.target.value);
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Note">
      <Container>
        <Card>
          
          <Scrollbar>
          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
           Click the row to edit note.
            </Typography>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, content } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={()=> handleRowClick(id)}
                        >
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <Typography variant="subtitle2" noWrap>
                                {id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{content}</TableCell>

                          <TableCell align="right">
                            <UserMoreMenu />
                          </TableCell>
                        </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

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
            <DialogTitle>Edit Note</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To edit note content to this job, please enter your note here.
              </DialogContentText>
              <TextField
                id="outlined-multiline-static"
                fullWidth
                // label="Multiline"
                multiline
                rows={4}
                value={content}
                onChange={handleNoteChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNoteClose}>Cancel</Button>
              <Button onClick={handleNoteUpdate}>Submit</Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>
    </Page>
  );
}
