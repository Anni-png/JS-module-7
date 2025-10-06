"use strict";

const chalk = require("chalk");
const prompt = require("prompt-sync")({ sigint: true });
const cakeRecipes = require("./cake-recipes.json");

// variable containing stored recipes
let savedRecipes = [];

// funktion 1: find and display authors

function getUniqueAuthors(recipes) {
  const authors = []; // empty Array, collecting authors
  recipes.forEach((recipe) => {
    const author = recipe.Author;
    if (!authors.includes(author)) {
      authors.push(author);
    }
  });
  return authors;
}

// function 2: search for and display recipes names

function printRecipeNames(recipes) {
  if (recipes.length === 0) {
    console.log("no recipes found");
    return;
  }
  recipes.forEach((recipe) => {
    const { Name } = recipe;
    console.log(Name);
  });
}

// function 3: recipes by author

function getRecipesByAuthor(recipes, authorName) {
  return recipes.filter((recipe) => recipe.Author === authorName);
}

// function 4: search for recipes by ingredient

/**
 * Search recipes by an ingredient (case-insensitive and robust).
 *
 * - If the user input is empty or not a string, we return an empty array right away.
 * - We convert the search term to lower-case (needle) so the match ignores letter case.
 * - For each recipe we check Ingredients is an array (defensive check).
 * - Then we check if any ingredient string in the recipe includes the needle.
 */
function getRecipesByIngredient(recipes, ingredient) {
  // 1) Defensive: if ingredient is missing or not a string, return an empty result
  if (!ingredient || typeof ingredient !== "string") return [];

  // 2) Normalize the search term to lower-case to make the search case-insensitive
  const needle = ingredient.toLowerCase();

  // 3) Filter the recipes array and keep only those that match the needle
  return recipes.filter(
    (recipe) =>
      // 3a) Make sure recipe.Ingredients exists and is an array (prevents runtime errors)
      Array.isArray(recipe.Ingredients) &&
      // 3b) some() returns true if at least one ingredient matches the needle
      recipe.Ingredients.some((item) =>
        // Convert the ingredient to a string, toLowerCase it, and check for inclusion
        // String(item) protects against non-string values (null/number/etc).
        String(item).toLowerCase().includes(needle)
      )
  );
}

// function 5 listing the ingredients of saved recipes

function getRecipeByName(recipes, name) {
  return recipes.find((recipe) =>
    recipe.Name.toLowerCase().includes(name.toLowerCase())
  );
}

// function 6 show saved recipes

/**
 * Get a flat list of all ingredients from an array of recipe objects.
 *
 * - Uses reduce to concatenate ingredients arrays from each recipe into one array.
 * - Uses a clear accumulator name `acc` (short for accumulator) so it's easy to read.
 * - If a recipe doesn't have Ingredients or it's not an array, we skip it.
 */
function getAllIngredients(recipes) {
  return recipes.reduce((acc, recipe) => {
    // If recipe.Ingredients is an array, concatenate it to the accumulator
    if (Array.isArray(recipe.Ingredients)) {
      return acc.concat(recipe.Ingredients);
    }
    // Otherwise, just return the accumulator unchanged
    return acc;
  }, []); // Start with an empty array as the accumulator
}

// Part 2

/**
 * Show the menu and return a validated integer choice.
 *
 * - We read the raw input from the user.
 * - Convert it with Number(...) and then check Number.isInteger to accept only integer values.
 * - If the input is not an integer (e.g. "abc" or "1.5"), we return NaN so the caller can treat it as invalid.
 */
const displayMenu = () => {
  console.log(chalk.green("\nRecipe Management System Menu:"));
  console.log(chalk.green("1. Show All Authors"));
  console.log(chalk.green("2. Show Recipe names by Author"));
  console.log(chalk.green("3. Show Recipe names by Ingredient"));
  console.log(chalk.green("4. Get Recipe by Name"));
  console.log(chalk.green("5. Get All Ingredients of Saved Recipes"));
  console.log(chalk.green("0. Exit"));

  // Read exactly what the user typed (string)
  const choice = prompt(chalk.green("Enter a number (1-5) or 0 to exit: "));

  // Convert to Number. Number("2") -> 2, Number("abc") -> NaN
  const n = Number(choice);

  // Return the integer if valid, otherwise return NaN so the caller can handle invalid input
  return Number.isInteger(n) ? n : NaN;
};

let choice;

do {
  choice = displayMenu();

  switch (choice) {
    case 1:
      console.log("Unique Authors:");
      getUniqueAuthors(cakeRecipes).forEach((author) =>
        console.log("- " + author)
      );
      break;

    case 2:
      const authorsName = prompt("Enter author´s name: ");
      const recipesByAuthor = getRecipesByAuthor(cakeRecipes, authorsName);
      if (recipesByAuthor.length === 0) {
        console.log("no recipes found by this author.");
      } else {
        printRecipeNames(recipesByAuthor);
      }
      break;

    case 3:
      const ingredient = prompt("Enter ingredient to search for: ");
      const recipesWithIngredient = getRecipesByIngredient(
        cakeRecipes,
        ingredient
      );
      if (recipesWithIngredient.length === 0) {
        console.log("No recipes found with that ingredient");
      } else {
        printRecipeNames(recipesWithIngredient);
      }
      break;

    case 4:
      const searchName = prompt("Enter recipe name to search for: ");
      const foundRecipe = getRecipeByName(cakeRecipes, searchName);
      if (!foundRecipe) {
        console.log("No recipe found with that name.");
      } else {
        console.log("Recipe found:");
        console.log("Name:", foundRecipe.Name);
        console.log("Author:", foundRecipe.Author);
        console.log("Ingredients:");
        foundRecipe.Ingredients.forEach((ing) => console.log("- " + ing));

        const save = prompt(
          "Save this recipe for your shopping list= (yes/no): "
        );
        if (save.toLowerCase() === "yes") {
          savedRecipes.push(foundRecipe);
          console.log("recipe saved!");
        }
      }
      break;

    case 5:
      if (savedRecipes.length === 0) {
        console.log("No recipes saved yet.");
      } else {
        console.log("All ingredients from saved recipes:");
        const allIngredients = getAllIngredients(savedRecipes);
        allIngredients.forEach((ingredient) => console.log("- " + ingredient));
      }
      break;

    case 0:
      console.log("K Bye!");
      break;
    default:
      console.log("Invalid input. Please enter a number between 0 and 5.");
  }
} while (choice !== 0);
