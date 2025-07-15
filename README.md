# Recipe Finder

A modern web application that helps users find delicious recipes based on ingredients they have on hand. Built with React, TypeScript, and styled with CSS.

![Recipe Finder App Screenshot](https://via.placeholder.com/800x400?text=Recipe+Finder+App)

## Features

- **Ingredient-based Search**: Find recipes by entering ingredients you have available
- **Advanced Filtering**: Filter recipes by cuisine type and dietary preferences
- **Favorites**: Save your favorite recipes for quick access
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Recipe Details**: View detailed instructions, ingredients, and images for each recipe

## Project Structure

The application is organized with a component-based architecture:

```
src/
├── components/            # UI Components
│   ├── AdvancedFilters/   # Filtering UI components
│   ├── AppContent/        # Main application content
│   ├── Messages/          # UI message components
│   ├── RecipeList/        # Recipe listing components
│   ├── SearchBar/         # Search interface
│   └── ...                # Other components
├── context/               # React context providers
├── services/              # API and data services
├── types/                 # TypeScript type definitions
└── ...                    # App configuration files
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type safety and developer experience
- **CSS** - Styling
- **Context API** - State management
- **TheMealDB API** - Recipe data source

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipe-finder.git
   cd recipe-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## How to Use

1. **Search for Recipes**:
   - Enter ingredients separated by commas in the search bar
   - Press Enter or click "Find Recipes"

2. **Filter Results**:
   - Use the cuisine selector to filter by cuisine type
   - Select dietary options to filter by dietary preferences

3. **Save Favorites**:
   - Click the star icon on any recipe to add it to favorites
   - Use the "Show Favorites" button to view your saved recipes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Recipe data provided by [TheMealDB API](https://www.themealdb.com/api.php)
- Icons from [Font Awesome](https://fontawesome.com/)
- Created with [Create React App](https://github.com/facebook/create-react-app)
