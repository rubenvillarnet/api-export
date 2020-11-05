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
    width: '180px'
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
  const dispatch = useDispatchAuth();
  const classes = useStyles();
  const [devs, setDevs] = useState(undefined);
  const [isloading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('register_date');
  const [sort, setSort] = useState('desc');
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
    if (token) {
      const sortString = `${sort === 'desc' ? '-' : ''}${sortBy}`;
      console.log(page);
      console.log(sortString);
      const devsData = await devService.getDevs({
        page,
        limit,
        sortString,
        token
      });
      const { docs, total } = devsData.data;
      setDevs({
        items: docs.map(
          ({
            _id,
            devid,
            users,
            nodes,
            serialid,
            firmware,
            pending,
            register_date: registerDate,
            comment
          }) => ({
            _id,
            devid,
            users: setUsers(users),
            nodes: setNodes(nodes),
            serial: setSerialId(serialid),
            firmware: setFirmware(firmware),
            pending: setRegistration(pending),
            registerDate: setDate(registerDate),
            comment
          })
        ),
        total
      });
      console.log(docs);
      setLoading(false);
    }
  }, [page, limit, sort, sortBy, token]);

  const handleLogout = () => dispatch({ type: 'LOGOUT' });

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (id) => {
    const isDesc = sortBy === id && sort === 'desc';
    setSortBy(id);
    setSort(isDesc ? 'asc' : 'desc');
    setPage(0);
  };

  const paginate = () => (
    <TablePagination
      component='div'
      rowsPerPageOptions={[5, 10, 25, 100]}
      count={devs?.total || 0}
      rowsPerPage={limit}
      page={page}
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
                        direction={sort}
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
