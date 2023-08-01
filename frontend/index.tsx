import {
  TextButton,
  initializeBlock,
  Box,
  Text,
  FormField,
  useGlobalConfig,
  InputSynced,
} from "@airtable/blocks/ui";
import React, { useState } from "react";
import "./styles.css";
import GroceryPage from "./GroceryPage";
import MealsPage from "./MealsPage";

function MealPlannerApp() {
  const [page, setPage] = useState("meals"); // or 'print' or 'grocery'

  const globalConfig = useGlobalConfig();
  const studentsCount = globalConfig.get('studentsCount');

  if (!studentsCount) {
    return (
    <Box padding={3}>
      <Box>
        <FormField label="Студентов на курсе">
          <InputSynced
            globalConfigKey="studentsCount"
            type="number"
            placeholder="Number of students"
            width={150}
          />
        </FormField>
      </Box>
      <Text size="xlarge">введите 👆 количество студентов</Text>
      </Box>)
  }

  // return JSON.stringify(daysRecords[0].getCellValue("Блюда"))

  return (
    <Box padding={3}>
      <Box>
        <FormField label="Студентов на курсе">
          <InputSynced
            globalConfigKey="studentsCount"
            type="number"
            placeholder="Number of students"
            width={150}
          />
        </FormField>
      </Box>

      <TextButton
        onClick={() => setPage("meals")}
        disabled={page === "meals"}
        style={{ margin: 10 }}
        icon="print"
      >
        Меню для повара
      </TextButton>
      <TextButton
        onClick={() => setPage("grocery")}
        disabled={page === "grocery"}
        style={{ margin: 10 }}
        icon="group"
      >
        Закупки
      </TextButton>

      {page === "grocery" && <GroceryPage />}

      {page === "meals" && <MealsPage />}
    </Box>
  );
}

initializeBlock(() => <MealPlannerApp />);
