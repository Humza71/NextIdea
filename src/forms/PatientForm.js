import React, { useEffect } from "react";
import "date-fns";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
// import queryString from "query-string";
import { Alert as MuiAlert } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import Toggle from "../components/reports/Toggle";
import DateFnsUtils from "@date-io/date-fns";
import {
  Box,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from "@material-ui/core";
// import {
//   ToggleButton,
//   ToggleButtonGroup as MuiToggleButtonGroup,
// } from "@material-ui/lab";
import { User as UserIcon } from "react-feather";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker as MuiKeyboardDatePicker,
} from "@material-ui/pickers";

import CreateReportFooter from "components/CreateReportFooter";
import AdvancedSelect from "components/AdvancedSelect";
import {
  updateReport,
  getReportById,
  getAllProviders,
  getAllTechnicians,
  LoadingStates,
  addProvider,
  addTechnician,
  setCompleted,
  // saveReport,
} from "redux/reducers/reportReducer";
import { setStepNewReport } from "redux/reducers/uiReducer";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Typography = styled(MuiTypography)(spacing);

const OutCard = styled(Card)`
  width: 500px;
  margin: 20px auto;
`;

const KeyboardDatePicker = styled(MuiKeyboardDatePicker)`
  .MuiFormLabel-filled {
    font-size: 20px;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    font-weight: 400;
    color: black;
    line-height: 25px;
    margin-top: -10px;
  }
`;

// const ToggleButtonGroup = styled(MuiToggleButtonGroup)`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   .MuiToggleButton-root {
//     border: 1px solid rgba(0, 0, 0, 0.12) !important;
//     border-radius: 4px !important;
//     min-width: 100px;
//   }
// `;

const validationSchema = Yup.object().shape({
  ssn: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  dob: Yup.date().required("Required"),
  encounterDate: Yup.date().required("Required"),
  gender: Yup.string().required("Required"),
  provider: Yup.number(),
  technician: Yup.number(),
});

const InnerForm = (props) => {
  const dispatch = useDispatch();
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    isSubmitting,
    touched,
    values,
    status,
  } = props;
  const Options = [
    {
      title: "Male",
      value: "male",
    },
    {
      title: "Female",
      value: "female",
    },
    {
      title: "Non-Binary",
      value: "non-binary",
    },
  ];
  const providers = useSelector((state) => state.reportReducer.providers) || [];
  const technicians =
    useSelector((state) => state.reportReducer.technicians) || [];
  const reportLoading = useSelector((state) => state.reportReducer.loading);
  const hanldeNewProvider = (newProvider, saveForFuture) => {
    dispatch(addProvider(newProvider, saveForFuture));
  };
  const hanldeNewTechnician = (newTechnician, saveForFuture) => {
    dispatch(addTechnician(newTechnician, saveForFuture));
  };

  console.log(values.staffInformation.technicianId, "table values");
  console.log(values, "values");

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <OutCard mb={6}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            PATIENT INFORMATION
          </Typography>

          {status && status.sent && (
            <Alert severity="success" my={3}>
              Your data has been submitted successfully!
            </Alert>
          )}

          {isSubmitting ||
          reportLoading === LoadingStates.REPORT_CREATION_LOADING ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mb={2.5}>
                <Typography variant="subtitle1" mb={1}>
                  Patient Name
                </Typography>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      value={values.firstName}
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      my={2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      error={Boolean(touched.lastName && errors.lastName)}
                      fullWidth
                      helperText={touched.lastName && errors.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      my={2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2.5}>
                <KeyboardDatePicker
                  disableToolbar
                  name="dob"
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  label="Date of Birth"
                  value={values.dob}
                  onChange={(value) => setFieldValue("dob", value)}
                  error={Boolean(touched.dob && errors.dob)}
                  fullWidth
                  helperText={touched.dob && errors.dob}
                  onBlur={handleBlur}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Box>
              <Box mb={2.5}>
                <Typography variant="subtitle1" mb={1}>
                  Gender
                </Typography>
                <Toggle
                  togglesize={{
                    width: "148px",
                    height: "38px",
                  }}
                  direction="row"
                  value={values["gender"]}
                  options={Options}
                  onChange={(value) => setFieldValue("gender", value)}
                />
              </Box>
              <Box mb={2.5}>
                <Typography variant="subtitle1" mb={1}>
                  Last 4 Digits of SSN
                </Typography>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <TextField
                      type="password"
                      name="ssn"
                      label="SSN"
                      value={values.ssn}
                      error={Boolean(touched.ssn && errors.ssn)}
                      fullWidth
                      helperText={touched.ssn && errors.ssn}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      my={2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start"></InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box mb={2.5}>
                <KeyboardDatePicker
                  disableToolbar
                  name="encounterDate"
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  label="Encounter Date"
                  value={values.encounterDate}
                  onChange={(value) => setFieldValue("encounterDate", value)}
                  error={Boolean(touched.encounterDate && errors.encounterDate)}
                  fullWidth
                  helperText={touched.encounterDate && errors.encounterDate}
                  onBlur={handleBlur}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Box>
              <Box mb={2.5}>
                <Typography variant="subtitle1" mb={1}>
                  Staff Information
                </Typography>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <AdvancedSelect
                      error={Boolean(touched.providerId && errors.providerId)}
                      helperText={touched.providerId && errors.providerId}
                      value={values.staffInformation.providerId}
                      onChange={(e) =>
                        setFieldValue(
                          "staffInformation.providerId",
                          e.target.value
                        )
                      }
                      onBlur={handleBlur}
                      name="providerId"
                      label="Provider"
                      options={providers.map((item, index) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      variant="outlined"
                      allowAdd={true}
                      onAdd={hanldeNewProvider}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <AdvancedSelect
                      error={Boolean(
                        touched.technicianId && errors.technicianId
                      )}
                      helperText={touched.technicianId && errors.technicianId}
                      value={values.staffInformation.technicianId}
                      onChange={(e) =>
                        setFieldValue(
                          "staffInformation.technicianId",
                          e.target.value
                        )
                      }
                      onBlur={handleBlur}
                      name="technicianId"
                      label="Technician"
                      options={technicians.map((item, index) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      variant="outlined"
                      allowAdd={true}
                      onAdd={hanldeNewTechnician}
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </CardContent>
      </OutCard>
    </MuiPickersUtilsProvider>
  );
};

const PatientForm = (props) => {
  const newReport = useSelector((state) => {
    return state.reportReducer.newReport;
  });
  const stepNewReport = useSelector((state) => state.uiReducer.stepNewReport);
  const dispatch = useDispatch();
  const history = useHistory();
  const { match = {} } = props || {};
  const { params = {} } = match;
  const { id } = params;

  const initialValues = {
    firstName: newReport.firstName,
    lastName: newReport.lastName,
    dob: newReport.dob ? new Date(newReport.dob) : new Date(),
    gender: newReport.gender,
    encounterDate: newReport.encounterDate
      ? new Date(newReport.encounterDate)
      : new Date(),
    staffInformation: {
      providerId: newReport.staffInformation
        ? newReport.staffInformation.providerId
        : "",
      technicianId: newReport.staffInformation
        ? newReport.staffInformation.technicianId
        : "",
    },
  };

  useEffect(() => {
    dispatch(getAllProviders());
    dispatch(getAllTechnicians());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (id) {
      dispatch(
        getReportById(
          {
            id,
          },
          () => {}
        )
      );
    } else {
      dispatch(setCompleted());
    }
  }, [dispatch, id]);
  const onSuccess = (reportId) => {
    if (!id) {
      // dispatch(getAllProviders());
      // dispatch(getAllTechnicians());
      // debugger;
      history.push(`/report/create/${reportId}`);
    }
  };
  // useEffect(() => {
  //   if (newReport.firstName) {
  //     history.push("/report");
  //   }
  // }, [newReport.firstName]);
  const handleSave = (values) => {
    dispatch(
      updateReport(
        {
          ...values,
          id,
          dob: values.dob.toISOString(),
          encounterDate: values.encounterDate.toISOString(),
        },
        onSuccess
      )
    );

    // dispatch(
    //   saveReport({
    //     ...values,
    //     dob: values.dob.toISOString(),
    //     encounterDate: values.encounterDate.toISOString(),
    //   })
    // );
  };

  const handleSubmit = async (values) => {
    try {
      handleSave(values);
      dispatch(setStepNewReport(stepNewReport + 1));
      // setStatus({ sent: true });
      // setSubmitting(false);
    } catch (error) {
      // setStatus({ sent: false });
      // setErrors({ submit: error.message });
      // setSubmitting(false);
    }
  };

  console.log(newReport, "check provider");
  console.log(initialValues, "initialValues");

  return (
    <React.Fragment>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        validate={(values) => {
          console.log(values);
          return {};
        }}
        onSubmit={handleSubmit}
      >
        {(formProps) => (
          <Form onSubmit={() => handleSubmit(formProps.values)}>
            <InnerForm {...formProps} />
            <CreateReportFooter
              {...formProps}
              id={id}
              handleSave={() => {
                handleSave(formProps.values);
              }}
            />
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};
export default PatientForm;
