import React from "react";
import { useBase, useRecords, Box, Text } from "@airtable/blocks/ui";
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

  let shoppingListPerPerson: { [ingredieng: string]: number } = {};
  let leftoversObj: { [ingredient: string]: number } = {};
  let shoppingListArr = [];

  const activeDays = daysRecords.filter((el) => el.getCellValue("Активно"));

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

    let meals: ReferenceType[] = [];
    meals = meals.concat(breakfastMeals);
    meals = meals.concat(lunchMeals);
    meals = meals.concat(teaMeals);

    if (meals) {
      for (const meal of meals) {
        shoppingListArr.push(meal.name);

        const mealIngredients = mealIngredientsRecords.filter((el) => {
          const cell = el.getCellValue("Meal") as any; // TODO: find out Type
          return cell[0].name === meal.name;
        });

        for (const mealIngredient of mealIngredients) {
          const ingredient = mealIngredient.getCellValue("Ingredient")[0];

          const ingredientRecord = ingredientsRecords.find(
            (el) => el.id === ingredient.id
          );

          const ingredientName = ingredient.name;
          const leftoverCount = ingredientRecord.getCellValue(
            "Остатки"
          ) as number;
          leftoversObj[ingredientName] = leftoverCount;

          const count = mealIngredient.getCellValue("Count") as number;
          shoppingListArr.push(`${ingredientName}: ${count}`);
          if (shoppingListPerPerson.hasOwnProperty(ingredientName)) {
            // add value to existing
            shoppingListPerPerson[ingredientName] += count;
          } else {
            //create property with initial value
            shoppingListPerPerson[ingredientName] = count;
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
          .map((key: string) => {
            const total = calculateTolalByPersonCount({
              studentsCount,
              count: shoppingListPerPerson[key],
              measurePoint: getMeasureTotalPointByIngredientName( ingredientsRecords, key),
              leftoverCount: leftoversObj[key]
            });

            if (total <= 0) {
              return null;
            }

            return (
              <tr style={{ borderBottom: "1px solid #dddddd" }}>
                <td>{key}</td>
                <td>{total}</td>
                <td>
                  {getMeasureTotalPointByIngredientName(
                    ingredientsRecords,
                    key
                  )}
                </td>
              </tr>
            );
          })}
      </table>
    </Box>
  );
}

export default GroceryPage;
