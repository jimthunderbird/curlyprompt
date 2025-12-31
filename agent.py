import sys
import os
import re
import toml
from pathlib import Path

if len(sys.argv) < 2:
    print("usage: ")
    print("agent <prompt_file>")
    print("python agent.py <prompt_file>")
    sys.exit(1)

rerun = False
if "--rerun" in sys.argv:
    rerun = True

config = toml.load("config.toml")
prompt_cache_directory = config["promptcache"]["directory"]
agent = config["codegen"]["agent"]
mode = config["agent"][agent]["mode"]
model = config["agent"][agent]["model"]
python_version = config["python"]["version"]

prompt_file = sys.argv[1]
prompt_file_basename = os.path.basename(prompt_file)
prompt_file_dir = os.path.abspath(os.path.dirname(prompt_file))
prompt_file_content = open(prompt_file, "r").read()

current_directory = os.path.dirname(os.path.abspath(__file__))
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

for match in re.findall(r'@context\((.*?)\)', prompt_file_content):
    context_file = os.path.join(prompt_file_dir, match.strip('\'"'))
    context_file_content = open(context_file, "r").read()
    prompt_file_content = prompt_file_content.replace(f"@context({match})", "", 1)
    prompt_file_content = f"{context_file_content}\n{prompt_file_content}"

prompt_file_content = prompt_file_content.strip()

prompt_file_content_in_cache = ""
if os.path.exists(prompt_file_fullpath_in_cache):
    with open(prompt_file_fullpath_in_cache, "r") as f:
        prompt_file_content_in_cache = f.read()

if not rerun:
    if prompt_file_content == prompt_file_content_in_cache:
        if os.path.exists(prompt_file_fullpath_in_cache_script):
            os.system(f"python{python_version} {prompt_file_fullpath_in_cache_script}")
            sys.exit(1)

with open(os.path.join(prompt_cache_directory, "_realtime_prompt.prompt"), "w") as f:
    f.write(prompt_file_content)

with open(prompt_file_fullpath_in_cache, "w") as f:
    f.write(prompt_file_content)

if mode == "cli":
    command = config["agent"][agent]["command"]
    command = command.replace("<model>", model)
    command = command.replace("<version>", python_version)
    command = command.replace("<prompt_file_content>", prompt_file_content)
    command = command.replace("<prompt_cache_directory>", prompt_cache_directory)

    import subprocess
    prompt_output = subprocess.check_output(command, shell=True, text=True)

    with open(prompt_file_fullpath_in_cache_output, "w") as f:
        f.write(prompt_output)

    prompt_output = prompt_output.strip()

    is_python_script = False
    non_python_runtime = ""

    first_line_of_prompt_output = prompt_output.split('\n')[0] if prompt_output else ""
    if first_line_of_prompt_output.startswith("```"):
        if first_line_of_prompt_output.startswith("```python"):
            is_python_script = True
        else:
            non_python_runtime = first_line_of_prompt_output.replace("```", "").strip()
        prompt_output = '\n'.join(prompt_output.split('\n')[1:]).strip()

    if prompt_output.endswith("```"):
        prompt_output = '\n'.join(prompt_output.split('\n')[:-1]).strip()

    with open(os.path.join(prompt_cache_directory, "_realtime_prompt.codeblock"), "w") as f:
        f.write(prompt_output)

    if not is_python_script:
        with open(os.path.join(prompt_cache_directory, "_realtime_prompt.codeblock"), "r") as f:
            prompt_output = f.read()
        prompt_output = f'print("""{prompt_output}""")'

    with open(os.path.join(prompt_cache_directory, "_realtime_prompt_script.py"), "w") as f:
        f.write(prompt_output)

    with open(prompt_file_fullpath_in_cache_script, "w") as f:
        f.write(prompt_output)

    try:
        if is_python_script:
            process = subprocess.Popen([f"python{python_version}", os.path.join(prompt_cache_directory, "_realtime_prompt_script.py")], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            with open(os.path.join(prompt_cache_directory, "_realtime_prompt.output"), "w") as f:
                for line in process.stdout:
                    f.write(line)
                    print(line, end='')
        else:
            prompt_output = subprocess.check_output([f"python{python_version}", os.path.join(prompt_cache_directory, "_realtime_prompt_script.py")], text=True)
            with open(os.path.join(prompt_cache_directory, "_realtime_prompt.output"), "w") as f:
                f.write(prompt_output)
            subprocess.run([non_python_runtime, os.path.join(prompt_cache_directory, "_realtime_prompt.output")])
    except Exception as e:
        print(e)

