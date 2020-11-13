# Setting up Python environment

## Requirements:
1. Python 3.9.0 - download and install from [python.org](https://www.python.org/downloads/) or use your system's package manager

2. pipenv - a Python package installed using Python's package manager, pip

    to install, execute this in shell:

    `pip install pipenv`

## Virtual environments

In Python it is advisable to use virtual environments for development and running scripts or applications. A virtual environment (*venv*) is basically a separate Python Interpreter with additional libraries scoped to a single project. It can also use a different version of Python than your system's. This ensures that no compatibility issues occur between Python and/or project's dependencies versions.

## Pipenv

In this project we use Pipenv, which combines a virtual environment and a venv-scoped pip. It ensures that packages' versions are compatible with each other. Pipenv also enables separation of project's development dependencies (linter, formattter, etc.) and runtime dependencies. Pipenv uses two files to track dependencies: Pipfile and Pipfile.lock.

- **Pipfile** is used to track project's top level dependencies with an option to specify required versions
- **Pipfile.lock** is used to track project's dependencies and all their subdependencies with specified versions of those and hashes of those packages to ensure Pipfile.lock and the venv are synchronized

### Using Pipenv

Execute all shell commands from within the project (where Pipfile is located). If pipenv doesn't find a venv for the directory, it will create a new one. Use `pipenv help` for more info. All commands required for basic usage for this project:

- `pipenv install` - installs **runtime** dependencies listed in Pipfile
- `pipenv install --dev` - installs **runtime and dev** dependencies listed in Pipfile
- `pipenv install <package>` - installs package from pypi - use this the same way you would use pip;
    - after installing the package, locks dependencies - this may take a while with many dependencies; you can use `--skip-lock`, but remember to run `pipenv lock` before commiting new dependencies
- `pipenv install --dev <package>` - same as above but marks the package as a dev requirement
- `pipenv run ...` - executes a command from within the venv
    - also loads environment variables from `.env` if it is present
- `pipenv shell` - starts a new shell session from within the venv
    - all further commands will be executed using Python interpreter and packages available in venv only
    - use `exit` to exit
    - loads environment from `.env` if available, so any changes to `.env` require a shell reload

To run scripts in this project you need only:
- `pipenv install`
- `pipenv run`, for example `pipenv run py main.py`