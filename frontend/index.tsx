import { initializeBlock, useBase, useRecords } from "@airtable/blocks/ui";
import React, { useState } from "react";
import Record from "@airtable/blocks/dist/types/src/models/record";
import MenuDocument from "./menuPdf";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import "./styles.css"

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

  const [studentsCount, setStudentsCount] = useState(100);

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
    const result = (count / 1000) * studentsCount;
    return Math.round(result * 10) / 10;
  }

  // return JSON.stringify(daysRecords[0].getCellValue("Блюда")) 

  // return(
  //   <PDFViewer>
  //     <MenuDocument menuItem={daysRecords[0]} mealsRecords={mealsRecords}/> 
  //     {/* <MenuDocument menuItem="foo" mealRecords={[1,2]}/>  */}
  //   </PDFViewer>
  // )

  const daysButtons = daysRecords.map(dayRecord => (
    <li key={dayRecord.id} style={{marginTop: "10px"}}>
      {dayRecord.name}
      {" "}
      <PDFDownloadLink
        document={<MenuDocument menuItem={dayRecord} mealsRecords={mealsRecords}/>}
        fileName={`${dayRecord.name}.pdf`}
        key={JSON.stringify(daysRecords.map(el => el.getCellValueAsString('Блюда')))}
        className="button"
      >
        Скачать PDF
      </PDFDownloadLink>
    </li>
  )) 

  return (
    <div>
      <h1>Закупки</h1>
      <b>Студентов на курсе:</b>
      <input
        type="number"
        value={studentsCount}
        onChange={(event) => setStudentsCount(parseInt(event.target.value))}
      />
      <h2>Закупить продуктов:</h2>
      <ul>
        {Object.keys(shoppingListPerPerson).map((key: string) => (
          <li>
            {key}: {calculateTolalByPersonCount(shoppingListPerPerson[key])}{" "}
            {getMeasureTotalPointByIngredientName(key)}
          </li>
        ))}
      </ul>
      <h2> Распечатать меню</h2>
      <ul>
        {daysButtons}
      </ul>
    </div>
  );
}

initializeBlock(() => <HelloWorldTypescriptApp />);
