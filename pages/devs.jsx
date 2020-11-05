import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Skeleton from '@material-ui/lab/Skeleton';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { format } from 'date-fns';

import { useAuth, useDispatchAuth } from '../components/AuthStore';
import DevService from '../services/Devs';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1
  }
}));

const columns = [
  {
    id: 'devid',
    label: 'Identifier',
    width: '200px'
  },
  {
    id: 'users',
    label: 'Users',
    width: '300px'
  },
  {
    id: 'nodes',
    label: 'Nodes',
    width: '50px'
  },
  {
    id: 'serialid',
    label: 'Serial',
    width: '50px'
  },
  {
    id: 'firmware',
    label: 'FW',
    width: '50px'
  },
  {
    id: 'pending',
    label: 'Registration',
    width: '50px'
  },
  {
    id: 'register_date',
    label: 'Date',
    sort: true,
    width: '150px'
  },
  {
    id: 'comment',
    label: 'Comment',
    width: '300px'
  }
];

export default function Index() {
  const { token } = useAuth();
  const router = useRouter();
  const { page = 1, limit = 10, sort = '-register_date' } = router.query;
  const direction = sort[0] === '-' ? 'desc' : 'asc';
  const sortItem = sort[0] === '-' ? sort.substring(1) : sort;
  const dispatch = useDispatchAuth();
  const classes = useStyles();
  const [devs, setDevs] = useState(undefined);
  const [isloading, setLoading] = useState(true);
  const devService = new DevService();

  const setUsers = (users) =>
    users.length > 0 ? users.map((user) => user.email).join(', ') : '-';
  const setFirmware = (fw) => (fw ? `${fw?.major}.${fw?.minor}` : '-');
  const setNodes = (nodes) => nodes.length;
  const setSerialId = (serial) => serial;
  const setRegistration = (pending) => (pending ? 'Pending' : 'Confirmed');
  const setDate = (date) => format(new Date(date), 'dd/MM/yyyy HH:mm');

  useEffect(async () => {
    setLoading(true);
    console.log(sort);
    if (token) {
      const devsData = await devService.getDevs({
        ...router.query,
        token
      });
      const { docs, total } = devsData.data;
      setDevs({
        items: docs.map((doc) => ({
          _id: doc._id,
          devid: doc.devid,
          users: setUsers(doc.users),
          nodes: setNodes(doc.nodes),
          serial: setSerialId(doc.serialid),
          firmware: setFirmware(doc.firmware),
          pending: setRegistration(doc.pending),
          registerDate: setDate(doc.register_date),
          comment: doc.comment
        })),
        total
      });
      setLoading(false);
    }
  }, [router.query]);

  const handleLogout = () => dispatch({ type: 'LOGOUT' });
  const handleRouterUpdate = (value) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...value
      }
    });
  };

  const handleChangeRowsPerPage = (event) => {
    handleRouterUpdate({ page: 1, limit: parseInt(event.target.value, 10) });
  };

  const handleChangePage = (event, newPage) => {
    handleRouterUpdate({ page: newPage + 1 });
  };

  const handleSort = (id) => {
    const isDesc = sortItem === id && direction === 'desc';
    console.log(id, isDesc);
    handleRouterUpdate({
      page: 1,
      sort: `${isDesc ? '' : '-'}${id}`
    });
  };

  const paginate = () => (
    <TablePagination
      component='div'
      rowsPerPageOptions={[5, 10, 25, 100]}
      count={devs?.total || 0}
      rowsPerPage={limit}
      page={page - 1}
      labelRowsPerPage='Devs per page'
      nextIconButtonText='Previous page'
      backIconButtonText='Next Page'
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onChangePage={handleChangePage}
    />
  );

  const cell = (content) => {
    return isloading ? <Skeleton /> : content;
  };

  return (
    <Container maxWidth='lg'>
      <AppBar>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Devs
          </Typography>
          <Button color='inherit' onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box my={12}>
        {paginate()}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    {column.sort ? (
                      <TableSortLabel
                        active
                        direction={direction}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {devs?.items.map(
                ({
                  devid,
                  users,
                  nodes,
                  serial,
                  firmware,
                  pending,
                  registerDate,
                  comment,
                  _id
                }) => (
                  <TableRow hover key={devid}>
                    <TableCell>
                      <a
                        href={`https://control.termoweb.net/admin_panel/#devs/${_id}`}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {cell(devid)}
                      </a>
                    </TableCell>
                    <TableCell>{cell(users)}</TableCell>
                    <TableCell>{cell(nodes)}</TableCell>
                    <TableCell>{cell(serial)}</TableCell>
                    <TableCell>{cell(firmware)}</TableCell>
                    <TableCell>{cell(pending)}</TableCell>
                    <TableCell>{cell(registerDate)}</TableCell>
                    <TableCell>{cell(comment)}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {paginate()}
      </Box>
    </Container>
  );
}
