import React from "react";
import "date-fns";
import * as Yup from "yup";
import { Formik } from "formik";
import styled from "styled-components/macro";

import { Alert as MuiAlert } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import DateFnsUtils from "@date-io/date-fns";

import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField as MuiTextField,
  Typography as MuiTypography,
  MenuItem,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import {
  AccountCircle,
  CalendarToday as CalendarIcon,
} from "@material-ui/icons";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { providers, technicians } from "lib/dumyData";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Typography = styled(MuiTypography)(spacing);

const initialValues = {
  firstName: "",
  lastName: "",
  birthday: "",
  gender: "",
  encounterDate: "",
  provider: "",
  technician: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  birthday: Yup.date().required("Required"),
  encounterDate: Yup.date().required("Required"),
  gender: Yup.string().required("Required"),
  provider: Yup.number().required("Required"),
  technician: Yup.number().required("Required"),
});

const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
    touched,
    values,
    status,
  } = props;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card mb={6}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            PATIENT INFORMATION
          </Typography>

          {status && status.sent && (
            <Alert severity="success" my={3}>
              Your data has been submitted successfully!
            </Alert>
          )}

          {isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                    variant="filled"
                    my={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
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
                    variant="filled"
                    my={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <KeyboardDatePicker
                disableToolbar
                name="birthday"
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                label="Date of Birth"
                value={values.birthday}
                onChange={handleChange}
                error={Boolean(touched.birthday && errors.birthday)}
                fullWidth
                helperText={touched.birthday && errors.birthday}
                onBlur={handleBlur}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <Typography variant="subtitle1" mb={1}>
                Gender
              </Typography>
              <ToggleButtonGroup
                exclusive
                name="gender"
                label="Gender"
                value={values.gender}
                onBlur={handleBlur}
                onChange={handleChange}
                aria-label="text alignment"
              >
                <ToggleButton value="male" aria-label="male">
                  Male
                </ToggleButton>
                <ToggleButton value="female" aria-label="male">
                  Female
                </ToggleButton>
                <ToggleButton value="none-binary" aria-label="none-binary">
                  Non-binary
                </ToggleButton>
              </ToggleButtonGroup>

              <KeyboardDatePicker
                disableToolbar
                name="encounterDate"
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                label="Encounter Date"
                value={values.encounterDate}
                onChange={handleChange}
                error={Boolean(touched.encounterDate && errors.encounterDate)}
                fullWidth
                helperText={touched.encounterDate && errors.encounterDate}
                onBlur={handleBlur}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <Typography variant="subtitle1" mb={1}>
                Staff Information
              </Typography>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    select
                    name="provider"
                    label="Provider"
                    value={values.provider}
                    onChange={handleChange}
                    error={Boolean(touched.provider && errors.provider)}
                    fullWidth
                    helperText={touched.provider && errors.provider}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="filled"
                  >
                    {providers.map((option, index) => (
                      <MenuItem key={index} value={index}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    select
                    name="technician"
                    label="Technician"
                    value={values.technician}
                    onChange={handleChange}
                    error={Boolean(touched.technician && errors.technician)}
                    fullWidth
                    helperText={touched.technician && errors.technician}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="filled"
                  >
                    {technicians.map((option, index) => (
                      <MenuItem key={index} value={index}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </MuiPickersUtilsProvider>
  );
};

const BasicForm = () => {
  const handleSubmit = async (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      resetForm();
      setStatus({ sent: true });
      setSubmitting(false);
    } catch (error) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validate={(values) => {
          console.log(values);

          return {};
        }}
        onSubmit={handleSubmit}
      >
        {(formProps) => (
          <form onSubmit={handleSubmit}>
            <InnerForm {...formProps} />
          </form>
        )}
      </Formik>
    </React.Fragment>
  );
};
export default BasicForm;