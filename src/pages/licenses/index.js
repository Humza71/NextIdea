import React from "react";
import styled from "styled-components/macro";
import Helmet from "react-helmet";
import {
  Grid as MuiGrid,
  Typography,
  Box,
  Button as MuiButton,
} from "@material-ui/core";
import { Ballot as BallotIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router";
import { getLicenses, getLicensesByAdmin } from "redux/reducers/licenseReducer";
// import { getClinic } from "redux/reducers/authReducer";
import LicenseTable from "./licenseTable";

const Button = styled(MuiButton)``;
const useStyles = makeStyles((theme) => ({
  root: {
    background: "#09A85B",
    "&:hover": {
      backgroundColor: "#09A85B",
    },
  },
  label: {
    color: "white",
  },

  marginSetting: {
    marginRight: "15px",
  },
  container: {
    justifyContent: "flex-end",
    paddingBottom: "15px",
  },
}));

const Grid = styled(MuiGrid)(spacing);

export const headCells = [
  {
    id: "licenseId",
    numeric: false,
    disablePadding: false,
    label: "LICENSE ID",
  },
  {
    id: "userName",
    numeric: false,
    disablePadding: false,
    label: "USER NAME",
  },
  {
    id: "userEmail",
    numeric: false,
    disablePadding: false,
    label: "USER EMAIL",
  },
  {
    id: "companyName",
    numeric: false,
    disablePadding: false,
    label: "COMPANY NAME",
  },
  {
    id: "issuedOn",
    numeric: false,
    disablePadding: false,
    label: "ISSUED ON",
  },
  {
    id: "expiringOn",
    numeric: false,
    disablePadding: false,
    label: "EXPIRING ON",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "ACTIONS",
  },
];

// const myData = [
//   createData(
//     "L1F16S234",
//     "John Doe",
//     "Techverx22@gmail.com",
//     "Nestle",
//     "1/2/2020",
//     "1/2/2022"
//   ),
//   createData(
//     "L1F164256",
//     "John Doe",
//     "Techverx2122@gmail.com",
//     "Pepsi",
//     "1/2/2021",
//     "1/2/2024"
//   ),
//   createData(
//     "L1F16S2345",
//     "John Abraham",
//     "john22@gmail.com",
//     "Coke",
//     "1/2/2020",
//     "1/2/2025"
//   ),
//   createData(
//     "L1F16S234",
//     "John Doe",
//     "Techverx22@gmail.com",
//     "Nestle",
//     "1/2/2020",
//     "1/2/2022"
//   ),
// ];

const SimpleTableDemo = ({ setOpenModal, role, licenseRemaining }) => {
  const classes = useStyles();

  const addNewLicense = () => {
    setOpenModal(true);
  };

  return (
    <React.Fragment>
      {role === "admin" && (
        <Grid container spacing={24} className={classes.container}>
          <Grid item justifyContent="end">
            <Typography color="primary">
              License Remaining:{licenseRemaining}
            </Typography>
          </Grid>
        </Grid>
      )}
      <Grid container justify="space-between" alignItems="center" mb={5}>
        <Grid item>
          <Box alignItems="center" display="flex" justifyContent="start">
            <Box mr={1} color="#444444">
              <BallotIcon />
            </Box>
            <Typography variant="h4" gutterBottom display="inline">
              View and manage Licenses
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Button
            className={classes.marginSetting}
            color="secondary"
            variant="outlined"
            size="large"
          >
            Reporting View
          </Button>
          {role === "super_admin" ? (
            <Button
              className={[classes.root, classes.label]}
              onClick={addNewLicense}
              variant="outlined"
              size="medium"
            >
              New License
            </Button>
          ) : (
            licenseRemaining > 0 && (
              <Button
                className={[classes.root, classes.label]}
                onClick={addNewLicense}
                variant="outlined"
                size="medium"
              >
                New License
              </Button>
            )
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const SimpleTable = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const allLicenses = useSelector((state) => state.licenseReducer.allLicenses);
  const user = useSelector((state) => state.authReducer.user);
  const licenseRemaining = useSelector(
    (state) => state.licenseReducer.availableLicenses
  );

  const myData = allLicenses.map(
    ({ dateCreated, dateExpiry, id, userName, userEmail, companyName }) => ({
      licenseId: id,
      userName,
      userEmail,
      companyName,
      issuedOn: new Date(dateCreated).toISOString().slice(0, 10),
      expiringOn: new Date(dateExpiry).toISOString().slice(0, 10),
    })
  );

  React.useEffect(() => {
    const { role = "" } = user || {};
    if (role === "super_admin") {
      dispatch(getLicensesByAdmin());
    } else {
      // dispatch(getClinic(clinicId));
      dispatch(getLicenses());
    }
  }, [dispatch, user]);

  return (
    <Box p={12}>
      <Helmet title="Dashboard" />
      <SimpleTableDemo
        setOpenModal={setOpenModal}
        role={user.role}
        licenseRemaining={licenseRemaining}
      />
      <LicenseTable
        myData={myData}
        data={myData}
        columns={headCells}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Box>
  );
};

export default SimpleTable;
