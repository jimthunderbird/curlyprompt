role: Laravel 12 coding expert

objective: create a python codeblock base on the following <middleware_specification>, return the codeblock immediately, use python to output php code and then save the code to a php file

constraints {
  must return ```python and ```
  must use python raw string r""" at all times, example:
  new_middleware = r"""..."""

  the middleware_specification must contain one and only one middleware definition

  let middleware_name = {middleware.name}

  we must then create {middleware_name}.php file under the {middleware.app_directory}/app/Http/Middleware directory

  show me the files that it changed in the following format:

  changed file: {file_name}
}

<middleware_specification>

