import Record from "@airtable/blocks/dist/types/src/models/record";

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
    default:
      return "ошибка...";
  }
}

export function calculateTolalByPersonCount(studentsCount: number,  count: number, leftoverCount?: number): number {
  let result = (count / 1000) * studentsCount;
  if (leftoverCount) {
    result -= leftoverCount;
  }

  return Math.round(result * 10) / 10;
}
