import Record from "@airtable/blocks/dist/types/src/models/record";
import { initReactI18next } from "react-i18next";

export const MENU_TABLE_NAME = "Меню";
export const MEALS_TABLE_NAME = "Блюда";
export const MEAL_INGREDIENTS_TABLE_NAME = "Ингредиенты блюд";
export const INGREDIENTS_TABLE_NAME = "Ингредиенты";

export const RECIPE_FIELD_NAME = 'Рецепт приготовления'
// export const RECIPE_FIELD_NAME = 'Recipe EN'

export type IngredientWithPortion = {
  ingredient: string;
  count: number;
  type: string;
  comment: string;
  purchasePlaceName: string;
}

/*
 *
 */
export function getMeasurePointByIngredientName(ingredientsRecords: Record[], ingredientName: string): string {
  const cell = ingredientsRecords
    .find((el: Record) => el.name === ingredientName)
    .getCellValue("Единица измерения") as any;
  return cell.name;
}

export function getMeasureTotalPointByIngredientName(ingredientsRecords: Record[], ingredientName: string): string {
  const valueInIngredientRecord =
    getMeasurePointByIngredientName(ingredientsRecords, ingredientName);
  switch (valueInIngredientRecord) {
    case "грамм":
      return "кг";
    case "миллилитр":
      return "л";

    // static 
    case "штука":
      return "шт";

    default:
      return "ошибка...";
  }
}

export function calculateTolalByPersonCount({
  personCount,
  count,
  measurePoint,
  leftoverCount,
}: {
  personCount: number;
  count: number;
  measurePoint: string;
  leftoverCount?: number;
}): number {
  let result = count;

  if (measurePoint === "кг" || measurePoint === "л") {
    result = (count / 1000) * personCount;
  }
  if (leftoverCount) {
    result -= leftoverCount;
  }

  return Math.round(result * 10) / 10;
}


export function getPersonCountByMeal(mealRecord: Record, {studentsCount, newStudentsCount}: {studentsCount: number, newStudentsCount: number}): number {
  const consumerGroup = mealRecord.getCellValueAsString('Потребители');

  let personCount = 0;
  switch (consumerGroup) {
    case 'новые студенты':
      personCount = newStudentsCount;
      break;
    case 'все студенты':
      personCount = studentsCount;
      break;
    case 'старые студенты':
      personCount = studentsCount - newStudentsCount;
      break;
    default:
      throw new Error('unknown consumer type, can be only все студенты, новые студенты, старые студенты')
  }

  return personCount;
}

export function getIngredientsForMealsList(mealsList, {mealsRecords, mealIngredientsRecords, ingredientsRecords, studentsCount, newStudentsCount}): IngredientWithPortion[]  {
  let ingredientsForTheDayArr: IngredientWithPortion[] = [];

  for (const meal of mealsList) {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    const currentMealIngredients = mealIngredientsRecords.filter((el) => {
      const cell = el.getCellValue("Meal") as any; // TODO: find out Type
      return cell[0].name === mealRecord.name;
    });
    ingredientsForTheDayArr = ingredientsForTheDayArr.concat(
      currentMealIngredients.map((el) => {
        const mealId = el.getCellValue("Meal")[0].id;
        const meal = mealsRecords.find(el => el.id === mealId) as Record;

        const ingredientRecord = ingredientsRecords.find(elem => elem.id === el.getCellValue('Ingredient')[0].id) as Record;
        let personCount = getPersonCountByMeal(meal, {studentsCount, newStudentsCount});
        return {
          ingredient: el.getCellValueAsString("Ingredient"),
          count: calculateTolalByPersonCount({
            personCount,
            count: el.getCellValue("Count") as number,
            measurePoint: getMeasureTotalPointByIngredientName( ingredientsRecords, el.getCellValueAsString("Ingredient"))
          }),
          type: getMeasureTotalPointByIngredientName(
            ingredientsRecords,
            el.getCellValueAsString("Ingredient")
          ),
          comment: ingredientRecord.getCellValueAsString('Советы по закупкам') ? ingredientRecord.getCellValueAsString('Советы по закупкам') : '',
          purchasePlaceName: ingredientRecord.getCellValueAsString('Место покупки') ? ingredientRecord.getCellValueAsString('Место покупки') : '' 
        }
      }
      )
    );
  }

  let combinedIngredientsForTheDayArr: IngredientWithPortion[] = [];

  for (const ingredientForTheDay of ingredientsForTheDayArr) {
    if (
      combinedIngredientsForTheDayArr.some(
        (el) => el.ingredient === ingredientForTheDay.ingredient
      )
    ) {
      combinedIngredientsForTheDayArr.find((el, i) => {
        if (el.ingredient === ingredientForTheDay.ingredient) {
          combinedIngredientsForTheDayArr[i] = {
            ingredient: el.ingredient,
            count: el.count + ingredientForTheDay.count,
            type: el.type,
            comment: el.comment,
            purchasePlaceName: el.purchasePlaceName,
          };
        }
      });
    } else {
      combinedIngredientsForTheDayArr.push(ingredientForTheDay);
    }
  }
  combinedIngredientsForTheDayArr = combinedIngredientsForTheDayArr
    .filter((el) => el.ingredient !== "Вода")
    .sort(function(a, b) {
      var textA = a.ingredient.toUpperCase();
      var textB = b.ingredient.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })

  return combinedIngredientsForTheDayArr;
}