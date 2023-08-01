import React from "react";
import { useBase, useRecords, Box, Text } from "@airtable/blocks/ui";
import {
  calculateTolalByPersonCount,
  getMeasureTotalPointByIngredientName,
  MENU_TABLE_NAME,
  MEALS_TABLE_NAME,
  MEAL_INGREDIENTS_TABLE_NAME,
  INGREDIENTS_TABLE_NAME,
  getIngredientsForMealsList,
} from "./shared";
import { globalConfig } from "@airtable/blocks";

type ReferenceType = {
  id: "string";
  name: "string";
};

function GroceryPage() {
  const base = useBase();

  const menuTable = base.getTableByName(MENU_TABLE_NAME);
  const daysRecords = useRecords(menuTable);

  const mealsTable = base.getTableByName(MEALS_TABLE_NAME);
  const mealsRecords = useRecords(mealsTable);

  const mealIngredients = base.getTableByName(MEAL_INGREDIENTS_TABLE_NAME);
  const mealIngredientsRecords = useRecords(mealIngredients);

  const ingredientsTable = base.getTableByName(INGREDIENTS_TABLE_NAME);
  const ingredientsRecords = useRecords(ingredientsTable);

  const studentsCount = globalConfig.get('studentsCount') as unknown as number;
  const newStudentsCount = globalConfig.get('newStudentsCount') as unknown as number;

  let shoppingListPerPerson: { [ingredient: string]: number } = {};
  let leftoversObj: { [ingredient: string]: number } = {};

  const activeDays = daysRecords.filter((el) => el.getCellValue("Активно"));

  let mealsOfAllDays: ReferenceType[] = [];

  for (const dayRecord of activeDays) {
    // const meals = dayRecord.getCellValue("Блюда") as ReferenceRecordType;

    const breakfastMeals = dayRecord.getCellValue("Завтрак")
      ? (dayRecord.getCellValue("Завтрак") as ReferenceType[])
      : [];
    const lunchMeals = dayRecord.getCellValue("Обед")
      ? (dayRecord.getCellValue("Обед") as ReferenceType[])
      : [];
    const teaMeals = dayRecord.getCellValue("Полдник")
      ? (dayRecord.getCellValue("Полдник") as ReferenceType[])
      : [];

    mealsOfAllDays = mealsOfAllDays.concat(breakfastMeals);
    mealsOfAllDays = mealsOfAllDays.concat(lunchMeals);
    mealsOfAllDays = mealsOfAllDays.concat(teaMeals);
  }
    
  const ingredientsForAllMealsOfAllDays = getIngredientsForMealsList(mealsOfAllDays, {mealsRecords, mealIngredientsRecords, ingredientsRecords, studentsCount, newStudentsCount});

  return (
    <Box padding={1}>
      <Text size="large" textColor="light">
        Закупить, чтобы хватило до конца курса
      </Text>
      <style>
        {`.styled-table {
              border-collapse: collapse;
              margin: 25px 0;
              font-size: 0.9em;
          }

          .styled-table th,
          .styled-table td {
              padding: 5px 8px;
          }

          .styled-table  tr {
              border-bottom: 1px solid #dddddd;
          }

          .styled-table  tr:nth-of-type(even) {
              background-color: #f3f3f3;
          }

          .styled-table  tr:last-of-type {
              border-bottom: 2px solid #009879;
          }
        `}
      </style>
      <table className="styled-table">
        {ingredientsForAllMealsOfAllDays.map(el => {
          const leftoverCount = +ingredientsRecords.find(elem => elem.name === el.ingredient).getCellValueAsString('Остатки');

          const resultCount = el.count - leftoverCount;

          if (resultCount < 0) return null;

          return (
              <tr style={{ borderBottom: "1px solid #dddddd" }}>
                <td>{el.ingredient}</td>
                <td>{resultCount.toLocaleString('ru')}</td>
                <td>
                  {el.type}
                </td>
              </tr>
          )
        })}
      </table>
    </Box>
  );
}

export default GroceryPage;
