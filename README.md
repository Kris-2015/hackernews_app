This project is inspired from hacker news website which is being developed using ReactJs. It is intended to provide list of news as per the search request. It is still in developing stage and we're intended to implement new features to enhance the application and useful for the viewers.

You can find the demo of the project @ http://safe-chamber-33043.herokuapp.com/

## Table of Contents

- [Project Setup](#project-setup)
- [Coding Guidelines](#coding-guidelines)

## Project Setup

1. Do npm install and yarn install
2. To start the project, do npm start

## Coding Guidelines

### BASICS RULE
    - Only include one component per file
        -  However, multiple Stateless, or Pure, Components are allowed per file
    - Do not use React.Component or React.createClass() for creating react class component. Instead, do like “import React, {Component} from ‘react’.
    example:
        Declaring Class component
        
        // bad
        const Listing = React.createClass({
        // ..
            render() {
                return <div>{this.state.hello}</div>;
               }
        });

        // good
        import React, {Component} from ‘react’;
        
        class Listing extends Component {
            //...
            render() {
                 return <div>{this.state.hello}</div>;
        }
    }

### Naming

    - File Name: File name of the component should should be in pascal case
    - File Extension: As per Facebook-React Community, to declare a js file as jsx, you need to write at the starting portion of the file import React from ‘react’ to be recognised from react as jsx.
    - Reference Naming:  Use Pascal Case for declaring React Component and Camel Case for instance.
    
### Component Naming
    - Component name and file name should be same.
    - For the root component of the application, use index.js as filename
    
### Props Naming
    - Always use CamelCase for props name
    - Avoid declaring props when they are not in use
    
### Alignment
    - Example of the component alignment.
    
    // Type 1
    <MyComponent
        className="class-name"
        type="button"
    />
    
    // Type 2
    <MyComponent
        className="class-name"
        type="button"
    >
        Button
    </MyComponent>
    
### Quotes
    - Always use double quotes for jsx attributes but for simple string use single quotes

### Indentation
    - Use 4 space indentation
    
### Parenthesis
    - Start writing class and function with open  braces in the same line
        
        Example:
            
            // Function declaration
            helloWorld() {
                // statements...
            } 
            
            // Class declaration
            class hello extends Component {
            
                render() {
                    return <div>Hello</div>
                }
            }

### Tags

    - Always self close the tag which does not have close tag
            Example:
                <Foo />
                
    - If a component has a multi-line attribute then close the tag in new line.
            Example:
                <Foo
                    className="hello"
                    type="button"
                >
                    Button
                </Button>

### Methods
    - Use ES6 arrow function to close over local variable
    Example:
        class hello extends Component {
            //...
            
            render () {
                return let hello = () => <h3> hello </h3>
            }
        }
    
    - Bind event handler or class function inside the constructor instead of binding it in render function. To avoid the performance issue, it is best to bind the function once and use it n number of times.
    Example:
            class hello extends Component {
                contructor(props) {
                    super(props);
                    
                    this.clickHandler = this.clickHandler.bind(this);
                }
                
                clickHandler() {
                    console.log('Button clicked!');
                }
                
                render() {
                    return 
                    <button
                        type="button"
                        onClick={this.clickHandler}
                     >
                        Submit
                    </button>;
                }
            }
            
