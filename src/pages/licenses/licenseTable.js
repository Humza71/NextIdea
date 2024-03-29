import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import {
  Grid,
  IconButton,
  Button,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar as MuiToolbar,
  Menu,
  MenuItem,
  Typography as MuiTypography,
  Dialog as MuiDialog,
  AppBar,
  Tabs as MuiTabs,
  Tab,
  Modal,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import {
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
  ViewHeadline as ViewHeadlineIcon,
} from "@material-ui/icons";

import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { spacing } from "@material-ui/system";

import SearchInput from "components/SearchInput";
import AdvancedSelect from "components/AdvancedSelect";
import LicenseInfo from "./licenseInfo";
import UserInfo from "./userInfo";
import CompanyInfo from "./companyInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  LoadingStates,
  clearLicense,
  getLicenseById,
  deleteLicenseById,
} from "redux/reducers/licenseReducer";
import {
  getAllClinic,
  getCompanyById,
  clearClinic,
} from "redux/reducers/clientReducer";

const Paper = styled(MuiPaper)(spacing);
const Toolbar = styled(MuiToolbar)(spacing);

const Typography = styled(MuiTypography)`
  margin-left: 10px;
`;

const Tabs = styled(MuiTabs)`
  .MuiTab-textColorInherit.Mui-selected {
    background-color: #f5faff;
    color: #09539e;
    img {
    }
  }
`;

const Dialog = styled(MuiDialog)`
  .MuiDialog-paperWidthSm {
    padding: 30px;
  }
`;

const Icon = styled.img`
  padding-left: 5px;
  padding-right: 4px;
  margin-left: 8px;
  width: 20px;
`;
const ActionIcon = styled.img`
  width: 17px;
  margin-left: 5px;
  cursor: pointer;
`;

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: 500,
    overflow: "auto",
  },
  columnsSelect: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  tabsRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    backgroundColor: "white",
    color: "#5f6368",
    paddingTop: "5px",
  },
}));

const SmallAdvancedSelect = styled(AdvancedSelect)`
  height: 36px;
  width: 120px;
`;

let TableToolbar = (props) => {
  const {
    data,
    columns,
    rowsPerPage,
    page,
    filteredColumns,
    // filteredClinics,
    searchString,
    tableFormat,
    setFilteredColumns,
    // setFilteredClinics,
    setSearchString,
    setTableFormat,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;

  const handleColumnFilterChange = (event) => {
    setFilteredColumns(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchString(event.target.value);
  };
  const handleTableFormatChange = (event, newFormat) => {
    setTableFormat(newFormat);
  };

  const FilterIcon = () => {
    return (
      <Grid container alignItems="center">
        <FilterListIcon />
        <span>Filter</span>
      </Grid>
    );
  };

  return (
    <Toolbar p={0} mb={2}>
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <SearchInput
            placeholder="Search for a License"
            value={searchString}
            onChange={handleSearchChange}
            grayBackground={true}
          />
        </Grid>

        <Grid item>
          <SmallAdvancedSelect
            disabled
            value={filteredColumns}
            onChange={handleColumnFilterChange}
            name="columns"
            label="Columns"
            options={columns
              .filter((item) => item.id !== "actions")
              .map((item) => ({
                label: item.label,
                value: item.label,
              }))}
            variant="outlined"
            renderValue={() => "Columns"}
            multiple
          />
        </Grid>

        <Grid item>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
        <Grid item>
          <SmallAdvancedSelect
            disabled
            value={filteredColumns}
            onChange={handleColumnFilterChange}
            name="filter"
            label="Filter"
            options={columns
              .filter((item) => item.id !== "actions")
              .map((item) => ({
                label: item.label,
                value: item.label,
              }))}
            variant="outlined"
            renderValue={() => <FilterIcon />}
            multiple
          />
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            size="small"
            value={tableFormat}
            exclusive
            onChange={handleTableFormatChange}
          >
            <ToggleButton value="padding">
              <MenuIcon />
            </ToggleButton>
            <ToggleButton value="noPadding">
              <ViewHeadlineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

const ReportTableHead = (props) => {
  const { columns, filteredColumns, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(
          (headCell) =>
            (filteredColumns.indexOf(headCell.label) !== -1 ||
              headCell.id === "actions") && (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "default"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
};

const LicenseTable = (props) => {
  const { data, columns, openModal, setOpenModal } = props;
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("date");
  const [tableFormat, setTableFormat] = React.useState("padding");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchString, setSearchString] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [clinicSelected, setClinicSelected] = React.useState(false);
  const [editForAdmin, setEditForAdmin] = React.useState(true);
  const classes = useStyles();

  const licenseInfo = useSelector((state) => {
    return state.licenseReducer.license;
  });
  const userInfo = useSelector((state) => {
    return state.licenseReducer.userInfo;
  });

  const user = useSelector((state) => {
    return state.authReducer.user;
  });
  const allClinics = useSelector((state) => state.clientReducer.allClinics);
  const licenseCreating = useSelector((state) => state.licenseReducer.loading);

  const [filteredColumns, setFilteredColumns] = React.useState(
    columns.filter((item) => item.id !== "actions").map((item) => item.label)
  );
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleOpen = (id) => {
    setOpen(true);
    if (user.role === "super_admin") {
      setEditForAdmin(false);
      setClinicSelected(false);
    }
    dispatch(getLicenseById(id));
  };

  const handleCloseDialogue = () => {
    setOpen(false);
    setValue(0);
    setOpenModal(false);
    if (user.role === "super_admin") {
      setEditForAdmin(true);
      setClinicSelected(false);
      dispatch(clearClinic());
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleTabsChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClinicAddition = (clinicId) => {
    dispatch(getCompanyById(clinicId));
  };

  React.useEffect(() => {
    if (open === false) {
      if (openModal === true) {
        setOpenModal(false);
      }
      if (
        Object.keys(licenseInfo).length !== 0 ||
        Object.keys(userInfo).length !== 0
      ) {
        dispatch(clearLicense());
      }
    }
  }, [open, dispatch, openModal, setOpenModal, licenseInfo, userInfo]);

  React.useEffect(() => {
    if (openModal === true) {
      setOpen(true);
    }
  }, [openModal]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  React.useEffect(() => {
    const { role = "" } = user || {};

    if (role === "super_admin") {
      dispatch(getAllClinic());
    }
  }, [dispatch, user]);

  const Actions = ({ id }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDelete, setOpenDelete] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleDeleteOpen = () => {
      setOpenDelete(true);
    };

    const handleDeleteDialogue = () => {
      setOpenDelete(false);
    };

    const DeleteBody = (
      <Dialog
        open={openDelete}
        onClose={handleDeleteDialogue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete License"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this License?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() =>
              dispatch(deleteLicenseById(id, handleDeleteDialogue))
            }
            autoFocus
          >
            Confirm
          </Button>
          <Button color="primary" onClick={handleDeleteDialogue}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <>
        <Modal
          open={openDelete}
          onClose={handleDeleteDialogue}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {DeleteBody}
        </Modal>
        <MoreVertIcon onClick={handleClick} />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem>
            <Typography color="primary" variant="inherit">
              ACTIONS
            </Typography>
          </MenuItem>

          <MenuItem>
            <DeleteIcon color="primary" />

            <Typography
              variant="inherit"
              onClick={() => {
                handleDeleteOpen();
              }}
            >
              Delete
            </Typography>
          </MenuItem>
        </Menu>
      </>
    );
  };

  const ModalTabs = ({ imgSrc, title }) => {
    return (
      <Grid container alignItems="center">
        <Icon src={"/static/img/" + imgSrc} />
        <span>{title}</span>
      </Grid>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialogue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Typography variant="h4" color="action" gutterBottom>
          View or Edit License
        </Typography>
        <div className={classes.tabsRoot}>
          <AppBar position="static">
            <Tabs
              className={classes.root}
              value={value}
              onChange={handleTabsChange}
              aria-label="simple tabs example"
            >
              <Tab
                disabled
                label={
                  <ModalTabs
                    imgSrc={
                      value === 0 ? "licenseInfoActive.png" : "licenseInfo.png"
                    }
                    title={"License Info"}
                  />
                }
                {...a11yProps(0)}
              />
              <Tab
                disabled
                label={
                  <ModalTabs
                    imgSrc={value === 1 ? "userInfoActive.png" : "userInfo.png"}
                    title={"User Info"}
                  />
                }
                {...a11yProps(1)}
              />
              <Tab
                disabled
                label={
                  <ModalTabs
                    imgSrc={
                      value === 2 ? "companyInfoActive.png" : "companyInfo.png"
                    }
                    title={"Company Info"}
                  />
                }
                {...a11yProps(2)}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <LicenseInfo value={value} setValue={setValue} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UserInfo value={value} setValue={setValue} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            {user.role === "super_admin" && editForAdmin === true ? (
              <Grid container spacing={12}>
                <AdvancedSelect
                  onChange={(e) => {
                    handleClinicAddition(e.target.value);
                    setClinicSelected(true);
                  }}
                  // renderValue={() => "Columns"}
                  name="clinics"
                  label="Clinics"
                  options={allClinics.map((item, index) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                />
              </Grid>
            ) : (
              <CompanyInfo
                setOpen={setOpen}
                value={value}
                setValue={setValue}
              />
            )}
            {clinicSelected === true && (
              <CompanyInfo
                setClinicSelected={setClinicSelected}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
              />
            )}
          </TabPanel>
        </div>
      </Dialog>
      {licenseCreating === LoadingStates.LICENSE_CREATION_LOADING ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableToolbar
            data={data}
            columns={columns}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            filteredColumns={filteredColumns}
            searchString={searchString}
            tableFormat={tableFormat}
            setFilteredColumns={setFilteredColumns}
            setSearchString={setSearchString}
            setTableFormat={setTableFormat}
          />

          <TableContainer className={classes.container}>
            <Table
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="reports table"
              stickyHeader
            >
              <ReportTableHead
                columns={columns}
                filteredColumns={filteredColumns}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {data.map((row, index) => {
                  const labelId = `report-table-${index}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={labelId}>
                      {columns.map(
                        (headCell) =>
                          filteredColumns.indexOf(headCell.label) !== -1 &&
                          headCell.id !== "actions" && (
                            <TableCell align="left" key={headCell.id}>
                              {row[headCell.id]}
                            </TableCell>
                          )
                      )}
                      <TableCell align="left">
                        <Grid
                          container
                          alignItems="center"
                          justify="space-between"
                        >
                          <Grid Item>
                            <ActionIcon
                              onClick={() => handleOpen(row.licenseId)}
                              src={"./static/img/Edit.png"}
                            />
                          </Grid>
                          <Grid Item>
                            <IconButton aria-label="actions">
                              <Actions id={row.licenseId} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
};

export default LicenseTable;
