import React from "react";

import TableRow from "@material-ui/core/TableRow";
import ReportCard from "components/reports/ReportCard";
import ReportTable from "components/reports/Table";
import Cell from "components/reports/Cell";
import BodyCell from "components/reports/BodyCell";
import Toggle from "components/reports/Toggle";
import TextArea from "components/reports/TextArea";
import Input from "components/reports/Input";

import { Box } from "@material-ui/core";

const HallPick = ({ formTitle, formKey, setFieldValue, values }) => {
  const data = values[formKey];

  const sections = [
    {
      title: "Right",
      key: "right",
      parentKey: `${formKey}.right`,
    },
    {
      title: "Left",
      parentKey: `${formKey}.left`,
      key: "left",
    },
  ];

  return (
    <ReportCard title={formTitle}>
      <>
        <ReportTable
          Columns={() => (
            <>
              <Cell align="center" />
              <Cell align="center" />
              <Cell align="center">Vertigo</Cell>
              <Cell align="center">Beat Direction</Cell>
              <Cell align="center"> DEG./SEC</Cell>
            </>
          )}
        >
          {sections.map(({ title, parentKey, key }) => (
            <TableRow key={key}>
              <BodyCell>{title}</BodyCell>
              <BodyCell>
                <Box mb={2.5} mt={2.5}>
                  <Toggle
                    name={`${formKey}.${key}`}
                    value={data[key]}
                    onChange={(value) =>
                      setFieldValue(`${formKey}.${key}`, value)
                    }
                    options={[
                      { title: "Negative", value: "negative" },
                      { title: "Positive", value: "positive" },
                    ]}
                  />
                </Box>
              </BodyCell>
              <BodyCell>
                <Box mb={2.5} mt={2.5}>
                  <Toggle
                    name={`${formKey}.${key}`}
                    value={data[key]}
                    onChange={(value) =>
                      setFieldValue(`${formKey}.${key}`, value)
                    }
                    options={[
                      { title: "Yes", value: "yes" },
                      { title: "No", value: "no" },
                    ]}
                  />
                </Box>
              </BodyCell>
              <BodyCell>
                <Box mb={2.5} mt={2.5}>
                  <Toggle
                    togglesize={{
                      width: "126px",
                      height: "59px",
                    }}
                    direction={"row"}
                    name={`${formKey}.${key}`}
                    value={data[key]}
                    onChange={(value) =>
                      setFieldValue(`${formKey}.${key}`, value)
                    }
                    options={[
                      { title: "Up & Right Torsion", value: "ur" },
                      { title: "Up & Left Torsion", value: "ul" },
                      { title: "Down & Right Torsion", value: "dr" },
                      { title: "Down & Left Torsion", value: "dl" },
                    ]}
                  />
                </Box>
              </BodyCell>
              <BodyCell>
                <Box mb={2.5} mt={2.5}>
                  <Input
                    value={data[key]["deg"]}
                    onChange={(e) =>
                      setFieldValue(`${formKey}.${key}.deg`, e.target.value)
                    }
                  />
                </Box>
              </BodyCell>
            </TableRow>
          ))}
        </ReportTable>
        <TextArea
          rowsMin={3}
          placeholder="Notes"
          value={data["notes"]}
          onChange={(value) => setFieldValue(`${formKey}.notes`, value)}
        />
      </>
    </ReportCard>
  );
};

export default HallPick;
