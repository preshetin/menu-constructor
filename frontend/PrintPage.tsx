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
} from "./shared";
import MenuDocument from "./menuPdf";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

function PrintPage({ studentsCount }: { studentsCount: number }) {
  const [dayNumber, setDayNumber] = useState(0);

  const MENU_TABLE_NAME = "Меню";
  const MEALS_TABLE_NAME = "Блюда";
  const MEAL_INGREDIENTS_TABLE_NAME = "Ингредиенты блюд";
  const INGREDIENTS_TABLE_NAME = "Ингредиенты";

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

  // const daysButtons = daysRecords
  //   .filter((el) => el.getCellValue("Активно"))
  //   .map((dayRecord) => (
  //     <li key={dayRecord.id} style={{ marginTop: "10px" }}>
  //       {dayRecord.name}{" "}
  //       <PDFDownloadLink
  //         document={
  //           <MenuDocument
  //             menuItem={dayRecord}
  //             mealsRecords={mealsRecords}
  //             mealIngredientsRecords={mealIngredientsRecords}
  //             studentsCount={studentsCount}
  //             ingredientsRecords={ingredientsRecords}
  //           />
  //         }
  //         fileName={`${dayRecord.name}.pdf`}
  //         key={
  //           JSON.stringify(
  //             daysRecords.map((el) => el.getCellValueAsString("Блюда"))
  //           ) + studentsCount
  //         }
  //         className="button"
  //       >
  //         {({ blob, url, loading, error }) =>
  //           loading ? "Loading document..." : "Распечатать"
  //         }
  //       </PDFDownloadLink>
  //     </li>
  //   ));

  return (
    <Box>
      {daysLinks}
      {/* <ul>{daysButtons}</ul> */}
      <PDFViewer width={"100%"} height={700}>
        <MenuDocument
          menuItem={daysRecords[dayNumber]}
          studentsCount={studentsCount}
          mealsRecords={mealsRecords}
          mealIngredientsRecords={mealIngredientsRecords}
          ingredientsRecords={ingredientsRecords}
        />
      </PDFViewer>
    </Box>
  );
}

export default PrintPage;
