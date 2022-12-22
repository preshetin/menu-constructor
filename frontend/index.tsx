import { initializeBlock, useBase, useRecords } from "@airtable/blocks/ui";
import React from "react";
import Record from "@airtable/blocks/dist/types/src/models/record";

type ReferenceType = {
  id: "string";
  name: "string";
};

type ReferenceRecordType = ReferenceType[] | null;

function HelloWorldTypescriptApp() {
  const STUDENTS_ON_COURSE = 110;

  const MENU_TABLE_NAME = "Menu";
  const MEALS_TABLE_NAME = "Meals";
  const MEAL_INGREDIENTS_TABLE_NAME = "MealIngredients";
  const INGREDIENTS_TABLE_NAME = "Ingredients";

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
  for (const dayRecord of daysRecords) {
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

  function getMeasurePointByIngredientName(ingredientName: string): string {
    const cell = ingredientsRecords
      .find((el: Record) => el.name === ingredientName)
      .getCellValue("Единица измерения") as any;
    return cell.name;
  }

  function getMeasureTotalPointByIngredientName(
    ingredientName: string
  ): string {
    const valueInIngredientRecord =
      getMeasurePointByIngredientName(ingredientName);
    switch (valueInIngredientRecord) {
      case "грамм":
        return "кг";
      case "миллилитр":
        return "л";
      default:
        return "ошибка...";
    }
  }

  function calculateTolalByPersonCount(count: number): number {
    const result = (count / 1000) * STUDENTS_ON_COURSE;
    return Math.round(result * 10) / 10;
  }

  return (
    <div>
      <b>Студентов на курсе: {STUDENTS_ON_COURSE}</b>
      <hr />
      <h2>Закупить продуктов:</h2>
      <ul>
        {Object.keys(shoppingListPerPerson).map((key: string) => (
          <li>
            {key}: {calculateTolalByPersonCount(shoppingListPerPerson[key])}{" "}
            {getMeasureTotalPointByIngredientName(key)}
          </li>
        ))}
      </ul>
      <hr />
      <h2>На одного человека:</h2>
      <ul>
        {Object.keys(shoppingListPerPerson).map((key: string) => (
          <li>
            {key}: {shoppingListPerPerson[key]}{" "}
            {getMeasurePointByIngredientName(key)}
          </li>
        ))}
      </ul>
    </div>
  );
}

initializeBlock(() => <HelloWorldTypescriptApp />);
