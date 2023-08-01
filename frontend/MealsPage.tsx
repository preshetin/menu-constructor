import React, { useState } from "react";
import {
  Link,
  TextButton,
  initializeBlock,
  useBase,
  useRecords,
  Box,
} from "@airtable/blocks/ui";
import {
  calculateTolalByPersonCount,
  getMeasureTotalPointByIngredientName,
  MENU_TABLE_NAME,
  MEALS_TABLE_NAME,
  MEAL_INGREDIENTS_TABLE_NAME,
  INGREDIENTS_TABLE_NAME,
} from "./shared";
import MenuDocument from "./menuPdf";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

function MealsPage() {
  const [dayNumber, setDayNumber] = useState(0);

  const base = useBase();

  const menuTable = base.getTableByName(MENU_TABLE_NAME);
  const daysRecords = useRecords(menuTable);

  const mealsTable = base.getTableByName(MEALS_TABLE_NAME);
  const mealsRecords = useRecords(mealsTable);

  const mealIngredients = base.getTableByName(MEAL_INGREDIENTS_TABLE_NAME);
  const mealIngredientsRecords = useRecords(mealIngredients);

  const ingredientsTable = base.getTableByName(INGREDIENTS_TABLE_NAME);
  const ingredientsRecords = useRecords(ingredientsTable);

  const daysLinks = daysRecords
    .filter((el) => el.getCellValue("Активно"))
    .map((dayRecord) => (
      <TextButton
        key={dayRecord.id}
        disabled={dayNumber === parseInt(dayRecord.name.replace(/^\D+/g, ""))}
        variant="light"
        onClick={() =>
          setDayNumber(parseInt(dayRecord.name.replace(/^\D+/g, "")))
        }
        style={{ margin: 10 }}
      >
        {dayRecord.name}{" "}
      </TextButton>
    ));


  return (
    <Box>
      {daysLinks}
      {/* <ul>{daysButtons}</ul> */}
      <PDFViewer width={"100%"} height={700}>
        <MenuDocument
          key={dayNumber}
          dayRecord={daysRecords[dayNumber]}
          mealsRecords={mealsRecords}
          mealIngredientsRecords={mealIngredientsRecords}
          ingredientsRecords={ingredientsRecords}
        />
      </PDFViewer>
    </Box>
  );
}

export default MealsPage;
