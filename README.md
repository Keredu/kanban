# Kanban-back


This is the repository where the back-end part of the Kanban project is hosted. The front-end is located [here](https://github.com/Keredu/kanban-front).


## Get Started
1. Clone the repository

```
git clone git@github.com:Keredu/kanban.git
```

2. Install dependencies
```
npm ci
``` 

1. Deploy the back end with:
```
node src/app.js
``` 



## Documentation
The documentation is built using JSDoc. First, make sure you have followed the getting started section. Then, run:
```
npm run docs
```


## Contributions
### Main branches
This project has two permanent branches:

- main: it is the main branch of the project and it is where the latest productive version is saved.
- dev: this branch serves to integrate all the features or fixes that occur during development.

### Contribute
If you want to contribute to the project, you must create a new branch as follows:

1. Move to the dev branch with the `git checkout dev` command.
2. Update said branch with the latest changes with `git pull`.
3. Check that the dev branch is updated, then use `git checkout -b <branch_name>`.
4. The following standard will be used for the branch name:
    - If the branch adds a new **feature** the branch name will be feature/name.
    - If the branch applies a **fix** the branch name will be fix/name.

To integrate the changes, you must make a pull-request pointing to the dev branch and assign it to another developer to validate that these changes are correct.