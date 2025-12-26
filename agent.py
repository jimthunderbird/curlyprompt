import os
import sys
import re
import toml
import shutil
from pathlib import Path

def main():
    if len(sys.argv) < 2:
        print("usage: ")
        print("agent <prompt_file>")
        print("python agent.py <prompt_file>")
        return

    prompt_file = sys.argv[1]
    current_directory = os.path.dirname(os.path.abspath(__file__))
    config = toml.load(os.path.join(current_directory, "config.toml"))
    prompt_cache_directory = config["promptcache"]["directory"]
    agent = config["codegen"]["agent"]
    mode = config["agent"][agent]["mode"]
    model = config["agent"][agent]["model"]
    python_version = config["python"]["version"]

    prompt_file_basename = os.path.basename(prompt_file)
    prompt_file_dir = os.path.dirname(os.path.abspath(prompt_file))
    with open(prompt_file, 'r') as f:
        prompt_file_content = f.read()

    prompt_base_directory = os.path.join(current_directory, "prompts") + os.sep
    prompt_non_base_directory = prompt_file_dir.replace(prompt_base_directory, "", 1)
    if prompt_non_base_directory == prompt_file_dir:
        prompt_non_base_directory = ""

    prompt_file_fullpath_in_cache_directory = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory)
    prompt_file_fullpath_in_cache = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory, prompt_file_basename)
    prompt_file_fullpath_in_cache_script = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory, prompt_file_basename + ".py")
    prompt_file_fullpath_in_cache_output = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory, prompt_file_basename + ".output")

    os.makedirs(prompt_file_fullpath_in_cache_directory, exist_ok=True)
    os.makedirs(os.path.dirname(prompt_file_fullpath_in_cache), exist_ok=True)

    # Process @context(...) patterns
    context_pattern = r'@context\((.*?)\)'
    for match in re.finditer(context_pattern, prompt_file_content):
        context_file = match.group(1).strip("'\"")
        context_file_path = os.path.join(prompt_file_dir, context_file)
        with open(context_file_path, 'r') as f:
            context_content = f.read()
        prompt_file_content = prompt_file_content.replace(match.group(0), "", 1)
        prompt_file_content = f"{context_content}\n{prompt_file_content}"

    prompt_file_content = prompt_file_content.strip()

    prompt_file_content_in_cache = ""
    if os.path.exists(prompt_file_fullpath_in_cache):
        with open(prompt_file_fullpath_in_cache, 'r') as f:
            prompt_file_content_in_cache = f.read()

    if prompt_file_content == prompt_file_content_in_cache:
        if os.path.exists(prompt_file_fullpath_in_cache_script):
            with open(prompt_file_fullpath_in_cache_output, 'r') as f:
                prompt_file_output_content = f.read().strip()
            non_python_runtime = ""
            first_line = prompt_file_output_content.split('\n')[0] if prompt_file_output_content else ""
            if not first_line.startswith("```python"):
                non_python_runtime = first_line.replace("```", "").strip()
            if non_python_runtime:
                cmd = f"python{python_version} {prompt_file_fullpath_in_cache_script} > {prompt_file_fullpath_in_cache_script}.output; {non_python_runtime} {prompt_file_fullpath_in_cache_script}.output"
            else:
                cmd = f"python{python_version} {prompt_file_fullpath_in_cache_script}"
            os.system(cmd)
            return

    # Save to cache
    with open(os.path.join(current_directory, prompt_cache_directory, "_realtime_prompt.prompt"), 'w') as f:
        f.write(prompt_file_content)
    with open(prompt_file_fullpath_in_cache, 'w') as f:
        f.write(prompt_file_content)

    if mode == "cli":
        command = config["agent"][agent]["command"]
        command = command.replace("<model>", model)
        command = command.replace("<version>", python_version)
        command = command.replace("<prompt_file_content>", prompt_file_content)
        command = command.replace("<prompt_cache_directory>", prompt_cache_directory)

        prompt_output = os.popen(command).read().strip()

        is_python_script = False
        non_python_runtime = ""
        first_line_of_prompt_output = prompt_output.split('\n')[0] if prompt_output else ""
        if first_line_of_prompt_output.startswith("```"):
            if first_line_of_prompt_output.startswith("```python"):
                is_python_script = True
            else:
                non_python_runtime = first_line_of_prompt_output.replace("```", "").strip()
            prompt_output = '\n'.join(prompt_output.split('\n')[1:-1]).strip()
        if prompt_output.endswith("```"):
            prompt_output = '\n'.join(prompt_output.split('\n')[:-1]).strip()

        with open(os.path.join(current_directory, prompt_cache_directory, "_realtime_prompt.codeblock"), 'w') as f:
            f.write(prompt_output)

        if not is_python_script:
            prompt_output = f'print("""{prompt_output}""")'

        with open(os.path.join(current_directory, prompt_cache_directory, "_realtime_prompt_script.py"), 'w') as f:
            f.write(prompt_output)
        with open(prompt_file_fullpath_in_cache_script, 'w') as f:
            f.write(prompt_output)

        try:
            if is_python_script:
                process = os.popen(f"python{python_version} {os.path.join(current_directory, prompt_cache_directory, '_realtime_prompt_script.py')}")
                with open(os.path.join(current_directory, prompt_cache_directory, "_realtime_prompt.output"), 'w') as f:
                    for line in iter(process.readline, ''):
                        f.write(line)
                        print(line, end='')
            else:
                prompt_output = os.popen(f"python{python_version} {os.path.join(current_directory, prompt_cache_directory, '_realtime_prompt_script.py')}").read()
                with open(os.path.join(current_directory, prompt_cache_directory, "_realtime_prompt.output"), 'w') as f:
                    f.write(prompt_output)
                if non_python_runtime:
                    os.system(f"{non_python_runtime} {os.path.join(current_directory, prompt_cache_directory, '_realtime_prompt.output')}")
        except Exception as e:
            print(e)

if __name__ == "__main__":
    main()

