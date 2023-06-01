import React from "react";
import {
 useBase,
  useRecords,
  Box,
  Text,
} from "@airtable/blocks/ui";
import {
  calculateTolalByPersonCount,
  getMeasureTotalPointByIngredientName,
  MENU_TABLE_NAME,
  MEALS_TABLE_NAME,
  MEAL_INGREDIENTS_TABLE_NAME,
  INGREDIENTS_TABLE_NAME,
} from "./shared";

type ReferenceType = {
  id: "string";
  name: "string";
};

type ReferenceRecordType = ReferenceType[] | null;

function GroceryPage({ studentsCount }: { studentsCount: number }) {
  const base = useBase();

  const menuTable = base.getTableByName(MENU_TABLE_NAME);
  const daysRecords = useRecords(menuTable);

  const mealsTable = base.getTableByName(MEALS_TABLE_NAME);
  const mealsRecords = useRecords(mealsTable);

  const mealIngredients = base.getTableByName(MEAL_INGREDIENTS_TABLE_NAME);
  const mealIngredientsRecords = useRecords(mealIngredients);

  const ingredientsTable = base.getTableByName(INGREDIENTS_TABLE_NAME);
  const ingredientsRecords = useRecords(ingredientsTable);

  let shoppingListPerPerson = {};
  let shoppingListArr = [];

  const activeDays = daysRecords.filter((el) => el.getCellValue("Активно"));

  for (const dayRecord of activeDays) {
    const meals = dayRecord.getCellValue("Блюда") as ReferenceRecordType;

    if (meals) {
      for (const meal of meals) {
        shoppingListArr.push(meal.name);

        const mealIngredients = mealIngredientsRecords.filter((el) => {
          const cell = el.getCellValue("Meal") as any; // TODO: find out Type
          return cell[0].name === meal.name;
        });

        for (const mealIngredient of mealIngredients) {
          const ingredient =
            mealIngredient.getCellValue("Ingredient")[0].name;
          const count = mealIngredient.getCellValue("Count") as number;
          shoppingListArr.push(`${ingredient}: ${count}`);
          if (shoppingListPerPerson.hasOwnProperty(ingredient)) {
            // add value to existing
            shoppingListPerPerson[ingredient] += count;
          } else {
            //create property with initial value
            shoppingListPerPerson[ingredient] = count;
          }
        }
      }
    }
  }

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
        {Object.keys(shoppingListPerPerson)
          .sort()
          .filter((el) => el !== "Вода")
          .map((key: string) => (
            <tr style={{ borderBottom: "1px solid #dddddd" }}>
              <td>{key}</td>
              <td>
                {calculateTolalByPersonCount(
                  studentsCount,
                  shoppingListPerPerson[key]
                )}{" "}
              </td>
              <td>
                {getMeasureTotalPointByIngredientName(ingredientsRecords, key)}
              </td>
            </tr>
          ))}
      </table>
    </Box>
  );
}

export default GroceryPage;
