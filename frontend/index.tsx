import {
  TextButton,
  initializeBlock,
  Box,
  Input,
  Text,
  FormField,
} from "@airtable/blocks/ui";
import React, { useState } from "react";
import "./styles.css";
import GroceryPage from "./GroceryPage";
import PrintPage from "./PrintPage";

function MealPlannerApp() {
  const [studentsCount, setStudentsCount] = useState(60);
  const [page, setPage] = useState("print"); // or 'print' or 'grocery'

  // return JSON.stringify(daysRecords[0].getCellValue("Блюда"))

  return (
    <Box padding={3}>
      <Box>
        <FormField label="Студентов на курсе">
          <Input
            value={studentsCount}
            width={150}
            type="number"
            onChange={(e) => setStudentsCount(e.target.value)}
          />
        </FormField>
      </Box>

      <TextButton
        onClick={() => setPage("validation")}
        disabled={page === "validation"}
        style={{ margin: 10 }}
        icon="checklist"
      >
        Проверка
      </TextButton>
      <TextButton
        onClick={() => setPage("print")}
        disabled={page === "print"}
        style={{ margin: 10 }}
        icon="print"
      >
        Печать
      </TextButton>
      <TextButton
        onClick={() => setPage("grocery")}
        disabled={page === "grocery"}
        style={{ margin: 10 }}
        icon="group"
      >
        Закупки
      </TextButton>

      {page === "grocery" && <GroceryPage studentsCount={studentsCount} />}

      {page === "print" && <PrintPage studentsCount={studentsCount} />}
    </Box>
  );
}

initializeBlock(() => <MealPlannerApp />);
