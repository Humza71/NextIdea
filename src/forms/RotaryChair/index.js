import React, { Fragment, useEffect } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import { Box, CircularProgress } from "@material-ui/core";
import CreateReportFooter from "components/CreateReportFooter";
import { useDispatch, useSelector } from "react-redux";

import ReportCard from "components/reports/ReportCard";
import Toggle from "components/reports/Toggle";
import Divider from "@material-ui/core/Divider";
import TextArea from "components/reports/TextArea";
import Section from "components/reports/Section";
import {
  rotaryChairReport,
  getRotaryChair,
  LoadingStates,
} from "../../redux/reducers/reportReducer";
import { setStepNewReport } from "redux/reducers/uiReducer";

// const initialValues = {
//   right: "",
//   left: "",
//   notes: "",
// };

const validationSchema = Yup.object().shape({});

const InnerForm = (props) => {
  const { setFieldValue, isSubmitting, values } = props;
  const reportLoading = useSelector((state) => state.reportReducer.loading);

  return isSubmitting ||
    reportLoading === LoadingStates.REPORT_CREATION_LOADING ? (
    <Box display="flex" justifyContent="center" my={6}>
      <CircularProgress />
    </Box>
  ) : (
    <>
      <ReportCard cardsize={{ width: "680px" }} title="Rotary Chair">
        <Section size={{ width: "88%" }}>
          <span>Right</span>
          <Toggle
            name={`normality`}
            value={values["right"]["normality"]}
            onChange={(value) => setFieldValue(`right.normality`, value)}
            options={[
              { title: "Normal", value: "normal" },
              { title: "Abnormal", value: "abnormal" },
            ]}
          />
          <Toggle
            togglesize={{
              width: "144px",
              height: "38px",
            }}
            name={`gain`}
            value={values["right"]["gain"]}
            onChange={(value) => setFieldValue(`right.gain`, value)}
            options={[
              { title: "High Gain", value: "highGain" },
              { title: "Reduced Gain", value: "rg" },
            ]}
          />
          <Toggle
            togglesize={{
              width: "210px",
              height: "38px",
            }}
            name={`timeConstants`}
            value={values["right"]["timeConstants"]}
            onChange={(value) => setFieldValue(`right.timeConstants`, value)}
            options={[
              { title: "Short Time Constants", value: "stp" },
              { title: "Long Time Constants", value: "ltc" },
            ]}
          />
        </Section>
        <Divider />
        <Box mt={5}>
          <Section size={{ width: "88%" }}>
            <span>Left</span>
            <Toggle
              name={`normality`}
              value={values["left"]["normality"]}
              onChange={(value) => setFieldValue(`left.normality`, value)}
              options={[
                { title: "Normal", value: "normal" },
                { title: "Abnormal", value: "abnormal" },
              ]}
            />
            <Toggle
              togglesize={{
                width: "144px",
                height: "38px",
              }}
              name={`gain`}
              value={values["left"]["gain"]}
              onChange={(value) => setFieldValue(`left.gain`, value)}
              options={[
                { title: "High Gain", value: "highGain" },
                { title: "Reduced Gain", value: "rg" },
              ]}
            />
            <Toggle
              togglesize={{
                width: "210px",
                height: "38px",
              }}
              name={`timeConstants`}
              value={values["left"]["timeConstants"]}
              onChange={(value) => setFieldValue(`left.timeConstants`, value)}
              options={[
                { title: "Short Time Constants", value: "stp" },
                { title: "Long Time Constants", value: "ltc" },
              ]}
            />
          </Section>
        </Box>
        <TextArea
          rowsMin={3}
          placeholder="Notes"
          value={values["notes"]}
          onChange={(value) => setFieldValue(`notes`, value)}
        />
      </ReportCard>
    </>
  );
};

const RotaryChair = (props) => {
  const { match = {} } = props || {};
  const { params = {} } = match;
  const { id } = params;
  const dispatch = useDispatch();
  const rotaryChairValues = useSelector(
    (state) => state.reportReducer.rotaryChair
  );
  const stepNewReport = useSelector((state) => state.uiReducer.stepNewReport);
  const initialValues = {
    right: {
      normality: rotaryChairValues.right?.normality,
    },
    left: {
      normality: rotaryChairValues.left?.normality,
      gain: rotaryChairValues.left?.gain,
      timeConstants: rotaryChairValues.left?.timeConstants,
    },
    notes: rotaryChairValues.notes,
  };

  const handleSave = (values) => {
    dispatch(
      rotaryChairReport({
        reportId: id,
        ...values,
      })
    );
  };

  useEffect(() => {
    if (id) {
      dispatch(
        getRotaryChair({
          reportId: id,
        })
      );
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (id) {
      props.history.push(`/report/create/${id}/${stepNewReport}`);
    }
  }, [id, stepNewReport, props.history]);

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

  return (
    <Fragment>
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
          <form onSubmit={() => handleSubmit(formProps.values)}>
            <InnerForm {...formProps} />
            <CreateReportFooter
              {...formProps}
              handleSave={() => {
                handleSave(formProps.values);
              }}
            />
          </form>
        )}
      </Formik>
    </Fragment>
  );
};

export default RotaryChair;
