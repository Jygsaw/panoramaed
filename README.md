Instructions:
1)  Install node.js
2)  Clone repo
    - "git clone https://github.com/jygsaw/panoramaed"
3)  Check out "master" branch
    - "git checkout master"
4)  Run script using node
    - node templater.js <template file> <data file> <output file>
    - "node templater.js template.panoramatemplate data.json output.html"

Assumptions:
- "EACH" tokens will not be surrounded by html
- "EACH" tokens will only appear once per line
- substitution tokens may appear more than once per line
