import React from "react";
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

type ReferenceType = {
  id: "string";
  name: "string";
};

type ReferenceRecordType = ReferenceType[] | null;

function GroceryPage({ studentsCount }: { studentsCount: number }) {
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

  let shoppingListPerPerson = {};
  let shoppingListArr = [];

  const activeDays = daysRecords.filter((el) => el.getCellValue("Активно"));

  for (const dayRecord of activeDays) {
    const meals = dayRecord.getCellValue("Блюда") as ReferenceRecordType;

    if (meals) {
      for (const meal of meals) {
        shoppingListArr.push(meal.name);

        // shoppingListArr.push(JSON.stringify(mealIngredientsRecords[0].getCellValue("Meal")))

        const currentMealIngredients = mealIngredientsRecords.filter((el) => {
          const cell = el.getCellValue("Meal") as any; // TODO: find out Type
          return cell[0].name === meal.name;
        });

        for (const currentMealIngredient of currentMealIngredients) {
          const ingredient =
            currentMealIngredient.getCellValue("Ingredient")[0].name;
          const count = currentMealIngredient.getCellValue("Count") as number;
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
    <Box>
      <h2>Закупить продуктов:</h2>
      <ul>
        {Object.keys(shoppingListPerPerson)
          .sort()
          .filter((el) => el !== "Вода")
          .map((key: string) => (
            <li>
              {key}:{" "}
              {calculateTolalByPersonCount(
                studentsCount,
                shoppingListPerPerson[key]
              )}{" "}
              {getMeasureTotalPointByIngredientName(ingredientsRecords, key)}
            </li>
          ))}
      </ul>
    </Box>
  );

  return <h1>Grocerices</h1>;
}

export default GroceryPage;
