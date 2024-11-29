# Python Treasure Hunt! 🗺️

Welcome to the **Python Treasure Hunt** project! This interactive coding challenge is designed to help kids learn Python programming in a fun and engaging way. By solving challenges, they can unlock clues and progress through a mini scavenger hunt, right at home!

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Creating Your Own Challenges](#creating-your-own-challenges)
- [Resources](#resources)
- [Contributing](#contributing)

## Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/michellejw/code-game.git
   cd code-game
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

4. **Open Your Browser**: Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action!

## Project Structure

The project is organized as follows:

```
.
├── src
│ ├── app
│ ├── components
│ ├── lib
│ └── styles
├── README.md
└── package.json
```

- **src/app**: Contains the main application files.
- **src/components**: Reusable components for the application.
- **src/lib**: Contains utility functions and challenge definitions.
- **src/styles**: Global styles for the application.

## How It Works

The Python Treasure Hunt consists of a series of coding challenges that kids can solve to progress. You'll need to edit the clues based on where they're hidden in your house. And you may want to edit the challenges to make them more appropriate for your child.

Each challenge includes:

- **A Description**: Explains what the child needs to do.
- **Initial Code**: Provides a starting point for the challenge.
- **Validation**: Checks if the output is correct.
- **Clues**: Hidden messages that are used to unlock the next challenge.

### Example Challenge

**Challenge: Print Your Name**

```python
name = "your_name"
print("Hello, " + name)
```

Kids will learn to modify the code to print their name, unlocking the codes for each challenge in the treasure hunt!

## Creating Your Own Challenges

You can easily add new challenges by following these steps:

1. **Define the Challenge**: In src/lib/challenges.ts, create a new challenge object with the following properties:

   - id: Unique identifier for the challenge.
   - title: Title of the challenge.
   - description: Instructions for the challenge.
   - initialCode: Starting code for the challenge.
   - validateOutput: Function to validate the output.
   - nextClue: Clue for the next challenge.
   - unlockCode: Code to unlock the next clue.

2. **Test Your Challenge**: Run the application and ensure your new challenge works as expected.

## Resources

- [Python Documentation](https://docs.python.org/3/)
- [Learn Python](https://www.learnpython.org/)
- [CodeMirror Documentation](https://codemirror.net/doc/manual.html)

## Contributing

Contributions are welcome! If you have ideas for new challenges or improvements, feel free to submit a pull request or open an issue.
