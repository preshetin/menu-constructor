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

  const base = useBase();
  const courseTable = base.getTableByName("Меню");
  const daysRecords = useRecords(courseTable);

  const ingredientsTable = base.getTableByName("Ингредиенты");
  const ingredientsRecords = useRecords(ingredientsTable);

  let shoppingListPerPerson = {};
  for (const dayRecord of daysRecords) {
    const meals = dayRecord.getCellValue("Блюда") as ReferenceRecordType;

    if (meals) {
      for (const meal of meals) {
        if (meal) {
          // shoppingList.push(meal.name);
          const mealTable = base.getTableByName(meal.name);
          const mealTableRecords = useRecords(mealTable);
          for (const mealTableRecord of mealTableRecords) {
            const ingredientObj = mealTableRecord.getCellValue(
              "Ingredient"
            ) as ReferenceRecordType;
            const ingredientName = ingredientObj[0].name;

            if (shoppingListPerPerson.hasOwnProperty(ingredientName)) {
              // add value to existing
              shoppingListPerPerson[ingredientName] +=
                mealTableRecord.getCellValue("Единиц на человека");
            } else {
              //create property with initial value
              shoppingListPerPerson[ingredientName] =
                mealTableRecord.getCellValue("Единиц на человека");
            }
            //  shoppingList.key(
            //    `${ingredientObj[0].name}: ${mealTableRecord.getCellValue("Единиц на человека")}`
            //  );
          }
        }
      }
    }

  }

  function getMeasurePointByIngredientName(ingredientName: string): string {
  const cell = ingredientsRecords.find((el: Record) => el.name === ingredientName).getCellValue("Единица измерения") as any
    return  cell.name;
  }

  return (
    <div>
      <h1>Закупка продуктов</h1>
      <b>Студентов на курсе: {STUDENTS_ON_COURSE}</b>
      <hr />
      <b>Закупить на одного человека:</b>
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
