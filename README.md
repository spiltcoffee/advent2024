# advent

My repository of answers for Advent of Code: https://adventofcode.com/

> [!NOTE]
>
> To avoid [AoC copyright issues](https://adventofcode.com/about#faq_copying), the inputs
> to the answers are in a private repository, referenced via a submodule.
>
> If you want to run these answers for yourself, you will need to replicate the following folder
> structure:
>
> ```
> inputs/
>   <year>/
>     <day>/
>       real.txt
>       test.txt
> ```

# Running

```bash
$ npm install

# Use examples from questions
$ npm run test

# Run specific day
$ npm run test 3

# Run specific year
$ npm run test 3 -- --year 2022

# Use real input
$ npm run real

# Run specific day
$ npm run real 3

# Run specific year
$ npm run real 3 -- --year 2022
```
