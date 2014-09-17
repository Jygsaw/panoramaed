Panorama Education Coding Assignment

Your mission, should you choose to accept it, is to write a web templating engine, similar to eRuby or Jade (but fortunately much simpler). You will write code whose inputs are a template file (e.g., template.panoramatemplate) and a JSON data file (e.g., data.json), and which outputs an HTML file (e.g., output.html) with substitutions made according to the template and the data file.

The template file will be in mostly-HTML but will contain some places to insert values from the object list. These places are denoted by the <* and *> symbols. For example, <* title *> indicates that we should substitute the value of the key title from the JSON data at that point in the template. (Spaces between the asterisks and the variable are optional.) <* course.name *> indicates that we should substitute in the name attribute of course in our data object. And looping constructs are also possible, with a <* EACH arrayName itemName *> ... <* ENDEACH *> construct.

For a more detailed example, take a look at the attached example template and data files, which should produce the attached output file.

If at all possible, we'd love if your code was runnable as a command-line command called templater, in the following format:

templater template.panoramatemplate data.json output.html

Other notes:
You may have to make assumptions about the desired behavior of this engine. You may make any assumptions you like as long as you let us know what they are.
There is no time limit for this assignment, so don't feel any pressure to get us your code in half an hour. On the other hand, don't ruin your weekend working on this.
Your solution may be in any language you like. We like seeing Ruby in particular as it's our primary language but you should feel free to use whichever language you feel most comfortable in. If your language of choice prohibits these specifications, you may make any reasonable changes to the specifications; just explain what they are.
We'd like you to write code that you feel proud of and that reflects what you would write in a work environment. We're looking for robustness, clarity, elegance, modularity, extensibility, efficiency, and creativity.
Have fun!

The Panorama Team

Submit your test here:
http://boards.greenhouse.io/tests/35550924adb66bd525c7c71037950f9d