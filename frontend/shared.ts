import Record from "@airtable/blocks/dist/types/src/models/record";

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

export function calculateTolalByPersonCount(studentsCount: number, count: number): number {
  const result = (count / 1000) * studentsCount;
  return Math.round(result * 10) / 10;
}
