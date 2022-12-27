import React from "react";
import Record from "@airtable/blocks/dist/types/src/models/record";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {calculateTolalByPersonCount, getMeasureTotalPointByIngredientName } from "./shared";

type ReferenceType = {
  id: "string";
  name: "string";
};

type ReferenceRecordType = ReferenceType[] | null;

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Roboto",
  },
  listItem: {
    margin: 3,
    marginLeft: 12,
    fontSize: 12,
    fontFamily: "Roboto",
  },
  text: {
    margin: 12,
    fontSize: 12,
    // textAlign: 'justify',
    fontFamily: "Roboto",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

type MenuProps = {
  menuItem: Record;
  mealsRecords: Record[];
  mealIngredientsRecords: Record[];
  studentsCount: number;
  ingredientsRecords: Record[];
};

// Create Document Component
function MenuDocument({
  menuItem,
  mealIngredientsRecords,
  mealsRecords,
  studentsCount,
  ingredientsRecords
}: MenuProps) {
  const dayNumber = menuItem.name;
  const dayMeals = menuItem.getCellValue("Блюда") as ReferenceRecordType;

  const mDocs = dayMeals.map((meal) => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return (
      <MealDocument
        key={meal.id}
        mealIngredientsRecords={mealIngredientsRecords}
        mealRecord={mealRecord}
        studentsCount={studentsCount}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.title}>{dayNumber} </Text>
        {mDocs}
      </Page>
    </Document>
  );
}

export default MenuDocument;

type MealDocumentProps = {
  mealRecord: Record;
  mealIngredientsRecords: Record[];
  studentsCount: number;
  ingredientsRecords: Record[];
};

function MealDocument({
  mealRecord,
  mealIngredientsRecords,
  studentsCount,
  ingredientsRecords,
}: MealDocumentProps): JSX.Element {
  const currentMealIngredients = mealIngredientsRecords.filter((el) => {
    const cell = el.getCellValue("Meal") as any; // TODO: find out Type
    return cell[0].name === mealRecord.name;
  });
  
  const ingredients = currentMealIngredients.map((el) => (
    <Text style={styles.listItem}>
      {"- "}
      {el.getCellValueAsString("Ingredient")}: 
      {" "}
      {calculateTolalByPersonCount(
        studentsCount,
        el.getCellValue('Count') as number
      )}{" "}
      {getMeasureTotalPointByIngredientName(ingredientsRecords, el.getCellValueAsString("Ingredient"))}
    </Text>
  ));


  const recipe = mealRecord.getCellValueAsString("Рецепт приготовления");
  return (
    <>
      <Text style={styles.subtitle}>{mealRecord.name}</Text>
      <Text style={styles.text}>{recipe}</Text>
      <Text style={styles.text}>Ингредиенты на {studentsCount} человек:</Text>
      {ingredients}
    </>
  );
}

